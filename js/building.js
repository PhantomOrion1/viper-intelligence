/* ==========================================================
   Procedural wireframe buildings — rotating holographic massing
   ========================================================== */
(function () {
  const rect = (w, d, x = 0, z = 0) => [[x - w / 2, z - d / 2], [x + w / 2, z - d / 2], [x + w / 2, z + d / 2], [x - w / 2, z + d / 2]];
  const poly = (r, n, x = 0, z = 0, rot = 0, sz = 1) => Array.from({ length: n }, (_, i) => { const a = rot + i / n * Math.PI * 2; return [x + Math.cos(a) * r, z + Math.sin(a) * r * sz]; });
  const Lshape = (w, d, t, x = 0, z = 0) => [[x - w / 2, z - d / 2], [x + w / 2, z - d / 2], [x + w / 2, z - d / 2 + t], [x - w / 2 + t, z - d / 2 + t], [x - w / 2 + t, z + d / 2], [x - w / 2, z + d / 2]];

  function masses(p) {
    const L = p.levels; const f = k => Math.round(L * k);
    switch (p.shape) {
      case 'spire': return [{ fp: rect(1.5, 1.05), a: 0, b: f(.1) }, { fp: poly(.52, 8, 0, 0, Math.PI / 8), a: f(.1), b: f(.93) }, { fp: poly(.36, 8, 0, 0, Math.PI / 8), a: f(.93), b: L }];
      case 'precinct': return [{ fp: rect(.7, .45, -.55, -.4), a: 0, b: L }, { fp: rect(.6, .5, .5, -.45), a: 0, b: f(.7) }, { fp: rect(.75, .4, -.45, .45), a: 0, b: f(.85) }, { fp: rect(.5, .5, .55, .4), a: 0, b: f(.55) }];
      case 'twin': return [{ fp: rect(1.8, 1), a: 0, b: f(.2) }, { fp: rect(.6, .55, -.45, 0), a: f(.2), b: L }, { fp: rect(.55, .5, .5, .05), a: f(.2), b: f(.8) }];
      case 'terraces': return [-.8, -.4, 0, .4, .8].map((x, i) => ({ fp: rect(.34, .7, x, i % 2 ? .08 : 0), a: 0, b: L - (i % 3 === 2 ? 1 : 0) }));
      case 'block': return [{ fp: rect(1.7, 1.15), a: 0, b: L }, { fp: rect(.7, .45), a: 0, b: L, ghost: true }];
      case 'tower': return [{ fp: rect(1.35, .95), a: 0, b: f(.13) }, { fp: Lshape(.95, .8, .4), a: f(.13), b: L }];
      case 'stepped': return [{ fp: rect(1.5, .45, 0, -.35), a: 0, b: L }, { fp: rect(1.5, .35, 0, .05), a: 0, b: f(.66) }, { fp: rect(1.5, .3, 0, .38), a: 0, b: f(.34) }];
      case 'curve': return [{ fp: rect(1.4, 1), a: 0, b: f(.1) }, { fp: poly(.48, 16, 0, 0, 0, .8), a: f(.1), b: L }];
      case 'podium': return [{ fp: rect(1.9, 1.2), a: 0, b: f(.22) }, { fp: rect(.62, .62, -.35, -.1), a: f(.22), b: L }, { fp: rect(.5, .4, .55, .25), a: f(.22), b: f(.5) }];
      case 'masterplan': return [[-.7, -.5, .5], [0, -.55, .8], [.7, -.45, .4], [-.65, .3, .3], [.05, .25, 1], [.7, .4, .6]].map(([x, z, h]) => ({ fp: rect(.42, .38, x, z), a: 0, b: Math.max(2, Math.round(L * h)) }));
    }
    return [{ fp: rect(1, 1), a: 0, b: L }];
  }

  CI.Building = function (canvas, p, opts = {}) {
    const ctx = canvas.getContext('2d'); const M = masses(p); let W = 0, H = 0, dpr = 1;
    const maxL = Math.max(...M.map(m => m.b));
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2); const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    let ang = opts.angle || Math.random() * 6;
    function draw(dt, t, dim = 0) {
      if (!W) return;
      ang += (opts.speed || 0.0035) * dt;
      ctx.clearRect(0, 0, W, H);
      const S = Math.min(W * (opts.big ? .3 : .3), H * .4);
      let fh = (H * (opts.big ? .62 : .58)) / maxL; fh = Math.min(fh, S * .11);
      const baseY = H * (opts.big ? .86 : .84) - (opts.big ? 0 : 0);
      const cx = W / 2; const c = Math.cos(ang), s = Math.sin(ang);
      const P = (x, z, l) => { const rx = x * c - z * s, rz = x * s + z * c; return [cx + rx * S, baseY - l * fh + rz * S * .4, rz]; };
      const al = z => .3 + .7 * Math.max(0, Math.min(1, (z + 1) / 2));
      ctx.globalCompositeOperation = 'lighter';
      // ground grid
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        const g = i / 5 * 1.3;
        let a = P(g, -1.3, 0), b = P(g, 1.3, 0); ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        a = P(-1.3, g, 0); b = P(1.3, g, 0); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      // ground ring
      ctx.strokeStyle = 'rgba(255,46,77,.25)'; ctx.setLineDash([3, 6]); ctx.beginPath();
      for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; const q = P(Math.cos(a) * 1.45, Math.sin(a) * 1.45, 0); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
      ctx.stroke(); ctx.setLineDash([]);

      const built = p.built; const scan = (Math.sin(t / 1400) * .5 + .5) * maxL;
      const step = maxL > 40 ? 2 : 1;
      for (const m of M) {
        const fp = m.fp; const n = fp.length;
        // floors
        for (let l = m.a; l <= m.b; l += (l === m.b ? 1 : step)) {
          const isB = l <= built && built > 0; const near = Math.abs(l - scan) < 1.2;
          ctx.beginPath(); let zs = 0;
          for (let i = 0; i <= n; i++) { const q = P(fp[i % n][0], fp[i % n][1], l); zs += q[2]; i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
          const edge = l === m.a || l === m.b;
          if (m.ghost) { ctx.strokeStyle = `rgba(255,255,255,${.06})`; ctx.stroke(); continue; }
          if (near) { ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.4; ctx.stroke(); ctx.fillStyle = 'rgba(56,232,255,.06)'; ctx.fill(); ctx.lineWidth = 1; continue; }
          if (isB) {
            ctx.strokeStyle = `rgba(255,46,77,${(edge ? .75 : .32) * (1 - dim)})`; ctx.stroke();
            ctx.fillStyle = `rgba(255,46,77,${.018 * (1 - dim)})`; ctx.fill();
          } else {
            ctx.strokeStyle = `rgba(56,232,255,${(edge ? .35 : .1) * (1 - dim)})`; ctx.stroke();
          }
        }
        if (m.ghost) continue;
        // verticals
        for (let i = 0; i < n; i++) {
          const [x, z] = fp[i]; const bt = Math.min(m.b, Math.max(m.a, built));
          const q0 = P(x, z, m.a), q1 = P(x, z, bt), q2 = P(x, z, m.b); const a = al(q0[2]) * (1 - dim);
          if (bt > m.a) { ctx.strokeStyle = `rgba(255,70,95,${.8 * a})`; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); }
          if (bt < m.b) { ctx.strokeStyle = `rgba(56,232,255,${.35 * a})`; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke(); ctx.setLineDash([]); }
        }
      }
      // crane on buildings under structure
      if (p.built > 0 && p.built < p.levels && /Structure/.test(p.stage)) {
        const top = Math.min(maxL, built + 4); const b0 = P(.2, -.15, 0), b1 = P(.2, -.15, top); const j1 = P(1.2, -.15, top), j0 = P(-.5, -.15, top);
        ctx.strokeStyle = 'rgba(255,181,71,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]); ctx.moveTo(j0[0], j0[1]); ctx.lineTo(j1[0], j1[1]); ctx.stroke();
        const hk = P(.2 + (Math.sin(t / 2000) * .5 + .5) * .9, -.15, top); ctx.beginPath(); ctx.moveTo(hk[0], hk[1]); ctx.lineTo(hk[0], hk[1] + 18); ctx.stroke();
        ctx.fillStyle = Math.sin(t / 300) > 0 ? 'rgba(255,46,77,1)' : 'rgba(255,46,77,.2)'; ctx.beginPath(); ctx.arc(j1[0], j1[1], 2, 0, 7); ctx.fill(); ctx.lineWidth = 1;
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    return { draw, resize };
  };
})();
