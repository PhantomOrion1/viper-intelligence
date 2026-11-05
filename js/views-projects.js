/* ==========================================================
   05 · PROJECTS — 3D carousel + project detail w/ file system
   ========================================================== */
CI.views.projects = function (el, arg) {
  if (arg && CI.proj(arg)) return detail(el, CI.proj(arg));
  let active = CI.projects.findIndex(p => p.id === (CI.lastProject || 'archer')); if (active < 0) active = 0;
  const hp = p => p.health === 'risk' ? '<span class="pill red">At risk</span>' : p.health === 'watch' ? '<span class="pill amber">Watch</span>' : '<span class="pill green">On track</span>';
  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">05 · CONSTRUCTION</div><h1 data-scramble>Projects</h1>
    <p class="sub">Every live project in one place. Swipe through, then open one to see its progress, cost position and an AI-indexed version of its project drive.</p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="carousel" id="car"><div class="carousel-track">${CI.projects.map((p, i) => `
    <div class="card pcard" data-i="${i}">
      <div class="pc-top"><span class="tag">${String(i + 1).padStart(2, '0')} / ${CI.projects.length}</span>${hp(p)}</div>
      <canvas></canvas>
      <div class="pc-b">
        <div><div class="pc-n">${p.name}</div><div class="pc-s">${p.suburb} · ${p.type}</div></div>
        <div class="pc-st"><span>${p.stage}</span><span class="mono">${p.progress}%</span></div>
        <div class="prog"><i style="width:${p.progress}%"></i></div>
        <div class="pc-st"><span>${p.value ? CI.money(p.value, 0) + ' construction' : 'Pre-construction'}</span><span>PC ${p.pc}</span></div>
      </div>
    </div>`).join('')}</div></div>
  <div class="car-nav">
    <button class="icon-btn" id="prev">${CI.icon('chevL', 18)}</button>
    <div class="car-dots" id="dots">${CI.projects.map((_, i) => `<button data-i="${i}"></button>`).join('')}</div>
    <button class="icon-btn" id="next">${CI.icon('chevR', 18)}</button>
  </div>
  <div class="car-info stagger" id="info"></div>`;
  CI.agentStrip(['files', 'watch'], CI.$('#as', el));
  const cards = CI.$$('.pcard', el); const builds = cards.map((c, i) => CI.Building(CI.$('canvas', c), CI.projects[i]));
  function layout() {
    const mob = innerWidth < 860;
    cards.forEach((c, i) => {
      const o = i - active, a = Math.abs(o);
      c.style.transform = `translateX(${o * (mob ? 70 : 58)}%) translateZ(${-a * 200}px) rotateY(${-o * 32}deg) scale(${a ? .92 : 1})`;
      c.style.opacity = a > 3 ? 0 : 1 - a * .26; c.style.zIndex = 50 - a; c.style.filter = a ? `brightness(${1 - a * .18})` : 'none';
      c.style.pointerEvents = a > 3 ? 'none' : 'auto';
      c.classList.toggle('active', !o);
    });
    CI.$$('#dots button', el).forEach((d, i) => d.classList.toggle('on', i === active));
    const p = CI.projects[active]; CI.lastProject = p.id;
    const info = CI.$('#info', el);
    info.innerHTML = `
      <div class="card"><span class="label">Construction value</span><div style="font-size:24px;font-weight:600;margin-top:6px">${p.value ? CI.money(p.value, 0) : 'TBC'}</div></div>
      <div class="card"><span class="label">Progress</span><div style="font-size:24px;font-weight:600;margin-top:6px">${p.progress}%<span class="mute" style="font-size:13px;font-weight:400"> · L${p.built}/${p.levels}</span></div></div>
      <div class="card"><span class="label">Open RFIs · variations</span><div style="font-size:24px;font-weight:600;margin-top:6px">${p.rfis} · ${p.vars}</div></div>
      <div class="card"><span class="label">Project manager</span><div style="font-size:17px;font-weight:600;margin-top:9px">${p.pm}</div></div>
      <a class="card" href="#/projects/${p.id}" style="display:flex;align-items:center;justify-content:space-between;border-color:rgba(255,46,77,.5);background:linear-gradient(135deg,rgba(255,46,77,.18),rgba(255,46,77,.03))"><span><span class="label red">Open project</span><div style="font-size:17px;font-weight:600;margin-top:9px">${p.name}</div></span>${CI.icon('arrowR', 22, 'red')}</a>`;
    [...info.children].forEach((c, i) => c.style.setProperty('--i', i));
  }
  const go = i => { active = Math.max(0, Math.min(CI.projects.length - 1, i)); layout(); CI.sfx('tick'); };
  layout();
  CI.$('#prev', el).onclick = () => go(active - 1); CI.$('#next', el).onclick = () => go(active + 1);
  CI.$('#dots', el).onclick = e => { const b = e.target.closest('[data-i]'); b && go(+b.dataset.i); };
  let dx = 0, sx = null, moved = false;
  const car = CI.$('#car', el);
  car.addEventListener('pointerdown', e => { sx = e.clientX; dx = 0; moved = false; });
  addEventListener('pointermove', pm); addEventListener('pointerup', pu);
  function pm(e) { if (sx === null) return; dx = e.clientX - sx; if (Math.abs(dx) > 8) moved = true; }
  function pu() { if (sx === null) return; if (dx < -50) go(active + 1); else if (dx > 50) go(active - 1); sx = null; }
  car.addEventListener('click', e => { if (moved) return; const c = e.target.closest('.pcard'); if (!c) return; const i = +c.dataset.i; if (i === active) location.hash = '#/projects/' + CI.projects[i].id; else go(i); });
  let wl = 0; car.addEventListener('wheel', e => { if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; e.preventDefault(); const now = Date.now(); if (now - wl < 450) return; wl = now; go(active + (e.deltaX > 0 ? 1 : -1)); }, { passive: false });
  const key = e => { if (e.target.tagName === 'INPUT') return; if (e.key === 'ArrowRight') go(active + 1); if (e.key === 'ArrowLeft') go(active - 1); if (e.key === 'Enter') location.hash = '#/projects/' + CI.projects[active].id; };
  addEventListener('keydown', key);
  let alive = true, last = performance.now();
  (function loop(t) { if (!alive) return; requestAnimationFrame(loop); const dt = Math.min(50, t - last) / 16.67 || 1; last = t; builds.forEach((b, i) => { if (Math.abs(i - active) <= 2) b.draw(dt, t, Math.abs(i - active) * .25); }); })(last);
  const onR = () => { builds.forEach(b => b.resize()); layout(); }; addEventListener('resize', onR);
  return { destroy() { alive = false; removeEventListener('keydown', key); removeEventListener('pointermove', pm); removeEventListener('pointerup', pu); removeEventListener('resize', onR); } };
};

function detail(el, p) {
  const ms = [['Site establishment', 5], ['Excavation & basement', 15], ['Structure', 60], ['Façade', 78], ['Fitout & services', 92], ['Practical completion', 100]];
  const fc = CI.forecasts[p.id]; const prev = fc ? fc.reduce((a, r) => a + r.prev, 0) : 0, curr = fc ? fc.reduce((a, r) => a + r.curr, 0) : 0;
  const tree = CI.fileTree(p); let count = 0; (function c(n) { n.forEach(x => { if (x.file) count++; else c(x.kids); }); })(tree);
  el.innerHTML = `
  <a class="back" href="#/projects">${CI.icon('arrowL', 14)} ALL PROJECTS</a>
  <div class="pd-head">
    <div><div class="kicker">${p.suburb.toUpperCase()} · ${p.type.toUpperCase()}</div><h1 data-scramble>${p.name}</h1></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="kpis stagger">
    <div class="card kpi"><span class="label">Construction value</span><div class="v">${p.value ? CI.money(p.value, 0) : 'TBC'}</div><div class="d mute">contract sum · placeholder</div></div>
    <div class="card kpi"><span class="label">Forecast movement</span><div class="v ${curr > prev ? 'red' : ''}">${fc ? CI.delta(+(curr - prev).toFixed(2)) : '—'}</div><div class="d mute">Oct vs Sep FFC</div></div>
    <div class="card kpi"><span class="label">Progress</span><div class="v" data-count="${p.progress}" data-suf="%">0</div><div class="d mute">${p.stage}</div></div>
    <div class="card kpi"><span class="label">Open RFIs · variations</span><div class="v">${p.rfis} · ${p.vars}</div><div class="d amber">${p.actions} open actions</div></div>
    <div class="card kpi"><span class="label">Practical completion</span><div class="v">${p.pc}</div><div class="d ${p.health === 'risk' ? 'red' : 'green'}">${p.health === 'risk' ? '3 weeks behind' : p.health === 'watch' ? 'on programme · watch' : 'on programme'}</div></div>
  </div>
  <div class="pd-grid">
    <div class="card pd-build">
      <div class="ov"><span class="label">Digital twin · massing</span><span class="legend"><span><i style="background:var(--red)"></i>BUILT</span><span><i style="background:var(--cyan)"></i>TO BUILD</span><span><i style="background:#fff"></i>SCAN</span></span></div>
      <canvas id="bc"></canvas>
      <div class="milestones">${ms.map(([n, at], i) => { const st = p.progress >= at ? 'done' : (i === 0 || p.progress >= ms[i - 1][1]) ? 'now' : ''; return `<div class="ms ${st}"><b>${n}</b>${st === 'done' ? 'Complete' : st === 'now' ? 'In progress' : 'Upcoming'}</div>`; }).join('')}</div>
    </div>
    <div class="card files">
      <div class="files-h">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">Project drive</span><span class="chip"><span class="dot pulse"></span>${(1284 + p.levels * 17).toLocaleString()} FILES · INDEXED 2M AGO</span></div>
        <div class="path" style="margin-top:10px">Y: <span>›</span> Projects <span>›</span> 2. Current Projects <span>›</span> <b style="color:var(--text)">${p.name.toUpperCase()}</b></div>
        <div class="files-search">${CI.icon('search', 15)}<input id="fs" placeholder="Search files, or ask “where’s the latest FFC?”"><span class="kbd">AI</span></div>
      </div>
      <div class="tree" id="tree"></div>
    </div>
  </div>`;
  CI.agentStrip(['files', 'watch', 'minutes'], CI.$('#as', el));
  const treeEl = CI.$('#tree', el);
  let k = 0;
  const ext = n => /\.xlsx$/.test(n) ? 'xls' : /\.pdf$/.test(n) ? 'pdf' : 'doc';
  function render(nodes, depth = 0) {
    return `<ul>${nodes.map(n => n.file
      ? `<li><div class="ti" data-doc="${n.doc || ''}" style="--i:${k++}"><span></span><span class="fi ${ext(n.n)}">${CI.icon(ext(n.n) === 'xls' ? 'sheet' : 'file', 16)}</span><span>${n.n}${n.doc ? '<span class="ai-t">AI SUMMARY</span>' : ''}</span><span class="meta">${n.meta || ''}</span></div></li>`
      : `<li class="${n.open ? 'open' : ''}"><div class="ti" style="--i:${k++}"><span class="cv">${CI.icon('chevR', 13)}</span><span class="fo">${CI.icon('folder', 16)}</span><span>${n.n}</span><span class="meta">${n.kids.length ? n.kids.length + ' items' : ''}</span></div><div class="kids">${n.kids.length ? render(n.kids, depth + 1) : '<ul><li class="empty">Empty — placeholder</li></ul>'}</div></li>`).join('')}</ul>`;
  }
  // pre-open path to the FFC so the structure is visible
  const open = (nodes, names) => { const n = nodes.find(x => x.n === names[0]); if (n) { n.open = true; if (names.length > 1) open(n.kids, names.slice(1)); } };
  open(tree, ['06. Project Management', '01. Contract Admin', '10. FFC', '1. October 2026']);
  treeEl.innerHTML = render(tree);
  treeEl.onclick = e => {
    const ti = e.target.closest('.ti'); if (!ti) return;
    const li = ti.parentElement;
    if (ti.dataset.doc !== undefined) { ti.dataset.doc ? CI.openDoc(ti.dataset.doc) : CI.toast('Placeholder file — connect the drive to preview', 'file'); return; }
    li.classList.toggle('open'); CI.sfx('tick');
  };
  CI.$('#fs', el).addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase(); if (!q) { k = 0; treeEl.innerHTML = render(tree); return; }
    const hits = []; (function walk(n, path) { n.forEach(x => { const pth = path.concat(x.n); if (x.n.toLowerCase().includes(q) || (/ffc|forecast|cost/.test(q) && /FFC/.test(x.n))) hits.push({ x, pth }); if (!x.file) walk(x.kids, pth); }); })(tree, []);
    treeEl.innerHTML = hits.length ? `<div class="mono dim" style="font-size:10.5px;padding:6px 10px">${hits.length} RESULTS · RANKED BY FILE INDEXER</div><ul>${hits.slice(0, 30).map((h, i) => `<li><div class="ti" ${h.x.file ? `data-doc="${h.x.doc || ''}"` : ''} style="--i:${i}"><span></span><span class="${h.x.file ? 'fi ' + ext(h.x.n) : 'fo'}">${CI.icon(h.x.file ? 'file' : 'folder', 16)}</span><span>${h.x.n.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<span class="hit">$1</span>')}<div class="mono dim" style="font-size:9.5px;margin-top:2px">${h.pth.slice(0, -1).join(' › ')}</div></span><span class="meta">${h.x.meta || ''}</span></div></li>`).join('')}</ul>`
      : `<div class="empty" style="padding:20px">No file names match. <a class="red" href="#/ask" onclick="CI.pendingQuery=${JSON.stringify(e.target.value).replace(/"/g, '&quot;')}">Ask the Research Agent instead ›</a></div>`;
  });
  const b = CI.Building(CI.$('#bc', el), p, { big: true, speed: .003 });
  let alive = true, last = performance.now();
  (function loop(t) { if (!alive) return; requestAnimationFrame(loop); const dt = Math.min(50, t - last) / 16.67 || 1; last = t; b.draw(dt, t); })(last);
  const onR = () => b.resize(); addEventListener('resize', onR);
  return { destroy() { alive = false; removeEventListener('resize', onR); } };
}
