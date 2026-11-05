/* ==========================================================
   04 · ACTION TRACKER — email + meeting action items
   ========================================================== */
CI.views.actions = function (el) {
  let tab = 'all', src = CI.sources[0], alive = true, run = 0;
  const pill = s => s === 'overdue' ? '<span class="pill red">Overdue</span>' : s === 'done' ? `<span class="pill green">${CI.icon('check', 11)} Done</span>` : '<span class="pill grey">Open</span>';
  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">04 · ACTION TRACKER</div><h1 data-scramble>Meeting & email actions</h1>
    <p class="sub">Reads meeting minutes and emails as they arrive and pulls out every action: what was agreed, who owns it, and when it's due. Then it checks later minutes and emails to see if it got done.</p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="ex-grid">
    <div class="card"><div class="card-h"><span class="label">Incoming</span><span class="chip"><span class="dot pulse"></span>LIVE</span></div>
      <div class="src-list" id="srcs">${CI.sources.map((s, i) => `<button class="src-item ${i ? '' : 'on'}" data-s="${s.id}">${CI.icon(s.kind === 'email' ? 'mail' : 'file', 16)}<span><b>${s.title}</b><small>${CI.proj(s.proj).name} · ${s.date}</small></span></button>`).join('')}</div>
      <div class="mono dim" style="font-size:10px;margin-top:14px;line-height:1.7">Watching: 08. Meeting Minutes (×10 projects)<br>+ 3 Outlook mailboxes</div>
    </div>
    <div class="card docview" style="padding:14px"><div class="docscan" id="scanbar"></div><div class="paper" id="paper"></div></div>
    <div class="card ex-res"><div class="card-h"><span class="label red">Extracted by Minutes Reader</span><span class="mono dim" id="exn" style="font-size:10px">0 ACTIONS</span></div><div class="extracted" id="ex"></div></div>
  </div>
  <div class="grid" style="grid-template-columns:minmax(0,2.2fr) minmax(300px,1fr)" id="lower">
    <div class="card">
      <div class="card-h" style="flex-wrap:wrap"><div class="tabs" id="tabs"><span class="ind"></span><button data-t="all" class="on">All <span class="mono dim">${CI.actions.length}</span></button><button data-t="meeting">${CI.icon('file', 13)} Meetings</button><button data-t="email">${CI.icon('mail', 13)} Emails</button><button data-t="overdue">Overdue <span class="mono red">3</span></button></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Owner</th><th>Project</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody id="tb"></tbody></table></div>
    </div>
    <div class="card">
      <div class="card-h"><span class="label">Raised repeatedly, not resolved</span>${CI.icon('repeat', 16, 'red')}</div>
      <div class="recur">${CI.recurring.map(r => `<div class="recur-row"><span class="cnt">${r.count}×</span><div><div style="font-weight:600;font-size:14px">${r.text}</div><div class="mono dim" style="font-size:10.5px">${CI.proj(r.proj).name.toUpperCase()} · ${r.since.toUpperCase()}</div></div><span class="dots">${Array.from({ length: r.of }, (_, k) => `<i class="${k < r.count ? '' : 'n'}"></i>`).join('')}</span></div>`).join('')}</div>
      <div class="quote">${CI.icon('repeat', 30)}<span>“What’s been raised repeatedly this month without being resolved?”</span></div>
      <button class="btn ghost-red" style="margin-top:14px;width:100%;justify-content:center" onclick="CI.pendingQuery='What’s overdue across all projects?';location.hash='#/ask'">${CI.icon('chat', 15)} Ask this question</button>
    </div>
  </div>`;
  CI.agentStrip(['minutes', 'inbox'], CI.$('#as', el));
  if (innerWidth < 1300) CI.$('#lower', el).style.gridTemplateColumns = 'minmax(0,1fr)';

  function table() {
    const rows = CI.actions.filter(a => tab === 'all' || a.src === tab || a.status === tab);
    CI.$('#tb', el).innerHTML = rows.map((a, i) => `<tr style="--i:${i}"><td style="min-width:260px"><b style="font-weight:600">${a.text}</b><div class="mono dim" style="font-size:10px;margin-top:3px">${CI.icon(a.src === 'email' ? 'mail' : 'file', 10).replace('<svg', '<svg style="display:inline;vertical-align:-1px"')} ${a.srcName}${a.raised > 1 ? ` · <span class="red">RAISED ${a.raised}×</span>` : ''}</div></td><td><div style="font-size:13.5px">${a.owner}</div><div class="mute" style="font-size:12px">${a.who}</div></td><td class="mute" style="font-size:13px;white-space:nowrap">${CI.proj(a.project).name}</td><td class="mono" style="font-size:12.5px;white-space:nowrap">${a.due}</td><td>${pill(a.status)}</td><td>${a.status === 'overdue' ? `<button class="btn sm ghost-red" data-n="${a.who}">Nudge</button>` : ''}</td></tr>`).join('');
    const b = CI.$(`#tabs [data-t="${tab}"]`, el), ind = CI.$('#tabs .ind', el);
    ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px';
    CI.$$('#tabs button', el).forEach(x => x.classList.toggle('on', x === b));
  }
  async function extract() {
    const my = ++run; const paper = CI.$('#paper', el), ex = CI.$('#ex', el), bar = CI.$('#scanbar', el), exn = CI.$('#exn', el);
    paper.innerHTML = src.body.map(([k, v]) => k === 'h' ? `<h4>${v}</h4>` : k === 'm' ? `<div class="pm">${v}</div>` : `<p>${v}</p>`).join('');
    paper.style.animation = 'none'; void paper.offsetWidth; paper.style.animation = 'fadeIn .5s both';
    ex.innerHTML = `<div class="mono dim" style="font-size:11px;display:flex;gap:8px;align-items:center"><span class="think" style="border:0;padding:0;margin:0"><span class="st"><span class="sp"></span>reading ${src.title}…</span></span></div>`;
    exn.textContent = '0 ACTIONS';
    bar.classList.remove('go'); void bar.offsetWidth; bar.classList.add('go');
    await CI.sleep(700); if (my !== run || !alive) return;
    ex.innerHTML = '';
    const hls = CI.$$('.hl', paper);
    for (let i = 0; i < hls.length; i++) {
      if (my !== run || !alive) return;
      const h = hls[i]; h.classList.add('on'); CI.sfx('tick');
      const [t, o, d] = h.dataset.a.split('|');
      ex.insertAdjacentHTML('beforeend', `<div class="ex-item"><b>${t}</b><div class="meta"><span class="tag">${CI.icon('users', 10).replace('<svg', '<svg style="display:inline;vertical-align:-1px"')} ${o}</span><span class="tag ${/Overdue/.test(d) ? 'red' : ''}" style="${/Overdue/.test(d) ? 'color:var(--red2);border-color:rgba(255,46,77,.5)' : ''}">${CI.icon('calendar', 10).replace('<svg', '<svg style="display:inline;vertical-align:-1px"')} ${d}</span><span class="tag">${CI.proj(src.proj).name}</span></div></div>`);
      exn.textContent = (i + 1) + ' ACTION' + (i ? 'S' : '');
      await CI.sleep(650);
    }
    if (my === run && alive) ex.insertAdjacentHTML('beforeend', `<div class="mono green" style="font-size:10.5px;margin-top:6px;animation:fadeUp .4s both">✓ ADDED TO TRACKER · OWNERS NOTIFIED</div>`);
  }
  CI.$('#srcs', el).onclick = e => { const b = e.target.closest('[data-s]'); if (!b) return; src = CI.sources.find(s => s.id === b.dataset.s); CI.$$('.src-item', el).forEach(x => x.classList.toggle('on', x === b)); extract(); };
  CI.$('#tabs', el).onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; tab = b.dataset.t; table(); CI.sfx('tick'); };
  el.addEventListener('click', e => { const n = e.target.closest('[data-n]'); if (n) { CI.toast(`Reminder sent to ${n.dataset.n} — demo`, 'bell'); n.textContent = 'Sent ✓'; n.disabled = true; } });
  requestAnimationFrame(table); setTimeout(extract, 500);
  const onR = () => table(); addEventListener('resize', onR);
  return { destroy() { alive = false; removeEventListener('resize', onR); } };
};
