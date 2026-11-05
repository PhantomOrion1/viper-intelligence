/* ==========================================================
   00 · NEURAL CORE — home
   ========================================================== */
CI.views = CI.views || {};
CI.modules = [
  { id: 'briefing', name: 'Briefing', icon: 'sun', color: '#ffb547', agent: 'Briefing Agent' },
  { id: 'ask', name: 'Ask', icon: 'chat', color: '#38e8ff', agent: 'Research Agent' },
  { id: 'watchdog', name: 'Watchdog', icon: 'radar', color: '#ff2e4d', agent: 'Watchdog Agent' },
  { id: 'actions', name: 'Actions', icon: 'check', color: '#a283ff', agent: 'Minutes Reader' },
  { id: 'projects', name: 'Projects', icon: 'building', color: '#3dffa8', agent: 'File Indexer' },
  { id: 'people', name: 'People', icon: 'users', color: '#ff5ad1', agent: 'People Agent' },
  { id: 'comms', name: 'Comms', icon: 'phone', color: '#ff7a45', agent: 'Comms Bot' },
  { id: 'textbot', name: 'Textbot', icon: 'sms', color: '#5b8cff', agent: 'Reply Agent' }
];
CI.agentRoute = { brief: 'briefing', ask: 'ask', watch: 'watchdog', minutes: 'actions', inbox: 'actions', files: 'projects', people: 'people', comms: 'comms', safety: 'people', reply: 'textbot' };

CI.views.core = function (el) {
  const name = CI.user.name ? ', ' + CI.esc(CI.user.name) : '';
  el.innerHTML = `
  <div class="core">
    <div class="side-panel left stagger">
      <div class="card">
        <div class="card-h"><span class="label">System</span><span class="chip"><span class="dot pulse"></span>LIVE</span></div>
        <div class="statgrid">
          <div class="stat"><b data-count="48213">0</b><span>Documents</span></div>
          <div class="stat"><b data-count="12906">0</b><span>Emails</span></div>
          <div class="stat"><b data-count="10">0</b><span>Projects</span></div>
          <div class="stat"><b data-count="342">0</b><span>Meetings</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><span class="label">Agents</span><span class="mono dim" style="font-size:10px">${CI.agents.length} ACTIVE</span></div>
        <div class="agent-list">${CI.agents.map((a, i) => `
          <div class="agent-row" data-go="${CI.agentRoute[a.id]}" style="--c:${a.color}">
            <span class="av">${CI.icon(a.icon, 15)}</span>
            <span style="min-width:0"><div class="nm">${a.name}</div><div class="ds">${a.desc}</div></span>
            <span class="bar" style="--d:${-i * 0.37}s"><i></i></span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="core-center">
      <div class="core-hello">
        <div class="kicker" style="justify-content:center">NEURAL CORE</div>
        <h1 data-scramble>${CI.greeting()}${name}.</h1>
        <form class="dump" id="dump">
          <input id="dump-in" placeholder="Dump into the brain… or ask anything" autocomplete="off">
          <div class="hint"><span>text · voice · drag a document</span><span style="display:flex;gap:10px;align-items:center">${CI.icon('mic', 14)}${CI.icon('upload', 14)}<span class="kbd">↵</span></span></div>
        </form>
      </div>
      <div class="core-stage" id="stage"><canvas></canvas></div>
    </div>

    <div class="side-panel right stagger">
      <div class="card" style="flex:1">
        <div class="card-h"><span class="label">Live agent feed</span><span class="chip"><span class="dot red pulse"></span>STREAMING</span></div>
        <div class="feed" id="feed"></div>
      </div>
      <div class="card">
        <div class="card-h"><span class="label">Needs you today</span></div>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:13.5px">
          <a href="#/briefing" style="display:flex;justify-content:space-between"><span><span class="dot red" style="display:inline-block;margin-right:8px"></span>Variation VAR-117 decision</span><span class="mono red">$184K</span></a>
          <a href="#/actions" style="display:flex;justify-content:space-between"><span><span class="dot red" style="display:inline-block;margin-right:8px"></span>Actions overdue</span><span class="mono red">3</span></a>
          <a href="#/watchdog" style="display:flex;justify-content:space-between"><span><span class="dot amber" style="display:inline-block;margin-right:8px"></span>Unexplained cost moves</span><span class="mono amber">2</span></a>
        </div>
      </div>
    </div>
  </div>`;

  // feed
  const feed = CI.$('#feed', el); let fi = 0;
  const addFeed = (instant) => {
    const [ag, msg] = CI.feed[fi++ % CI.feed.length]; const a = CI.agent(ag);
    const d = document.createElement('div'); d.className = 'feed-item'; d.style.setProperty('--c', a.color);
    if (instant) d.style.animation = 'none';
    d.innerHTML = `<span class="t">${CI.sydTime()}</span><div><div class="who">${a.name}</div><div class="msg">${msg}</div></div>`;
    feed.prepend(d); while (feed.children.length > 9) feed.lastChild.remove();
    if (!instant) CI.sfx('tick');
  };
  for (let i = 0; i < 5; i++) addFeed(true);
  const fiv = setInterval(addFeed, 2800);

  CI.$$('.agent-row', el).forEach(r => r.onclick = () => location.hash = '#/' + r.dataset.go);
  CI.$('#dump', el).onsubmit = e => { e.preventDefault(); const v = CI.$('#dump-in', el).value.trim(); if (!v) return; CI.pendingQuery = v; location.hash = '#/ask'; };

  // neural core
  const stage = CI.$('#stage', el); const cv = CI.$('canvas', stage); const ctx = cv.getContext('2d');
  const nodes = CI.modules.map((m, i) => {
    const b = document.createElement('a'); b.className = 'orbit-node'; b.href = '#/' + m.id; b.style.setProperty('--c', m.color); b.style.setProperty('--i', i);
    b.innerHTML = `<span class="ring">${CI.icon(m.icon, 22)}</span><span class="nm">${m.name}</span><span class="ag">${m.agent}</span>`;
    stage.appendChild(b); return b;
  });
  let hover = -1;
  nodes.forEach((n, i) => { n.onmouseenter = () => { hover = i; CI.sfx('tick'); }; n.onmouseleave = () => hover = -1; });

  const N = 300, golden = Math.PI * (3 - Math.sqrt(5));
  const P = Array.from({ length: N }, (_, i) => {
    const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * golden;
    const rad = 1 - Math.pow(Math.random(), 2.5) * .75;
    return { x: Math.cos(th) * r * rad, y: y * rad, z: Math.sin(th) * r * rad, ph: Math.random() * 6 };
  });
  const labels = ['Cost Reports', 'Variations', 'Minutes', 'Emails', 'Drawings', 'Contracts', 'Staff Files', 'Programmes', 'RFIs'];
  const clusters = labels.map((l, k) => { const i = Math.floor((k + .5) * N / labels.length); P[i].big = true; P[i].label = l; P[i].x *= 1.05; return i; });
  const E = [];
  P.forEach((a, i) => {
    const d = P.map((b, j) => [j, (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2]).sort((u, v) => u[1] - v[1]);
    for (let k = 1; k <= 3; k++) if (d[k][0] > i) E.push([i, d[k][0]]);
  });
  const links = CI.modules.map(() => Array.from({ length: 9 }, () => (Math.random() * N) | 0));
  let W, H, cx, cy, R, rot = 0, tilt = .35, pulses = [], dpr;
  const pos = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = stage.clientWidth; H = stage.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2; R = Math.min(W, H) * (W < 600 ? .26 : .29);
    const rx = Math.min(R * 1.85, W / 2 - 50), ry = Math.min(R * 1.5, H / 2 - 66);
    nodes.forEach((n, i) => {
      const a = -Math.PI / 2 + i / nodes.length * Math.PI * 2;
      pos[i] = [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
      n.style.left = pos[i][0] + 'px'; n.style.top = pos[i][1] + 'px';
    });
  }
  resize(); const ro = new ResizeObserver(resize); ro.observe(stage);
  let alive = true, last = performance.now(), t0 = last;
  function frame(t) {
    if (!alive) return; requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(50, t - last)) / 16.67; last = t; const e = Math.max(0, t - t0);
    const intro = Math.min(1, e / 1600), ei = 1 - Math.pow(1 - intro, 3);
    rot += .0022 * dt * (hover >= 0 ? .4 : 1);
    const r0 = stage.getBoundingClientRect();
    const mx = ((CI.mouse.x - r0.left) / W - .5), my = ((CI.mouse.y - r0.top) / H - .5);
    tilt += ((.3 + my * .35) - tilt) * .04;
    const yaw = rot + mx * .4;
    ctx.clearRect(0, 0, W, H);
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
    const S = P.map(p => {
      const br = 1 + Math.sin(e / 900 + p.ph) * .015;
      let x = p.x * cyw - p.z * syw, z = p.x * syw + p.z * cyw, y = p.y;
      const y2 = y * ct - z * st, z2 = y * st + z * ct;
      const f = 2.6 / (2.6 - z2); const k = R * ei * br;
      return [cx + x * k * f, cy + y2 * k * f, (z2 + 1) / 2];
    });
    // halo
    const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.4);
    hg.addColorStop(0, 'rgba(255,90,60,.10)'); hg.addColorStop(.6, 'rgba(255,46,77,.04)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, cy, R * 1.4, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    // edges
    ctx.lineWidth = .7;
    for (const [a, b] of E) { const A = S[a], B = S[b]; const d = (A[2] + B[2]) / 2; ctx.strokeStyle = `rgba(255,120,70,${.05 + d * .22})`; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
    // nodes
    for (let i = 0; i < N; i++) {
      const s = S[i], p = P[i]; const tw = .6 + Math.sin(e / 500 + p.ph * 3) * .4;
      if (p.big) {
        ctx.fillStyle = `rgba(255,140,90,${.5 + s[2] * .5})`; ctx.beginPath();
        for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const rr = 4 + s[2] * 3; k ? ctx.lineTo(s[0] + Math.cos(a) * rr, s[1] + Math.sin(a) * rr) : ctx.moveTo(s[0] + Math.cos(a) * rr, s[1] + Math.sin(a) * rr); }
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(255,${100 + s[2] * 60 | 0},70,${(.25 + s[2] * .7) * tw})`; ctx.beginPath(); ctx.arc(s[0], s[1], .8 + s[2] * 1.8, 0, 7); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // labels
    ctx.font = '500 10.5px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    clusters.forEach(i => { const s = S[i]; ctx.fillStyle = `rgba(255,150,110,${.25 + s[2] * .75 * ei})`; ctx.fillText(P[i].label, s[0], s[1] - 10); });
    // hub
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, 7); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 7); ctx.fill();
    // rings
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.beginPath(); ctx.arc(cx, cy, Math.max(.1, R * 1.12 * ei), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ei); ctx.stroke();
    ctx.lineWidth = 1; ctx.setLineDash([2, 8]); ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.24, e / 6000, e / 6000 + Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,46,77,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, -e / 1800, -e / 1800 + .6); ctx.stroke();
    ctx.strokeStyle = 'rgba(56,232,255,.5)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.24, e / 2400 + 2, e / 2400 + 2.35); ctx.stroke();
    // connectors to modules
    CI.modules.forEach((m, i) => {
      if (!pos[i]) return;
      const [dx, dy] = pos[i]; const ang = Math.atan2(dy - cy, dx - cx); const ex = cx + Math.cos(ang) * R * 1.12, ey = cy + Math.sin(ang) * R * 1.12;
      const sx = dx - Math.cos(ang) * 34, sy = dy - Math.sin(ang) * 34; const on = hover === i;
      ctx.strokeStyle = m.color; ctx.globalAlpha = (on ? 1 : .2) * ei; ctx.lineWidth = on ? 2 : 1.4; ctx.setLineDash([3, 5]); ctx.lineDashOffset = -e / 40;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      if (Math.random() < (on ? .12 : .012)) pulses.push({ i, p: 0, v: .012 + Math.random() * .01, out: Math.random() < .4 });
      if (on) {
        ctx.globalCompositeOperation = 'lighter';
        links[i].forEach(j => {
          const s = S[j]; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(s[0], s[1]); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 7); ctx.stroke();
        });
        ctx.globalCompositeOperation = 'source-over';
      }
    });
    pulses = pulses.filter(q => q.p <= 1);
    pulses.forEach(q => {
      q.p += q.v * dt; const [dx, dy] = pos[q.i]; const ang = Math.atan2(dy - cy, dx - cx);
      const ex = cx + Math.cos(ang) * R * 1.12, ey = cy + Math.sin(ang) * R * 1.12; const sx = dx - Math.cos(ang) * 34, sy = dy - Math.sin(ang) * 34;
      const pp = q.out ? q.p : 1 - q.p; const x = ex + (sx - ex) * pp, y = ey + (sy - ey) * pp;
      ctx.fillStyle = CI.modules[q.i].color; ctx.shadowColor = CI.modules[q.i].color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
  }
  requestAnimationFrame(frame);
  return { destroy() { alive = false; clearInterval(fiv); ro.disconnect(); } };
};
