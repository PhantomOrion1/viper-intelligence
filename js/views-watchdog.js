/* ==========================================================
   03 · COST FORECAST WATCHDOG
   ========================================================== */
CI.views.watchdog = function (el) {
  const ids = Object.keys(CI.forecasts);
  let cur = 'archer';
  const st = s => ({ none: '<span class="status mute">— No change</span>', explained: `<span class="pill green">${CI.icon('check', 12)} Explained</span>`, partial: `<span class="pill amber">${CI.icon('alert', 12)} Partly explained</span>`, unexplained: `<span class="pill red">${CI.icon('alert', 12)} Needs clarification</span>` }[s]);
  const flags = id => CI.forecasts[id].filter(r => r.status === 'unexplained' || r.status === 'partial').length;

  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">03 · COST FORECAST WATCHDOG</div><h1 data-scramble>Cost forecast watchdog</h1>
    <p class="sub">Each time a new financial report is saved, the Watchdog compares it with the previous one and flags what changed, by how much, and whether there's an explanation on file. <b style="color:var(--text)">The figures come straight from your spreadsheets. AI only explains them.</b></p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="wd-top">
    <div class="card radar"><canvas id="radar" width="240" height="240"></canvas><div><div class="label">Last scan</div><div style="font-size:22px;font-weight:600;margin:4px 0" data-count="2418">0</div><div class="mono dim" style="font-size:10.5px;line-height:1.6">LINE ITEMS CHECKED<br>9 PROJECTS · 06:00 TODAY</div></div></div>
    <div class="card alert-card" id="alert"></div>
  </div>
  <div class="ptabs" id="ptabs">${ids.map(id => `<button data-p="${id}" class="${id === cur ? 'on' : ''}">${CI.proj(id).name}${flags(id) ? `<span class="cnt">● ${flags(id)}</span>` : ''}</button>`).join('')}</div>
  <div class="card" style="margin-bottom:18px">
    <div class="card-h"><div><span class="label">Forecast changes · Oct vs Sep</span><h2 id="tt" style="margin-top:6px"></h2></div><span class="chip">${CI.icon('sheet', 12)} FFC - October.xlsx</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Category</th><th class="num">Previous</th><th class="num">Current</th><th class="num">Change</th><th>Movement</th><th>Explanation</th></tr></thead><tbody id="tb"></tbody></table></div>
  </div>
  <div class="card">
    <div class="card-h"><div><span class="label">Portfolio heatmap · % movement by trade</span><div class="mute" style="font-size:13px;margin-top:4px">Every project, every trade, every month. Click a cell to drill in. <span style="display:inline-block;width:10px;height:10px;border:1.5px solid #fff;border-radius:3px;vertical-align:-1px;margin:0 4px 0 6px"></span>no explanation on file</div></div><button class="btn ghost-red sm" id="scan">${CI.icon('radar', 14)} Run scan</button></div>
    <div class="tbl-wrap"><div class="heat" id="heat" style="grid-template-columns:150px repeat(${CI.categories.length},1fr)"></div></div>
  </div>`;
  CI.agentStrip(['watch', 'files'], CI.$('#as', el));

  function render() {
    const rows = CI.forecasts[cur]; const p = CI.proj(cur);
    const up = rows.filter(r => r.curr > r.prev), tot = up.reduce((a, r) => a + r.curr - r.prev, 0);
    const exp = up.filter(r => r.status === 'explained' || r.status === 'partial').length, unx = up.filter(r => r.status === 'unexplained').length;
    CI.$('#tt', el).textContent = p.name + ' · ' + p.suburb;
    CI.$('#alert', el).innerHTML = up.length ? `<div class="ico">${CI.icon('alert', 26)}</div><div><div class="label red" style="margin-bottom:6px">Watchdog summary · ${p.name}</div><div class="big">${up.length} ${up.length === 1 ? 'category' : 'categories'} up, ${CI.delta(tot)} in total. ${exp} ${exp === 1 ? 'is' : 'are'} explained in the cost report.${unx ? ` ${unx} need${unx === 1 ? 's' : ''} clarification.` : ''}</div></div>`
      : `<div class="ico" style="color:var(--green);border-color:rgba(61,255,168,.4);background:var(--greenA)">${CI.icon('check', 26)}</div><div><div class="label" style="color:var(--green);margin-bottom:6px">Watchdog summary · ${p.name}</div><div class="big">No forecast increases this month. Nothing needs your attention.</div></div>`;
    const maxD = Math.max(...rows.map(r => Math.abs(r.curr - r.prev)), .01);
    CI.$('#tb', el).innerHTML = rows.map((r, i) => {
      const d = +(r.curr - r.prev).toFixed(2); const w = Math.abs(d) / maxD * 50;
      return `<tr class="row" data-i="${i}" style="--i:${i}"><td><b style="font-weight:500">${r.cat}</b></td><td class="num mute">${CI.money(r.prev, 2)}</td><td class="num">${CI.money(r.curr, 2)}</td><td class="num ${d > 0 ? 'chg-up' : d < 0 ? 'chg-dn' : 'chg-0'}">${CI.delta(d)}</td><td><div class="div-bar"><i class="${d >= 0 ? 'up' : 'dn'}" data-w="${w}"></i></div></td><td>${st(r.status)}</td></tr>`;
    }).join('');
    setTimeout(() => CI.$$('#tb .div-bar i', el).forEach(i => i.style.width = i.dataset.w + '%'), 200);
    CI.$$('#ptabs button', el).forEach(b => b.classList.toggle('on', b.dataset.p === cur));
  }
  function heat() {
    const h = CI.$('#heat', el); let html = '<div></div>' + CI.categories.map(c => `<div class="hh">${c.replace('Structural steel', 'Steel').replace('Preliminaries', 'Prelims')}</div>`).join('');
    ids.forEach((id, ri) => {
      html += `<div class="hn" data-p="${id}">${CI.proj(id).name}</div>`;
      CI.forecasts[id].forEach((r, ci) => {
        const pc = (r.curr - r.prev) / r.prev * 100; const a = Math.min(1, Math.abs(pc) / 5);
        const bg = pc > 0 ? `rgba(255,46,77,${.12 + a * .7})` : pc < 0 ? `rgba(61,255,168,${.1 + a * .45})` : 'rgba(255,255,255,.03)';
        const ring = r.status === 'unexplained' ? 'box-shadow:inset 0 0 0 1.5px #fff;' : '';
        html += `<div class="hc" data-p="${id}" data-i="${ci}" style="--d:${ri + ci};background:${bg};${ring}color:${Math.abs(pc) > 2 ? '#fff' : 'var(--mute)'}" data-tip="${CI.proj(id).name} · ${r.cat}: ${CI.delta(+(r.curr - r.prev).toFixed(2))}">${pc === 0 ? '·' : (pc > 0 ? '+' : '') + pc.toFixed(1) + '%'}</div>`;
      });
    });
    h.innerHTML = html + '<div class="scanline" id="sl"></div>';
  }
  render(); heat();
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-p]');
    if (t && (t.matches('#ptabs button') || t.matches('.hn') || t.matches('.hc'))) {
      cur = t.dataset.p; render(); CI.sfx('tick');
      if (!t.matches('#ptabs button')) CI.$('#ptabs', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (t.matches('.hc')) setTimeout(() => detail(+t.dataset.i), 500);
      return;
    }
    const row = e.target.closest('tr.row'); if (row) detail(+row.dataset.i);
  });
  function detail(i) {
    const r = CI.forecasts[cur][i]; const p = CI.proj(cur); const d = +(r.curr - r.prev).toFixed(2);
    let lines = '';
    if (cur === 'archer' && r.cat === 'Preliminaries') {
      lines = `<table class="mini-tbl"><tr><th>Code</th><th>Item</th><th class="r">Δ $K</th></tr>${CI.prelimLines.filter(l => l[2]).map(l => `<tr><td class="mono">${l[0]}</td><td>${l[1]}</td><td class="r chg-up">+${l[2]}</td></tr>`).join('')}<tr><td></td><td><b>Total</b></td><td class="r chg-up"><b>+300</b></td></tr></table><div class="mono dim" style="font-size:10.5px;margin-top:8px">${CI.prelimLines.length - 5} other cost codes unchanged (01-010 to 01-400)</div>`;
    } else if (cur === 'archer' && r.cat === 'Electrical') {
      lines = `<table class="mini-tbl"><tr><th>Ref</th><th>Item</th><th class="r">Δ $K</th><th></th></tr><tr><td class="mono">VAR-112</td><td>Additional sub-mains L10–L24</td><td class="r chg-up">+210</td><td><span class="pill green">Matched</span></td></tr><tr><td class="mono">VAR-115</td><td>Lobby lighting upgrade</td><td class="r chg-up">+60</td><td><span class="pill green">Matched</span></td></tr><tr><td class="mono">—</td><td>Unallocated</td><td class="r chg-up">+30</td><td><span class="pill red">No match</span></td></tr></table>`;
    }
    const reason = r.note || (r.status === 'none' ? 'No movement between September and October.' : r.status === 'explained' ? 'Movement matches an approved variation in the register.' : 'No variation, site instruction or cost report note matches this movement.');
    CI.drawer.open(`
      <div class="kv"><div><span>Previous</span><b>${CI.money(r.prev, 2)}</b></div><div><span>Current</span><b>${CI.money(r.curr, 2)}</b></div><div><span>Change</span><b class="${d > 0 ? 'chg-up' : d < 0 ? 'chg-dn' : ''}">${CI.delta(d)}</b></div><div><span>Status</span><b>${st(r.status)}</b></div></div>
      <div class="ai-box"><div class="label">${CI.icon('sparkle', 14)} WATCHDOG AGENT · EXPLANATION</div><div style="font-size:14.5px;line-height:1.6">${reason}</div></div>
      ${lines ? `<div class="label" style="margin:20px 0 10px">Line items</div>${lines}` : ''}
      <div class="label" style="margin:22px 0 10px">Evidence checked</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="src-chip" data-doc="ffc">${CI.icon('sheet', 14)}Cost Report</span><span class="src-chip" data-doc="varreg">${CI.icon('sheet', 14)}Variation Register</span><span class="src-chip" data-doc="m42">${CI.icon('file', 14)}Meeting Minutes</span>${cur === 'archer' && r.cat === 'Preliminaries' ? `<span class="src-chip" data-doc="prog">${CI.icon('file', 14)}Programme Rev 13</span>` : ''}</div>
      ${r.status === 'unexplained' || r.status === 'partial' ? `<div style="display:flex;gap:8px;margin-top:22px"><button class="btn primary" onclick="CI.toast('Clarification request sent to Commercial — demo','mail')">${CI.icon('mail', 15)} Request clarification</button><button class="btn" onclick="CI.toast('Added to Tuesday PCG agenda','calendar')">${CI.icon('calendar', 15)} Add to PCG</button></div>` : ''}
    `, { title: r.cat, kicker: p.name + ' · forecast detail', sub: 'Compared Oct 2026 FFC against Sep 2026 FFC' });
    CI.$$('#drawer [data-doc]').forEach(c => c.onclick = () => CI.openDoc(c.dataset.doc));
  }
  CI.$('#scan', el).onclick = async () => {
    const sl = CI.$('#sl', el); sl.classList.remove('go'); void sl.offsetWidth; sl.classList.add('go'); CI.sfx('open');
    CI.$$('.hc', el).forEach(c => { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; });
    await CI.sleep(1700); CI.toast('Scan complete · 2,418 line items · 4 flags across 2 projects', 'radar');
  };

  // radar
  const cv = CI.$('#radar', el), ctx = cv.getContext('2d'); let alive = true;
  const blips = Array.from({ length: 14 }, (_, i) => ({ a: Math.random() * Math.PI * 2, r: .25 + Math.random() * .7, red: i < 4, life: 0 }));
  (function loop(t) {
    if (!alive) return; requestAnimationFrame(loop);
    const W = 240, c = W / 2; ctx.clearRect(0, 0, W, W);
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 1;
    [.33, .66, .98].forEach(k => { ctx.beginPath(); ctx.arc(c, c, c * k, 0, 7); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(0, c); ctx.lineTo(W, c); ctx.moveTo(c, 0); ctx.lineTo(c, W); ctx.stroke();
    const sw = (t || 0) / 900;
    if (ctx.createConicGradient) { const g = ctx.createConicGradient(sw - 1.2, c, c); g.addColorStop(0, 'rgba(255,46,77,0)'); g.addColorStop(.19, 'rgba(255,46,77,.45)'); g.addColorStop(.191, 'rgba(255,46,77,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, c * .98, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,90,110,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + Math.cos(sw) * c * .98, c + Math.sin(sw) * c * .98); ctx.stroke();
    blips.forEach(b => {
      const diff = ((sw - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); if (diff < .08) b.life = 1; b.life *= .985;
      ctx.fillStyle = b.red ? `rgba(255,46,77,${b.life})` : `rgba(56,232,255,${b.life * .8})`;
      ctx.beginPath(); ctx.arc(c + Math.cos(b.a) * b.r * c, c + Math.sin(b.a) * b.r * c, b.red ? 4 : 2.5, 0, 7); ctx.fill();
      if (b.red && b.life > .2) { ctx.strokeStyle = `rgba(255,46,77,${b.life * .6})`; ctx.beginPath(); ctx.arc(c + Math.cos(b.a) * b.r * c, c + Math.sin(b.a) * b.r * c, 4 + (1 - b.life) * 14, 0, 7); ctx.stroke(); }
    });
  })();
  return { destroy() { alive = false; } };
};
