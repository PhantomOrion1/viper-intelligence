/* ==========================================================
   FX — icons, helpers, animation utilities, ambient canvas, boot
   ========================================================== */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  CI.$ = $; CI.$$ = $$;

  const I = {
    core: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.5" stroke-dasharray="2.2 2.6"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    trend: '<path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M11 18h2"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    sheet: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M12 11v8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/>',
    play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
    pause: '<path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    repeat: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chevR: '<path d="M9 18l6-6-6-6"/>', chevL: '<path d="M15 18l-6-6 6-6"/>', chevD: '<path d="M6 9l6 6 6-6"/>',
    arrowR: '<path d="M5 12h14M12 5l7 7-7 7"/>', arrowL: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    sparkle: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 3v4M17 5h4"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6.5-6.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    volume: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    mute: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M23 9l-6 6M17 9l6 6"/>',
    finger: '<path d="M12 11v3a8 8 0 0 1-1.5 4.6"/><path d="M8 11a4 4 0 0 1 8 0v1.5"/><path d="M5 12a7 7 0 0 1 14 0v2"/><path d="M16 15.5a12 12 0 0 1-1 4.5"/><path d="M8.5 14.5a10 10 0 0 1-2 4.5"/><path d="M6.7 5.6A8.9 8.9 0 0 1 12 4a9 9 0 0 1 5.3 1.7"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    teams: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M6 10h6M9 10v5"/><circle cx="18.5" cy="8" r="2"/><path d="M16 12h5v4a2.5 2.5 0 0 1-5 0"/>',
    whatsapp: '<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c.5 2 2 3.5 4 4.5l1.3-1.2 2 1-.4 1.7c-3.8.2-7.4-3.4-7.6-7.2L10 8l1 2z"/>',
    sms: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-.9L3 20l1.1-4A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.5 5.7 21l1.5-7L2 9.3l7-.8z"/>'
  };
  CI.icon = (n, s = 18, cls = '') => `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${I[n] || I.file}</svg>`;

  CI.money = (m, dp = 1) => {
    // m in $M
    const a = Math.abs(m);
    if (a >= 1000) return '$' + (m / 1000).toFixed(2) + 'B';
    if (a >= 1) return '$' + m.toFixed(dp) + 'M';
    return '$' + Math.round(m * 1000) + 'K';
  };
  CI.delta = m => (m > 0 ? '+' : m < 0 ? '−' : '') + (m === 0 ? '$0' : CI.money(Math.abs(m)));
  CI.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  CI.sleep = ms => new Promise(r => setTimeout(r, ms));
  CI.sydTime = (opts = { hour: '2-digit', minute: '2-digit', hour12: false }) => new Intl.DateTimeFormat('en-AU', Object.assign({ timeZone: 'Australia/Sydney' }, opts)).format(new Date());
  CI.sydDate = () => new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  CI.sydHour = () => +new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: 'numeric', hour12: false }).format(new Date());
  CI.greeting = () => { const h = CI.sydHour(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
  CI.initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  /* text scramble */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$@/<>_=+*';
  CI.scramble = function (el, text, dur = 900) {
    text = text || el.dataset.text || el.textContent; el.dataset.text = text;
    const start = performance.now(); const len = text.length;
    cancelAnimationFrame(el._scr);
    const frame = t => {
      const p = Math.min(1, (t - start) / dur); let out = '';
      for (let i = 0; i < len; i++) {
        const ch = text[i]; const at = (i / len) * 0.75;
        if (ch === ' ') out += ' ';
        else if (p >= at + 0.25) out += ch;
        else if (p >= at) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else out += ' ';
      }
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(frame); else el.textContent = text;
    };
    el._scr = requestAnimationFrame(frame);
  };

  /* count up */
  CI.count = function (el) {
    const to = parseFloat(el.dataset.count); const dec = +(el.dataset.dec || 0);
    const pre = el.dataset.pre || ''; const suf = el.dataset.suf || ''; const dur = +(el.dataset.dur || 1600);
    const start = performance.now(); const delay = +(el.dataset.delay || 0);
    const fmt = v => pre + v.toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    el.textContent = fmt(0);
    setTimeout(() => {
      const s2 = performance.now();
      const frame = t => {
        const p = Math.min(1, (t - s2) / dur); const e = 1 - Math.pow(2, -10 * p);
        el.textContent = fmt(to * (p === 1 ? 1 : e));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
  };

  CI.enhance = function (root) {
    $$('[data-scramble]', root).forEach((el, i) => setTimeout(() => CI.scramble(el), i * 120));
    $$('[data-count]', root).forEach(CI.count);
    $$('.stagger', root).forEach(s => [...s.children].forEach((c, i) => c.style.setProperty('--i', i)));
  };

  /* spotlight on cards */
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card');
    if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
  }, { passive: true });

  /* cursor glow */
  const glow = $('#cursor-glow'); let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
  CI.mouse = { x: gx, y: gy };
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; CI.mouse.x = tx; CI.mouse.y = ty; }, { passive: true });
  (function loop() { gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();

  /* sound */
  let actx = null; CI.sfxOn = false;
  CI.sfx = function (type = 'tick') {
    if (!CI.sfxOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain(); const t = actx.currentTime;
      const cfg = { tick: [1800, 0.025, 0.035], open: [520, 0.05, 0.18], ok: [880, 0.05, 0.22], alert: [220, 0.06, 0.3], type: [2400, 0.012, 0.02] }[type] || [1000, .03, .05];
      o.type = type === 'alert' ? 'sawtooth' : 'sine'; o.frequency.setValueAtTime(cfg[0], t);
      if (type === 'open' || type === 'ok') o.frequency.exponentialRampToValueAtTime(cfg[0] * 2, t + cfg[2]);
      g.gain.setValueAtTime(cfg[1], t); g.gain.exponentialRampToValueAtTime(0.0001, t + cfg[2]);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + cfg[2] + 0.02);
    } catch (e) { }
  };

  /* drawer */
  const drawer = $('#drawer'); const panel = $('.panel', drawer);
  CI.drawer = {
    open(html, opts = {}) {
      panel.className = 'panel' + (opts.wide ? ' wide' : '');
      panel.innerHTML = `<div class="d-head"><div>${opts.kicker ? `<div class="label red" style="margin-bottom:8px">${opts.kicker}</div>` : ''}<h2 style="font-size:21px">${opts.title || ''}</h2>${opts.sub ? `<div class="mute" style="font-size:13px;margin-top:4px">${opts.sub}</div>` : ''}</div><button class="icon-btn" data-close>${CI.icon('x', 16)}</button></div><div class="d-body">${html}</div>`;
      [...$('.d-body', panel).children].forEach((c, i) => c.style.setProperty('--i', i));
      drawer.classList.add('open'); CI.sfx('open');
      CI.enhance(panel);
      opts.onOpen && opts.onOpen(panel);
    },
    close() { drawer.classList.remove('open'); }
  };
  drawer.addEventListener('click', e => { if (e.target.classList.contains('scrim') || e.target.closest('[data-close]')) CI.drawer.close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') CI.drawer.close(); });

  CI.openDoc = function (id) {
    const d = CI.docs[id]; if (!d) { CI.toast('Placeholder file — preview available once connected'); return; }
    const ic = d.kind === 'xls' ? 'sheet' : d.kind === 'mail' ? 'mail' : 'file';
    CI.drawer.open(`
      <div class="path">${d.path.split(' › ').map((s, i, a) => i < a.length - 1 ? s + ' <span>›</span> ' : `<b style="color:var(--text)">${s}</b>`).join('')}</div>
      <div class="doc-meta"><div><span class="label">Modified</span><b>${d.modified}</b></div><div><span class="label">Author</span><b>${d.author}</b></div><div><span class="label">Size</span><b>${d.size}</b></div></div>
      <div class="ai-box"><div class="label">${CI.icon('sparkle', 14)} AI SUMMARY · RESEARCH AGENT</div><div style="font-size:14.5px;line-height:1.6">${d.summary}</div></div>
      <div class="label" style="margin:22px 0 10px">Preview · highlighted passages</div>
      <div class="paper">${d.body}</div>
      <div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap"><button class="btn" onclick="CI.toast('Opening in Excel — placeholder')">${CI.icon('link', 15)} Open original</button><button class="btn" onclick="CI.drawer.close();CI.askAbout('${CI.esc(d.title)}')">${CI.icon('chat', 15)} Ask about this file</button></div>
    `, { title: `${CI.icon(ic, 18)} ${d.title}`.replace('<svg', '<svg style="display:inline;vertical-align:-3px;color:var(--red)"'), kicker: d.label, wide: true });
  };
  CI.askAbout = t => { CI.pendingQuery = `Summarise “${t}”`; location.hash = '#/ask'; };

  /* toast */
  CI.toast = function (msg, icon = 'sparkle') {
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = `<span style="color:var(--red)">${CI.icon(icon, 16)}</span><span>${msg}</span>`;
    $('#toast').appendChild(t); CI.sfx('ok');
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3000);
  };

  /* agent strip — shows which AI agents are working on this screen */
  CI.agentStrip = function (ids, el) {
    const lines = {
      brief: ['composing brief…', 'ranking 41 updates', 'checking 10 projects', 'brief ready'],
      ask: ['ready', 'listening…', '48,213 docs in memory'],
      watch: ['scanning FFCs…', 'comparing Oct vs Sep', '2,418 line items', 'matching variations'],
      minutes: ['reading minutes…', 'extracting actions', 'cross-checking #41', 'tracking 15 actions'],
      inbox: ['triaging inbox…', '12 new threads', 'linking emails to projects'],
      files: ['indexing Y: drive…', '+142 files today', 'OCR on drawings'],
      people: ['syncing HR files…', 'licences: 6 expiring', 'reviews: 5 due'],
      comms: ['online', 'listening on SMS', '3 conversations'],
      safety: ['watching incidents', '0 incidents today']
    };
    el.innerHTML = ids.map(id => { const a = CI.agent(id); return `<span class="agent" data-ag="${id}" style="--c:${a.color}"><span class="av" style="color:${a.color};background:${a.color}22">${CI.icon(a.icon, 12)}</span><span class="nm">${a.name}</span><span class="st mono">${lines[id][0]}</span></span>`; }).join('');
    let k = 0;
    const iv = setInterval(() => {
      if (!el.isConnected) return clearInterval(iv);
      k++;
      $$('.agent', el).forEach((a, i) => { const L = lines[a.dataset.ag]; if ((k + i) % 2) return; const st = $('.st', a); CI.scramble(st, L[(k + i) % L.length], 500); });
    }, 2600);
  };

  /* ---------------- ambient background ---------------- */
  (function bg() {
    const c = $('#bg'), ctx = c.getContext('2d'); let W, H, dpr, grid, pts = [], pulses = []; const G = 56;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid = document.createElement('canvas'); grid.width = W * dpr; grid.height = H * dpr;
      const g = grid.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.strokeStyle = 'rgba(255,255,255,0.028)'; g.lineWidth = 1; g.beginPath();
      for (let x = 0.5; x < W; x += G) { g.moveTo(x, 0); g.lineTo(x, H); }
      for (let y = 0.5; y < H; y += G) { g.moveTo(0, y); g.lineTo(W, y); }
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.08)';
      for (let x = 0.5; x < W; x += G) for (let y = 0.5; y < H; y += G) g.fillRect(x - .5, y - .5, 1.5, 1.5);
      const n = Math.min(90, Math.round(W * H / 22000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() * 1.3 + .3 }));
    }
    resize(); addEventListener('resize', resize);
    function loop() {
      requestAnimationFrame(loop);
      if (document.hidden) return;
      ctx.clearRect(0, 0, W, H); ctx.drawImage(grid, 0, 0, W, H);
      // pulses along grid lines
      if (Math.random() < 0.04 && pulses.length < 7) {
        const hz = Math.random() < .5; const col = Math.random() < .7 ? '255,46,77' : '56,232,255';
        pulses.push({ hz, line: (Math.floor(Math.random() * ((hz ? H : W) / G)) * G) + .5, p: -200, v: 3 + Math.random() * 5, col, len: 120 + Math.random() * 160 });
      }
      pulses = pulses.filter(p => p.p < (p.hz ? W : H) + p.len);
      pulses.forEach(p => {
        p.p += p.v;
        const gr = p.hz ? ctx.createLinearGradient(p.p - p.len, 0, p.p, 0) : ctx.createLinearGradient(0, p.p - p.len, 0, p.p);
        gr.addColorStop(0, `rgba(${p.col},0)`); gr.addColorStop(1, `rgba(${p.col},0.55)`);
        ctx.strokeStyle = gr; ctx.lineWidth = 1; ctx.beginPath();
        if (p.hz) { ctx.moveTo(p.p - p.len, p.line); ctx.lineTo(p.p, p.line); } else { ctx.moveTo(p.line, p.p - p.len); ctx.lineTo(p.line, p.p); }
        ctx.stroke();
        ctx.fillStyle = `rgba(${p.col},0.9)`; ctx.beginPath(); p.hz ? ctx.arc(p.p, p.line, 1.4, 0, 7) : ctx.arc(p.line, p.p, 1.4, 0, 7); ctx.fill();
      });
      // constellation
      const mx = CI.mouse.x, my = CI.mouse.y;
      for (const a of pts) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0) a.x = W; if (a.x > W) a.x = 0; if (a.y < 0) a.y = H; if (a.y > H) a.y = 0;
      }
      ctx.lineWidth = .6;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]; const dx = a.x - b.x, dy = a.y - b.y; const d = dx * dx + dy * dy;
          if (d < 15000) { ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 15000) * .06})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = (a.x - mx) ** 2 + (a.y - my) ** 2;
        if (dm < 32000) { ctx.strokeStyle = `rgba(255,46,77,${(1 - dm / 32000) * .35})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
        ctx.fillStyle = dm < 32000 ? 'rgba(255,99,120,.8)' : 'rgba(255,255,255,.25)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 7); ctx.fill();
      }
    }
    loop();
  })();

  /* ---------------- boot ---------------- */
  CI.boot = function (done) {
    const boot = $('#boot'), cv = $('#boot-canvas'), ctx = cv.getContext('2d');
    let W, H, dpr, t0 = performance.now(), alive = true, prog = 0;
    function rs() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    rs(); addEventListener('resize', rs);
    const parts = Array.from({ length: 220 }, () => ({ a: Math.random() * Math.PI * 2, r: 200 + Math.random() * Math.max(innerWidth, innerHeight) * .6, s: .4 + Math.random() * 1.8, z: Math.random() }));
    function draw(t) {
      if (!alive) return; requestAnimationFrame(draw);
      const e = (t - t0) / 1000; ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 - 60; const R = Math.min(W, H) * .28;
      // inflowing particles
      for (const p of parts) {
        p.r -= p.s * (1 + prog * 3); if (p.r < 40) { p.r = Math.max(W, H) * .7; p.a = Math.random() * Math.PI * 2; }
        const x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r * .9;
        const al = Math.min(1, (Math.max(W, H) * .7 - p.r) / 300) * .6;
        ctx.fillStyle = p.z > .7 ? `rgba(56,232,255,${al})` : `rgba(255,70,95,${al})`;
        ctx.fillRect(x, y, 1.4, 1.4);
      }
      ctx.save(); ctx.translate(cx, cy);
      const ring = (r, w, a0, a1, col, lw = 1, dash) => { ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.arc(0, 0, r, a0, a1); ctx.stroke(); ctx.setLineDash([]); };
      const grow = Math.min(1, e / 1.4);
      ring(R * 1.0, 1, 0, Math.PI * 2 * grow, 'rgba(255,255,255,.10)');
      ring(R * 1.1, 1, e * .3, e * .3 + Math.PI * 2 * grow, 'rgba(255,255,255,.18)', 1, [2, 7]);
      ring(R * .86, 2, -e * .8, -e * .8 + Math.PI * .5, 'rgba(255,46,77,.85)', 2);
      ring(R * .86, 2, -e * .8 + Math.PI, -e * .8 + Math.PI * 1.2, 'rgba(255,46,77,.5)', 2);
      ring(R * 1.22, 1, e * .5, e * .5 + Math.PI * .3, 'rgba(56,232,255,.6)', 1);
      ring(R * 1.22, 1, e * .5 + Math.PI, e * .5 + Math.PI * 1.1, 'rgba(56,232,255,.4)', 1);
      ring(R * .72, 1, 0, Math.PI * 2 * prog, 'rgba(255,46,77,.9)', 3);
      // ticks
      for (let i = 0; i < 120; i++) {
        const a = i / 120 * Math.PI * 2 + e * .05; const long = i % 10 === 0;
        if (i / 120 > grow) break;
        ctx.strokeStyle = long ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * 1.32, Math.sin(a) * R * 1.32); ctx.lineTo(Math.cos(a) * R * (long ? 1.38 : 1.35), Math.sin(a) * R * (long ? 1.38 : 1.35)); ctx.stroke();
      }
      // sweeping glow
      const sw = e * 1.4; const g = ctx.createConicGradient ? ctx.createConicGradient(sw, 0, 0) : null;
      if (g) { g.addColorStop(0, 'rgba(255,46,77,.18)'); g.addColorStop(.12, 'rgba(255,46,77,0)'); g.addColorStop(1, 'rgba(255,46,77,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * .98, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
    requestAnimationFrame(draw);

    const lines = [
      ['establishing secure tenant link', 'OK'],
      ['mounting MNB (Y:) · 2. Current Projects', '10 PROJECTS'],
      ['indexing project files', '48,213 DOCS'],
      ['syncing Outlook · 3 mailboxes', '12,906 EMAILS'],
      ['loading cost models · FFC Oct 2026', 'OK'],
      ['reading meeting minutes', '342 MEETINGS'],
      ['spawning agents', '9 ONLINE'],
      ['calibrating watchdog thresholds', 'OK']
    ];
    const log = $('#boot-log'), bar = $('#boot-bar'), pct = $('#boot-pct'), stage = $('#boot-stage');
    const clockEl = $('#boot-clock'); const ci = setInterval(() => clockEl.textContent = CI.sydTime({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), 250);
    setTimeout(() => CI.scramble($('#boot-title'), 'CORONATION', 1400), 300);
    (async () => {
      await CI.sleep(900);
      for (let i = 0; i < lines.length; i++) {
        const [a, b] = lines[i];
        const d = document.createElement('div'); const dots = '.'.repeat(Math.max(3, 46 - a.length - b.length));
        d.innerHTML = `<span class="hl">›</span> ${a} <span class="dim">${dots}</span> <span class="ok">${b}</span>`;
        log.appendChild(d); if (log.children.length > 7) log.firstChild.remove();
        prog = (i + 1) / lines.length; bar.style.transform = `scaleX(${prog})`; pct.textContent = Math.round(prog * 100) + '%';
        stage.textContent = a.split(' ')[0].toUpperCase();
        await CI.sleep(240 + Math.random() * 220);
      }
      stage.textContent = 'ALL SYSTEMS NOMINAL';
      const d = document.createElement('div'); d.innerHTML = `<span class="ok">■ CORONATION INTELLIGENCE ONLINE</span>`; log.appendChild(d); if (log.children.length > 7) log.firstChild.remove();
      const btn = $('#boot-enter'); btn.classList.add('show');
      const go = () => {
        CI.sfx('open'); boot.classList.add('out'); clearInterval(ci);
        setTimeout(() => { alive = false; boot.remove(); }, 1300);
        done();
      };
      btn.addEventListener('click', go, { once: true });
      addEventListener('keydown', function k(e) { if (e.key === 'Enter' && boot.isConnected && !boot.classList.contains('out')) { removeEventListener('keydown', k); go(); } });
    })();
  };
})();
