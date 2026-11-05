/* ==========================================================
   01 · MORNING BRIEFING
   ========================================================== */
CI.views.briefing = function (el) {
  const items = [
    { c: 'red', t: '1 variation awaiting your decision', s: 'VAR-117 · Podium façade upgrade · Archer & Albert · $184K',
      ev: ['Requested by Design Manager on 28 Oct. Commercial has priced it at $184K.', 'Programme impact: none if approved by 14 Nov (façade panels ordered 18 Nov).'], docs: ['varreg'],
      acts: `<button class="btn primary sm" data-ok="VAR-117 approved · Contract Admin notified">Approve</button><button class="btn sm" data-ask="Why is VAR-117 needed?">Ask why</button><button class="btn sm" data-ok="Deferred to Tuesday PCG">Defer to PCG</button>` },
    { c: 'red', t: '3 actions now overdue', s: 'Façade junction (4th time raised) · RFI-208 · Hoist schedule',
      ev: ['Façade panel junction L4 — Design manager — due 3 Nov', 'RFI-208 column setout — Meridian Structures — due 5 Nov', 'Hoist booking schedule — Danks St site — due 4 Nov'], docs: ['m42', 'rfi208'],
      acts: `<button class="btn ghost-red sm" data-ok="Reminders sent to 3 owners">Nudge all owners</button><a class="btn sm" href="#/actions">Open tracker</a>` },
    { c: 'amber', t: 'Cost movements at Archer & Albert', s: '+$800K across 3 trades · $330K not explained in the cost report',
      ev: ['Electrical +$300K: $270K matches VAR-112 and VAR-115. $30K has no explanation.', 'Preliminaries +$300K: tower crane extended about 6 weeks (Programme Rev 13). Not in the cost report.'], docs: ['ffc', 'prog'],
      acts: `<a class="btn sm" href="#/watchdog">Open watchdog</a><button class="btn sm" data-ask="Why have electrical costs increased on Chatswood?">Ask about it</button>` },
    { c: 'grey', t: 'Updated cost report received', s: 'Mason & Main · October FFC · 2 movements, both explained',
      ev: ['Watchdog compared it with September. No action needed.'], docs: [], acts: '' },
    { c: 'grey', t: '2 consultant responses outstanding', s: 'Structural (RFI-208) · Hydraulic redesign (8 Phillip St)',
      ev: ['RFI-208 has been chased 3 times by email. The L15 pour is booked for 7 Nov.'], docs: ['rfi208'], acts: '' },
    { c: 'cyan', t: 'Today · 3 meetings', s: '9:30 PCG Archer & Albert · 1:00 Board · 4:00 Site walk Erskineville',
      ev: ['PCG pack prepared. Includes the unexplained prelims movement as item 3.'], docs: [], acts: `<button class="btn sm" data-ok="PCG pack sent to your inbox">Send me the PCG pack</button>` }
  ];
  const spark = (pts, col) => {
    const w = 100, h = 30, mx = Math.max(...pts), mn = Math.min(...pts);
    const xy = pts.map((v, i) => [i / (pts.length - 1) * w, h - (v - mn) / (mx - mn || 1) * h]);
    const d = 'M' + xy.map(p => p.map(n => n.toFixed(1)).join(',')).join(' L');
    return `<svg class="spark" viewBox="0 0 100 30" preserveAspectRatio="none"><defs><linearGradient id="g${col.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path class="ar" d="${d} L100,30 L0,30 Z" fill="url(#g${col.slice(1)})"/><path class="ln" d="${d}" stroke="${col}" vector-effect="non-scaling-stroke"/></svg>`;
  };
  const totalVal = CI.projects.reduce((a, p) => a + p.value, 0);
  const name = CI.user.name ? ', ' + CI.esc(CI.user.name) : '';
  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">01 · MORNING BRIEFING</div><h1 data-scramble>${CI.greeting()}${name}.</h1>
    <p class="sub">One short summary each morning: what changed, what's overdue, and what needs a decision from you. Tap any item to see the evidence behind it.</p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="kpis stagger">
    <div class="card kpi"><span class="label">Portfolio in delivery</span><div class="v" data-count="${(totalVal / 1000).toFixed(2)}" data-dec="2" data-pre="$" data-suf="B">0</div><div class="d green">▲ 10 projects</div>${spark([3, 3.2, 3.3, 3.5, 3.6, 3.7, 3.86], '#3dffa8')}</div>
    <div class="card kpi"><span class="label">Forecast movement · Oct</span><div class="v red" data-count="${CI.portfolioMove}" data-dec="1" data-pre="+$" data-suf="M">0</div><div class="d mute">${CI.money(CI.unexplainedMove)} not explained</div>${spark([.4, .9, .6, 1.1, 1.4, 1.2, 2.6], '#ff2e4d')}</div>
    <div class="card kpi"><span class="label">Open actions</span><div class="v" data-count="12">0</div><div class="d red">3 overdue</div>${spark([18, 16, 17, 14, 15, 13, 12], '#a283ff')}</div>
    <div class="card kpi"><span class="label">Variations pending</span><div class="v" data-count="612" data-pre="$" data-suf="K">0</div><div class="d amber">4 awaiting approval</div>${spark([200, 320, 280, 450, 390, 520, 612], '#ffb547')}</div>
    <div class="card kpi"><span class="label">Safety · days LTI-free</span><div class="v green" data-count="214">0</div><div class="d mute">across all sites</div>${spark([150, 160, 172, 180, 195, 205, 214], '#38e8ff')}</div>
  </div>
  <div class="brief-grid">
    <div class="card brief-card">
      <div class="label red">Daily brief · prepared 6:00am by Briefing Agent</div>
      <div class="brief-hello">${CI.greeting()}${name}</div>
      <div class="brief-date">${CI.sydDate()} · 41 updates read, 6 worth your time</div>
      <div class="voice" id="voice"><button class="play" id="play">${CI.icon('play', 16)}</button><div class="wave">${Array.from({ length: 48 }, (_, k) => `<i style="--k:${k};--h:${8 + Math.round(Math.abs(Math.sin(k * 1.7)) * 24)}"></i>`).join('')}</div><span class="vt" id="vt">LISTEN · 0:52</span></div>
      <div class="brief-items">${items.map((it, i) => `
        <div class="bi" style="--i:${i}">
          <div class="bi-h"><span class="dot ${it.c} ${it.c === 'red' ? 'pulse' : ''}"></span><div class="tx">${it.t}<small>${it.s}</small></div><span class="chev">${CI.icon('chevR', 18)}</span></div>
          <div class="bi-b"><div><div class="bi-in">
            ${it.ev.map(e => `<div class="ev">${CI.icon('sparkle', 14)}<span>${e}</span></div>`).join('')}
            ${it.docs.length ? `<div class="acts">${it.docs.map(d => `<span class="src-chip" data-doc="${d}">${CI.icon(CI.docs[d].kind === 'xls' ? 'sheet' : CI.docs[d].kind === 'mail' ? 'mail' : 'file', 14)}${CI.docs[d].label}</span>`).join('')}</div>` : ''}
            ${it.acts ? `<div class="acts">${it.acts}</div>` : ''}
          </div></div></div>
        </div>`).join('')}
      </div>
    </div>
    <div class="grid" style="align-content:start">
      <div class="card" style="padding:26px 20px">
        <div class="card-h"><span class="label">Delivered to your phone</span><span class="chip">${CI.icon('bell', 12)} 6:00AM DAILY</span></div>
        <div class="phone"><div class="phone-notch"></div><div class="phone-screen lock">
          <div class="lock-date">${new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</div>
          <div class="lock-time">6:00</div>
          <div class="notif" style="--d:.9s"><span class="ap">${CI.icon('crown', 16)}</span><div><div class="h"><b>VIPER AI</b><span>now</span></div><div class="tt">Your morning brief is ready</div><div class="bd">1 decision needed · 3 overdue actions · $330K unexplained at Archer & Albert</div></div></div>
          <div class="notif" style="--d:1.8s"><span class="ap">${CI.icon('radar', 16)}</span><div><div class="h"><b>WATCHDOG</b><span>5:42am</span></div><div class="tt">Lift claim flagged · 8 Phillip St</div><div class="bd">$0.4M “acceleration” with no instruction on file.</div></div></div>
          <div class="notif" style="--d:2.7s"><span class="ap">${CI.icon('check', 16)}</span><div><div class="h"><b>MINUTES READER</b><span>yesterday</span></div><div class="tt">6 actions from Site Meeting #42</div><div class="bd">Façade junction raised for the 4th time.</div></div></div>
        </div></div>
      </div>
      <div class="card">
        <div class="card-h"><span class="label">Project health</span><a class="mono dim" style="font-size:10px" href="#/projects">ALL PROJECTS ›</a></div>
        <div class="proj-health">${CI.projects.map(p => `
          <div class="ph-row" data-p="${p.id}"><span class="nm">${p.name}</span><span class="bar"><i data-w="${p.progress}" style="background:${p.health === 'risk' ? 'var(--red)' : p.health === 'watch' ? 'var(--amber)' : 'var(--green)'}"></i></span><span class="pill ${p.health === 'risk' ? 'red' : p.health === 'watch' ? 'amber' : 'green'}" style="font-size:10.5px;justify-content:center">${p.health === 'risk' ? 'At risk' : p.health === 'watch' ? 'Watch' : 'On track'}</span></div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
  CI.agentStrip(['brief', 'inbox', 'watch'], CI.$('#as', el));
  setTimeout(() => CI.$$('.ph-row .bar i', el).forEach(i => i.style.width = i.dataset.w + '%'), 400);
  CI.$$('.ph-row', el).forEach(r => r.onclick = () => location.hash = '#/projects/' + r.dataset.p);
  CI.$$('.bi-h', el).forEach(h => h.onclick = () => { h.parentElement.classList.toggle('open'); CI.sfx('tick'); });
  setTimeout(() => { const f = CI.$('.bi', el); f && f.classList.add('open'); }, 1500);
  el.addEventListener('click', e => {
    const ok = e.target.closest('[data-ok]'); if (ok) { CI.toast(ok.dataset.ok, 'check'); }
    const ask = e.target.closest('[data-ask]'); if (ask) { CI.pendingQuery = ask.dataset.ask; location.hash = '#/ask'; }
    const doc = e.target.closest('[data-doc]'); if (doc) CI.openDoc(doc.dataset.doc);
  });

  // voice briefing
  const voice = CI.$('#voice', el), play = CI.$('#play', el), vt = CI.$('#vt', el);
  const script = `${CI.greeting()}${CI.user.name ? ' ' + CI.user.name : ''}. Here is your brief. One variation needs your decision: the podium façade upgrade at Archer and Albert, one hundred and eighty four thousand dollars. Three actions are overdue, including the façade junction detail, which has now come up in four meetings in a row. The watchdog found eight hundred thousand dollars of cost movement at Archer and Albert. Three hundred and thirty thousand of that has no explanation in the cost report, mostly the extended tower crane. You have three meetings today, starting with the Archer and Albert PCG at nine thirty.`;
  let speaking = false, timer;
  const stop = () => { speaking = false; voice.classList.remove('on'); play.innerHTML = CI.icon('play', 16); vt.textContent = 'LISTEN · 0:52'; clearInterval(timer); try { speechSynthesis.cancel(); } catch (e) { } };
  play.onclick = () => {
    if (speaking) return stop();
    speaking = true; voice.classList.add('on'); play.innerHTML = CI.icon('pause', 16);
    let s = 0; timer = setInterval(() => { s++; vt.textContent = `PLAYING · 0:${String(s).padStart(2, '0')}`; if (s > 60) stop(); }, 1000);
    try {
      const u = new SpeechSynthesisUtterance(script); const vs = speechSynthesis.getVoices();
      u.voice = vs.find(v => /en-AU/i.test(v.lang)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
      u.rate = 1.02; u.pitch = .95; u.onend = stop; speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { setTimeout(stop, 6000); }
  };
  return { destroy: stop };
};
