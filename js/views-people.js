/* ==========================================================
   06 · PEOPLE — org chart + staff profiles (pay, bonuses, reviews)
   ========================================================== */
CI.views.people = function (el) {
  let unlocked = CI.hrUnlocked || false;
  const col = d => (CI.depts.find(x => x.id === d) || { color: '#ff2e4d' }).color;
  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">06 · PEOPLE & CULTURE</div><h1 data-scramble>Organisation</h1>
    <p class="sub">A live org chart synced to every staff profile: role, projects, licences, annual reviews, salary increases and bonuses. Pay data stays locked to directors.</p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="kpis stagger">
    <div class="card kpi"><span class="label">Headcount</span><div class="v" data-count="186">0</div><div class="d green">+9 this quarter</div></div>
    <div class="card kpi"><span class="label">Reviews due · Nov</span><div class="v amber" data-count="5">0</div><div class="d mute">cycle closes 30 Nov</div></div>
    <div class="card kpi"><span class="label">Licences expiring</span><div class="v red" data-count="6">0</div><div class="d mute">next 30 days</div></div>
    <div class="card kpi"><span class="label">Avg salary increase</span><div class="v" data-count="4.1" data-dec="1" data-suf="%">0</div><div class="d mute">FY26 · restricted detail</div></div>
    <div class="card kpi"><span class="label">Avg tenure</span><div class="v" data-count="4.6" data-dec="1" data-suf=" yrs">0</div><div class="d mute">company-wide</div></div>
  </div>
  <div class="card">
    <div class="card-h"><span class="label">Org chart · click anyone to open their profile</span><span class="legend" style="flex-wrap:wrap;gap:12px">${CI.depts.map(d => `<span><i style="background:${d.color};height:8px;width:8px;border-radius:50%"></i>${d.name.toUpperCase()}</span>`).join('')}<span><i style="background:var(--amber);height:8px;width:8px;border-radius:50%"></i>REVIEW DUE</span></span></div>
    <div class="org-scroll"><div class="org" id="org">
      <svg class="org-svg" id="osvg"></svg>
      <div class="org-ceo">${node(CI.person('ceo'), 'ceo', 0)}</div>
      <div class="org-cols">${CI.depts.map((d, di) => {
        const ppl = CI.people.filter(p => p.dept === d.id); const lead = ppl.find(p => p.lead);
        return `<div class="org-col" data-d="${d.id}">${node(lead, 'lead', .3 + di * .08)}<div style="height:16px"></div>${ppl.filter(p => !p.lead).map((p, i) => node(p, '', .7 + di * .08 + i * .07)).join('')}</div>`;
      }).join('')}</div>
    </div></div>
  </div>`;
  function node(p, cls, d) {
    return `<div class="onode ${cls}" data-id="${p.id}" style="--c:${p.id === 'ceo' ? 'var(--red)' : col(p.dept)};--d:${d}s">${p.review ? '<span class="flag"></span>' : ''}<span class="ring">${p.id === 'ceo' ? 'CEO' : CI.initials(p.name)}</span><span class="nm">${p.name}</span><span class="rl">${p.role}</span></div>`;
  }
  CI.agentStrip(['people', 'safety'], CI.$('#as', el));

  const org = CI.$('#org', el), svg = CI.$('#osvg', el);
  function wires() {
    const R = org.getBoundingClientRect(); const pt = (n, side) => { const r = CI.$('.ring', n).getBoundingClientRect(); return [r.left - R.left + r.width / 2, side === 'b' ? r.bottom - R.top : side === 't' ? r.top - R.top : r.top - R.top + r.height / 2, r]; };
    const ceo = CI.$('.onode.ceo', org); const [cx] = pt(ceo, 'b'); const cy = ceo.getBoundingClientRect().bottom - R.top + 4; let html = '', di = 0;
    CI.$$('.org-col', org).forEach(colEl => {
      const nodes = CI.$$('.onode', colEl); const lead = nodes[0]; const [lx, ly] = pt(lead, 't'); const c = col(colEl.dataset.d);
      const midY = cy + (ly - cy) / 2;
      const d1 = `M${cx},${cy} C${cx},${midY} ${lx},${midY} ${lx},${ly}`;
      html += `<path id="w${di}" d="${d1}" style="--len:600;--d:${.2 + di * .08}s;stroke:${c};opacity:.55"/>`;
      html += `<circle r="2.6" style="fill:${c}"><animateMotion dur="${2.4 + di * .3}s" repeatCount="indefinite" begin="${1.5 + di * .2}s"><mpath href="#w${di}"/></animateMotion></circle>`;
      const [bx] = pt(lead, 'b'); const by = lead.getBoundingClientRect().bottom - R.top + 4;
      nodes.slice(1).forEach((n, i) => {
        const [nx, , r] = pt(n, 'm'); const ny = r.top - R.top + r.height / 2; const sx = colEl.getBoundingClientRect().left - R.left + 10;
        const d2 = `M${bx},${by} L${bx},${by + 10} Q${bx},${by + 18} ${bx - 8},${by + 18} L${sx + 8},${by + 18} Q${sx},${by + 18} ${sx},${by + 26} L${sx},${ny - 8} Q${sx},${ny} ${sx + 8},${ny} L${r.left - R.left - 4},${ny}`;
        const id = `w${di}_${i}`;
        html += `<path id="${id}" d="${d2}" style="--len:900;--d:${.6 + di * .08 + i * .07}s;stroke:${c};opacity:.32"/>`;
        if (i === nodes.length - 2) html += `<circle r="2" style="fill:${c}"><animateMotion dur="3.2s" repeatCount="indefinite" begin="${2 + di * .3}s"><mpath href="#${id}"/></animateMotion></circle>`;
      });
      di++;
    });
    svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`); svg.innerHTML = html;
  }
  // child nodes sit offset to the right of the spine
  CI.$$('.org-col', org).forEach(c => CI.$$('.onode:not(.lead)', c).forEach(n => { n.style.flexDirection = 'row'; n.style.alignSelf = 'stretch'; n.style.textAlign = 'left'; n.style.paddingLeft = '30px'; n.style.gap = '10px'; n.innerHTML = n.innerHTML.replace(/<span class="nm">/, '<span><span class="nm" style="display:block">').replace(/(<span class="rl">[^<]*<\/span>)/, '$1</span>'); }));
  CI.$$('.org-col .onode:not(.lead) .flag', org).forEach(f => { f.style.right = 'auto'; f.style.left = '72px'; });
  requestAnimationFrame(() => requestAnimationFrame(wires));
  const ro = new ResizeObserver(() => wires()); ro.observe(org);
  org.addEventListener('click', e => { const n = e.target.closest('.onode'); if (n && n.dataset.id !== 'ceo') profile(CI.person(n.dataset.id)); else if (n) CI.toast('That’s you. Your own profile is hidden in the demo', 'users'); });
  org.addEventListener('mouseover', e => { const n = e.target.closest('.onode'); CI.$$('path', svg).forEach(p => p.classList.remove('hot')); if (!n) return; const colEl = n.closest('.org-col'); if (!colEl) return; const di = CI.$$('.org-col', org).indexOf(colEl); const idx = CI.$$('.onode', colEl).indexOf(n); const w = CI.$('#w' + di, svg); w && w.classList.add('hot'); if (idx > 0) { const p = CI.$(`#w${di}_${idx - 1}`, svg); p && p.classList.add('hot'); } });

  function profile(p) {
    const comp = CI.comp(p), revs = CI.reviews(p); const c = col(p.dept); const dept = CI.depts.find(d => d.id === p.dept);
    const tenure = 2026 - p.start; const lic = [['White Card (CGI)', p.dept === 'whs' || p.dept === 'con' ? 'Expires 27 Nov 2026' : 'No expiry', p.id === 'kw'], ['First Aid HLTAID011', 'Expires Mar 2027', false], ['Employment contract', 'Signed ' + p.start, false], ['Working at Heights', 'Expires Jan 2028', false]];
    CI.drawer.open(`
      <div class="prof-head" style="--c:${c}"><div class="prof-av">${CI.initials(p.name)}</div><div><div style="font-size:22px;font-weight:700">${p.name}</div><div class="mute">${p.role}</div><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap"><span class="pill" style="background:${c}22;color:${c}">${dept.name}</span>${p.review ? '<span class="pill amber">Review due Nov</span>' : ''}</div></div></div>
      <div class="dtabs" id="dt"><button data-t="o" class="on">Overview</button><button data-t="c">${CI.icon('lock', 12)} Pay & bonuses</button><button data-t="r">Reviews</button><button data-t="d">Documents</button></div>
      <div id="dp"></div>`, { title: '', kicker: 'Staff profile · People Agent', wide: true, onOpen: panel => {
        const dp = CI.$('#dp', panel);
        const tabs = {
          o: () => `<div class="kv"><div><span>Reports to</span><b>${p.lead ? 'CEO' : CI.people.find(x => x.dept === p.dept && x.lead).name}</b></div><div><span>Started</span><b>${p.start} · ${tenure} yrs</b></div><div><span>Based at</span><b>${p.loc}</b></div><div><span>Leave balance</span><b>${12 + (p.base % 13)} days</b></div></div>
            <div class="ai-box"><div class="label">${CI.icon('sparkle', 14)} PEOPLE AGENT · SNAPSHOT</div><div style="font-size:14.5px;line-height:1.6">${p.name.split(' ')[0]} has been with Viper ${tenure} years. Last review: <b>${revs[0] ? revs[0].rating : '—'}</b>. ${p.review ? 'Annual review is <b>due this month</b>.' : 'Next review Aug 2027.'} ${p.id === 'kw' ? '<b>White card expires in 21 days.</b>' : 'All licences current.'}</div></div>
            <div class="label" style="margin:18px 0 10px">Current projects</div><div style="display:flex;gap:8px;flex-wrap:wrap">${p.loc.split(' · ').map(l => `<span class="tag" style="font-size:11px;padding:5px 9px">${l}</span>`).join('')}</div>`,
          c: () => unlocked ? compHtml() : `<div class="locked"><div class="blurred"><div class="kv"><div><span>Base salary</span><b>$000,000</b></div><div><span>Last increase</span><b>0.0%</b></div></div></div><div class="fp" id="fp">${CI.icon('finger', 44)}<span class="scanbar"></span></div><div style="font-weight:600;font-size:16px">Restricted · directors only</div><div class="mute" style="font-size:13px;margin:4px 0 16px">Salary, increases and bonuses are encrypted at rest.</div><button class="btn primary" id="unlock">${CI.icon('unlock', 15)} Unlock with Face ID</button></div>`,
          r: () => revs.map((r, i) => `<div class="rev" style="animation:rise .5s ${i * .08}s both"><div class="rev-h"><div><b>${r.fy} Annual Review</b><div class="mono dim" style="font-size:10.5px">FILED ${r.date.toUpperCase()} · ${CI.initials(CI.people.find(x => x.dept === p.dept && x.lead).name)}</div></div><div style="text-align:right"><div class="stars">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= r.score ? 'on' : ''}"></i>`).join('')}</div><div style="font-size:12px;margin-top:5px">${r.rating}</div></div></div><div class="mute" style="font-size:13.5px">${CI.icon('sparkle', 12, 'red').replace('<svg', '<svg style="display:inline;vertical-align:-1px"')} ${r.summary}</div><div style="margin-top:10px"><span class="src-chip" style="font-size:12px;padding:5px 11px">${CI.icon('file', 12)}${r.fy} Review — ${p.name.split(' ')[1]}.pdf</span></div></div>`).join('') + (p.review ? `<div class="rev" style="border-style:dashed;border-color:rgba(255,181,71,.4)"><div class="rev-h"><b class="amber">FY27 Annual Review</b><span class="pill amber">Due 30 Nov</span></div><div class="mute" style="font-size:13px">People Agent has pre-filled the form from project outcomes, attendance and feedback.</div><button class="btn sm" style="margin-top:10px" onclick="CI.toast('Draft review opened — demo','file')">Open draft</button></div>` : ''),
          d: () => lic.map(([n, s, warn]) => `<div class="doc-row">${CI.icon('file', 16)}<span><b>${n}</b><div class="mono dim" style="font-size:10px">${s.toUpperCase()}</div></span>${warn ? '<span class="pill red">21 days</span>' : '<span class="pill green">Current</span>'}</div>`).join('')
        };
        function compHtml() {
          const mx = Math.max(...comp.map(x => x.base + x.bonus)); const W = 460, H = 180, bw = 46, gap = (W - comp.length * bw) / (comp.length + 1);
          const bars = comp.map((x, i) => { const hx = gap + i * (bw + gap); const hb = x.base / mx * (H - 30), hn = x.bonus / mx * (H - 30); return `<g><rect class="bar" style="--d:${i * .1}s" x="${hx}" y="${H - hb}" width="${bw}" height="${hb}" rx="3" fill="url(#gb)"/><rect class="bar" style="--d:${.4 + i * .1}s" x="${hx}" y="${H - hb - hn - 2}" width="${bw}" height="${hn}" rx="3" fill="var(--amber)" opacity=".85"/><text x="${hx + bw / 2}" y="${H + 16}" text-anchor="middle" fill="var(--mute)" font-size="11" font-family="JetBrains Mono">${x.y}</text>${x.inc ? `<text x="${hx + bw / 2}" y="${H - hb - hn - 8}" text-anchor="middle" fill="var(--green)" font-size="10.5" font-family="JetBrains Mono">+${x.inc}%</text>` : ''}</g>`; }).join('');
          const cur = comp[comp.length - 1];
          return `<div class="kv"><div><span>Base salary · FY26</span><b>$${cur.base.toLocaleString()}</b></div><div><span>FY26 bonus</span><b>$${cur.bonus.toLocaleString()}</b></div><div><span>Last increase</span><b class="green">+${cur.inc}%</b></div><div><span>Next review</span><b>${p.review ? '30 Nov 2026' : 'Aug 2027'}</b></div></div>
          <div class="label" style="margin:6px 0 12px">Salary history · base + bonus</div>
          <svg class="comp-chart" viewBox="0 -10 ${W} ${H + 30}"><defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2e4d"/><stop offset="1" stop-color="#ff2e4d" stop-opacity=".25"/></linearGradient></defs><line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="rgba(255,255,255,.12)"/>${bars}</svg>
          <div class="legend" style="margin:8px 0 18px"><span><i style="background:var(--red);height:8px"></i>BASE</span><span><i style="background:var(--amber);height:8px"></i>BONUS</span></div>
          <table class="mini-tbl"><tr><th>Year</th><th class="r">Base</th><th class="r">Increase</th><th class="r">Bonus</th></tr>${comp.slice().reverse().map(x => `<tr><td class="mono">${x.y}</td><td class="r">$${x.base.toLocaleString()}</td><td class="r green">${x.inc ? '+' + x.inc + '%' : '—'}</td><td class="r">$${x.bonus.toLocaleString()}</td></tr>`).join('')}</table>
          <div class="mono dim" style="font-size:10px;margin-top:10px">${CI.icon('lock', 10).replace('<svg', '<svg style="display:inline;vertical-align:-1px"')} ACCESS LOGGED · ${CI.sydTime()} · PLACEHOLDER FIGURES</div>`;
        }
        const show = t => { CI.$$('#dt button', panel).forEach(b => b.classList.toggle('on', b.dataset.t === t)); dp.innerHTML = tabs[t](); dp.style.animation = 'none'; void dp.offsetWidth; dp.style.animation = 'rise .45s var(--ease) both'; wire(); };
        function wire() {
          const u = CI.$('#unlock', dp); if (!u) return;
          u.onclick = async () => { const fp = CI.$('#fp', dp); fp.classList.add('scanning'); u.disabled = true; u.textContent = 'Scanning…'; CI.sfx('open'); await CI.sleep(1500); fp.classList.remove('scanning'); fp.classList.add('ok'); fp.innerHTML = CI.icon('shield', 40); CI.sfx('ok'); await CI.sleep(600); unlocked = CI.hrUnlocked = true; show('c'); CI.$$('#dt button .ic', panel).forEach(i => i.outerHTML = CI.icon('unlock', 12)); };
        };
        CI.$('#dt', panel).onclick = e => { const b = e.target.closest('[data-t]'); b && show(b.dataset.t); };
        show('o');
      } });
  }
  return { destroy() { ro.disconnect(); } };
};
