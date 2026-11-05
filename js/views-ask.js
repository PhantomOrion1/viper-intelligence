/* ==========================================================
   02 · ASK ANYTHING — scripted RAG-style demo
   ========================================================== */
(function () {
  const S = (doc, n) => ({ doc, n });
  CI.answers = [
    { id: 'elec', keys: ['electric'], q: 'Why have electrical costs increased on Chatswood?', found: 37,
      read: ['FFC - October.xlsx', 'Variation Register.xlsx', 'Site Meeting #42 — Minutes.pdf'],
      text: 'The electrical forecast at **Archer & Albert** is up **$300K** since last month, from $4.2M to $4.5M.[1] The latest cost report links **$270K** of that to two approved variations:[2]',
      table: [['VAR-112', 'Additional sub-mains L10–L24', '$210K', 'Approved'], ['VAR-115', 'Lobby lighting upgrade', '$60K', 'Approved'], ['—', 'No explanation on file', '$30K', 'Needs clarification']],
      after: 'The remaining **$30K** first appears in the October forecast with no matching variation, and it wasn’t discussed at Site Meeting #42.[3] I’d suggest asking the Commercial Manager to clarify before Tuesday’s PCG.',
      sources: [S('ffc', 1), S('varreg', 2), S('m42', 3)], follow: ['Draft an email to the Commercial Manager', 'What else moved this month?', 'Show me the variation register'] },
    { id: 'draft', keys: ['draft', 'email to', 'write an email', 'commercial manager'], q: 'Draft an email to the Commercial Manager', found: 4,
      read: ['FFC - October.xlsx', 'Variation Register.xlsx'],
      text: 'Here’s a draft for **James Liu**. I’ve kept it short and linked the two files he’ll need.',
      email: { to: 'James Liu (Commercial Manager)', subj: 'Archer & Albert — $30K electrical and prelims movement', body: 'Hi James,\n\nThe October FFC for Archer & Albert shows electrical up $300K. $270K matches VAR-112 and VAR-115, but I can’t find what the other $30K relates to.\n\nPrelims are also up $300K, which looks like the crane extension in Programme Rev 13. It isn’t noted in the cost report yet.\n\nCan you confirm both before Tuesday’s PCG?\n\nThanks' },
      sources: [S('ffc', 1), S('varreg', 2)], follow: ['What else moved this month?', 'What’s overdue across all projects?'] },
    { id: 'moved', keys: ['moved', 'what else', 'changed', 'movement', 'forecast'], q: 'What else moved this month?', found: 58,
      read: ['FFC - October.xlsx (×9 projects)', 'Variation Register.xlsx', 'Programme Rev 13.pdf'],
      text: 'Across the portfolio, October forecasts moved by a net **+$' + CI.portfolioMove + 'M**. Two items have no explanation on file:[1]',
      table: [['Archer & Albert', 'Preliminaries', '+$300K', 'Not explained'], ['8 Phillip St', 'Lifts', '+$400K', 'Not explained'], ['8 Phillip St', 'Façade', '+$1.2M', 'Partly explained'], ['Archer & Albert', 'Electrical', '+$300K', 'Mostly explained']],
      after: 'The Archer & Albert prelims movement lines up with the **6-week crane extension** in Programme Rev 13.[2] The 8 Phillip St lift claim includes a **$412K “acceleration”** line with no site instruction.[3]',
      sources: [S('ffc', 1), S('prog', 2), S('lift9', 3)], follow: ['Open the watchdog', 'Draft an email to the Commercial Manager'] },
    { id: 'overdue', keys: ['overdue', 'late', 'action', 'outstanding'], q: 'What’s overdue across all projects?', found: 23,
      read: ['Site Meeting #42 — Minutes.pdf', 'Site Meeting #17 — Minutes.pdf', 'Outlook · 3 mailboxes'],
      text: '**3 actions** are overdue across your projects:[1][2]',
      table: [['Façade junction detail L4', 'Design manager', '3 Nov', 'Raised 4×'], ['Hoist booking schedule', 'Danks St site manager', '4 Nov', 'Raised 3×'], ['RFI-208 column setout', 'Meridian Structures', '5 Nov', 'Chased 3×']],
      after: 'The façade junction has now been raised in **four meetings in a row** without being resolved. RFI-208 is holding the L15 pour booked for 7 Nov.',
      sources: [S('m42', 1), S('rfi208', 2)], follow: ['Nudge all three owners', 'Summarise the last site meeting at Archer & Albert'] },
    { id: 'nudge', keys: ['nudge', 'remind', 'chase'], q: 'Nudge all three owners', found: 3, read: ['Action tracker'],
      text: 'Done. I’ve sent a short reminder to each owner with the original minute or email attached. I’ll flag it in tomorrow’s brief if any are still open. **(Demo: nothing was actually sent.)**', sources: [], follow: ['What’s overdue across all projects?'] },
    { id: 'prelim', keys: ['prelim', 'crane', 'preliminar'], q: 'Why are prelims up at Archer & Albert?', found: 29,
      read: ['FFC - October.xlsx', 'Programme Rev 13.pdf', 'Site Meeting #42 — Minutes.pdf'],
      text: 'Preliminaries are forecast at **$5.5M**, up **$300K** on September.[1] Most of it is the tower crane:',
      table: [['01-160', 'Tower Crane', '+$142K', ''], ['01-161', 'Tower Crane — Labour', '+$58K', ''], ['01-170', 'Hoists', '+$46K', ''], ['01-110', 'Temp Services', '+$30K', ''], ['01-090', 'Security', '+$24K', '']],
      after: 'Nothing in the cost report explains it yet. But **Programme Rev 13** moves structure completion out by **6 weeks**,[2] and Site Meeting #42 notes the crane hire was extended.[3] So the cost is probably real. It just hasn’t been written up.',
      sources: [S('ffc', 1), S('prog', 2), S('m42', 3)], follow: ['Draft an email to the Commercial Manager', 'What else moved this month?'] },
    { id: 'meeting', keys: ['meeting', 'minutes', 'summar', 'site meeting'], q: 'Summarise the last site meeting at Archer & Albert', found: 1,
      read: ['Site Meeting #42 — Minutes.pdf'],
      text: '**Site Meeting #42** (30 Oct) in four lines:[1]\n• L14 pour done. L15 transfer slab revision due from Meridian by 10 Nov.\n• Façade junction at L4 is **still unresolved**, now 4 meetings running.\n• Electrical to resubmit the lobby lighting quote (VAR-115) by 12 Nov.\n• Crane hire extended. Rev 14 programme due 8 Nov.',
      after: 'I pulled **6 actions** from it into the tracker.', sources: [S('m42', 1)], follow: ['What’s overdue across all projects?', 'Why are prelims up at Archer & Albert?'] },
    { id: 'structural', keys: ['engineer', 'structural', 'meridian', 'rfi', 'email'], q: 'What has the structural engineer sent us this week?', found: 9,
      read: ['Outlook · Projects inbox', 'RE: RFI-208 Column setout.msg'],
      text: 'Meridian Structures sent **4 emails** this week. One needs attention:[1]\n• **RFI-211** (hob detail L3) — answered, closed.\n• **L15 transfer slab** — revised reinforcement drawings promised “early next week”.\n• **Invoice #3381** — forwarded to accounts.\n• **RFI-208** — still **no reply** after 3 follow-ups. Needed by 5 Nov to keep the L15 pour on 7 Nov.',
      sources: [S('rfi208', 1)], follow: ['Nudge all three owners', 'What’s overdue across all projects?'] },
    { id: 'vars', keys: ['variation', 'approve', 'var-'], q: 'Which variations are waiting on me?', found: 12, read: ['Variation Register.xlsx (×9)'],
      text: '**4 variations** totalling **$612K** are awaiting approval:[1]',
      table: [['VAR-117', 'Archer & Albert · podium façade upgrade', '$184K', 'Needs you by 14 Nov'], ['VAR-221', '8 Phillip St · curtain wall escalation', '$290K', 'With CFO'], ['VAR-064', 'Danks St · retail shopfront', '$86K', 'With Director'], ['VAR-039', 'Mason & Main · Eat Street signage', '$52K', 'With Director']],
      sources: [S('varreg', 1)], follow: ['Why is VAR-117 needed?'] },
    { id: 'var117', keys: ['var-117', 'why is var', 'podium'], q: 'Why is VAR-117 needed?', found: 6, read: ['Variation Register.xlsx', 'Façade consultant memo.pdf'],
      text: 'VAR-117 swaps the podium cladding at Archer & Albert to a **thicker panel** to fix the L4 junction detail. The design team has been stuck on that junction for 4 meetings.[1] Approving it would likely **close the overdue action** too. Commercial has priced it at **$184K**, and there’s **$210K** left in contingency.',
      sources: [S('varreg', 1), S('m42', 2)], follow: ['What’s overdue across all projects?'] },
    { id: 'people', keys: ['review', 'salary', 'staff', 'bonus', 'hr', 'licence', 'pay'], q: 'Whose annual reviews are due this month?', found: 5, read: ['Annual Review Schedule FY27.xlsx', 'Staff files (restricted)'],
      text: '**5 reviews** are due in November. The salary review cycle closes **30 Nov**.[1]\n• Daniel Reyes — Senior PM\n• Lena Kovač — Design Manager\n• Aisha Rahman — Planning Manager\n• Olivia Grant — Contract Administrator\n• Kiri Walker — WHS Manager (white card renewal due in 21 days)',
      after: 'Pay and bonus details are **restricted**. Open People to unlock them with director access.', sources: [S('hr', 1)], follow: ['Open the org chart'] }
  ];
  CI.suggested = ['Why have electrical costs increased on Chatswood?', 'What’s overdue across all projects?', 'Why are prelims up at Archer & Albert?', 'What has the structural engineer sent us this week?', 'Which variations are waiting on me?', 'Whose annual reviews are due this month?'];

  function match(q) {
    const s = q.toLowerCase();
    if (/open the watchdog/.test(s)) return { nav: 'watchdog' };
    if (/org chart/.test(s)) return { nav: 'people' };
    if (/variation register/.test(s)) return { doc: 'varreg' };
    const sm = q.match(/^Summarise “(.+)”$/);
    if (sm) { const k = Object.keys(CI.docs).find(k => CI.docs[k].title === sm[1]); if (k) { const d = CI.docs[k]; return { id: 'sum', found: 1, read: [d.title], text: d.summary.replace(/<b>(.+?)<\/b>/g, '**$1**') + '[1]', sources: [S(k, 1)], follow: CI.suggested.slice(0, 2) }; } }
    let best = null, score = 0;
    CI.answers.forEach(a => { if (a.q.toLowerCase() === s) { best = a; score = 99; } let sc = 0; a.keys.forEach(k => { if (s.includes(k)) sc += k.length; }); if (sc > score) { score = sc; best = a; } });
    if (score > 0) return best;
    return { id: 'gen', found: 14, read: ['Project drive · Y:', 'Outlook · 3 mailboxes', 'Meeting minutes'],
      text: `I searched **48,213 files and 12,906 emails** for “${CI.esc(q)}” and found **14 relevant documents**.[1] In the full build this answer would be written from those documents, with every figure linked back to its source.`,
      after: 'For this preview, try one of the suggested questions to see a complete answer.', sources: [S('ffc', 1), S('m42', 2)], follow: CI.suggested.slice(0, 3) };
  }
  const md = s => CI.esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*\*[^*]*$/, m => m.replace('**', '')).replace(/\[(\d)\]/g, '<sup class="cite" data-n="$1">$1</sup>').replace(/\n•/g, '<br>•').replace(/\n\n/g, '<br><br>');

  CI.views.ask = function (el) {
    el.innerHTML = `
    <div class="vh">
      <div><div class="kicker">02 · ASK ANYTHING</div><h1 data-scramble>Ask anything about a project</h1>
      <p class="sub">A private, ChatGPT-style assistant connected to your project files, email and minutes. Plain-English answers, with links to the documents they came from.</p></div>
      <div class="agent-strip" id="as"></div>
    </div>
    <div class="ask-wrap">
      <div class="card chat flat">
        <div class="chat-scroll" id="cs">
          <div class="chat-empty" id="empty">
            <div class="orb"><i></i><i></i><i></i></div>
            <h2 style="font-size:24px">What do you want to know?</h2>
            <div class="mute">Connected to 48,213 files, 12,906 emails and 342 sets of minutes.</div>
            <div class="suggest">${CI.suggested.map((s, i) => `<button style="--i:${i}">${s}</button>`).join('')}</div>
          </div>
        </div>
        <form class="chat-input" id="ci"><input id="q" placeholder="Ask about costs, programme, people, emails…" autocomplete="off"><button class="send" type="submit">${CI.icon('send', 18)}</button></form>
      </div>
      <div class="grid" style="align-content:start">
        <div class="card"><div class="card-h"><span class="label">Connected sources</span></div>
          <div class="conn">
            <div class="conn-row">${CI.icon('folder', 16)}<span>Project drive · Y:<small>48,213 files · synced 2m ago</small></span><span class="dot pulse"></span></div>
            <div class="conn-row">${CI.icon('mail', 16)}<span>Outlook · 3 mailboxes<small>12,906 emails · live</small></span><span class="dot pulse"></span></div>
            <div class="conn-row">${CI.icon('check', 16)}<span>Meeting minutes<small>342 meetings · 10 projects</small></span><span class="dot pulse"></span></div>
            <div class="conn-row">${CI.icon('sheet', 16)}<span>Cost reports & FFCs<small>186 reports</small></span><span class="dot pulse"></span></div>
            <div class="conn-row">${CI.icon('lock', 16)}<span>Staff files<small>restricted · directors only</small></span><span class="dot amber"></span></div>
          </div>
        </div>
        <div class="card"><div class="card-h"><span class="label">Relevance · current answer</span></div><div class="relev" id="rel"><div class="mono dim" style="font-size:11px">Ask a question to see which documents were used.</div></div></div>
      </div>
    </div>`;
    CI.agentStrip(['ask', 'files', 'inbox'], CI.$('#as', el));
    const cs = CI.$('#cs', el), input = CI.$('#q', el), rel = CI.$('#rel', el);
    let busy = false, alive = true;
    const scroll = () => cs.scrollTop = cs.scrollHeight;

    async function ask(q) {
      if (busy || !q.trim()) return; busy = true;
      const empty = CI.$('#empty', el); if (empty) empty.remove();
      const m = match(q);
      if (m.nav) { location.hash = '#/' + m.nav; return; }
      if (m.doc) { busy = false; CI.openDoc(m.doc); return; }
      cs.insertAdjacentHTML('beforeend', `<div class="msg me"><div class="bub">${CI.esc(q)}</div></div>`);
      const box = document.createElement('div'); box.className = 'msg ai';
      box.innerHTML = `<div class="ai-av">${CI.icon('crown', 16)}</div><div><div class="think"></div><div class="answer"></div><div class="ans-extra"></div></div>`;
      cs.appendChild(box); scroll(); CI.sfx('open');
      const think = CI.$('.think', box), ans = CI.$('.answer', box), extra = CI.$('.ans-extra', box);
      const steps = [['Understanding the question', 450], [`Searching 48,213 files & 12,906 emails → <span class="file">${m.found} matches</span>`, 800], ...m.read.map(r => [`Reading <span class="file">${r}</span>`, 420]), ['Cross-checking figures between documents', 600]];
      rel.innerHTML = '';
      for (const [s, ms] of steps) {
        if (!alive) return;
        const d = document.createElement('div'); d.className = 'st'; d.innerHTML = `<span class="sp"></span><span>${s}</span>`; think.appendChild(d); scroll();
        await CI.sleep(ms);
        d.classList.add('done'); d.querySelector('.sp').outerHTML = `<svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>`;
      }
      // relevance panel
      (m.sources || []).concat([{ doc: 'prog' }, { doc: 'rfi208' }]).filter((v, i, a) => a.findIndex(x => x.doc === v.doc) === i).slice(0, 5).forEach((s, i) => {
        const d = CI.docs[s.doc]; const pct = [96, 91, 84, 62, 48][i];
        rel.insertAdjacentHTML('beforeend', `<div class="relev-row" data-doc="${s.doc}" style="animation-delay:${i * 80}ms"><div class="t"><span>${d.title}</span><span class="mono dim">${pct}%</span></div><div class="bar"><i data-w="${pct}"></i></div></div>`);
      });
      setTimeout(() => CI.$$('.relev-row .bar i', rel).forEach(i => i.style.width = i.dataset.w + '%'), 50);
      think.classList.add('collapsed');
      think.insertAdjacentHTML('beforeend', `<div class="sum">${CI.icon('sparkle', 13)} Read ${m.read.length} documents · ${(steps.reduce((a, s) => a + s[1], 0) / 1000).toFixed(1)}s</div>`);
      await stream(ans, m.text);
      if (m.table) { extra.insertAdjacentHTML('beforeend', `<table class="mini-tbl">${m.table.map(r => `<tr>${r.map((c, i) => `<td class="${i === 2 ? 'r' : ''}">${/Needs|Not explained/.test(c) ? `<span class="pill red">${c}</span>` : /Partly|Mostly|Raised|Chased|Needs you/.test(c) ? `<span class="pill amber">${c}</span>` : /Approved/.test(c) ? `<span class="pill green">${c}</span>` : /^\+/.test(c) ? `<span class="chg-up">${c}</span>` : c}</td>`).join('')}</tr>`).join('')}</table>`); scroll(); await CI.sleep(350); }
      if (m.email) { extra.insertAdjacentHTML('beforeend', `<div class="email-draft"><div class="eh"><span>To: <b>${m.email.to}</b></span><span>Subject: <b>${m.email.subj}</b></span></div><div class="eb">${CI.esc(m.email.body)}</div><div class="ef"><button class="btn sm" data-t="Draft saved to Outlook">Save draft</button><button class="btn primary sm" data-t="Demo — email not sent">${CI.icon('send', 13)} Send</button></div></div>`); scroll(); await CI.sleep(350); }
      if (m.after) { const p = document.createElement('div'); p.className = 'answer'; p.style.marginTop = '12px'; extra.appendChild(p); await stream(p, m.after); }
      if (m.sources && m.sources.length) extra.insertAdjacentHTML('beforeend', `<div class="sources"><div class="label">Sources</div><div class="row">${m.sources.map(s => `<span class="src-chip" data-doc="${s.doc}"><span class="num">${s.n}</span>${CI.docs[s.doc].label}</span>`).join('')}</div></div>`);
      if (m.follow) extra.insertAdjacentHTML('beforeend', `<div class="followups">${m.follow.map(f => `<button data-q="${CI.esc(f)}">${CI.icon('arrowR', 12)} ${f}</button>`).join('')}</div>`);
      scroll(); busy = false;
    }
    async function stream(node, text) {
      const words = text.split(/(\s+)/); let out = '';
      node.innerHTML = '<span class="caret"></span>';
      for (let i = 0; i < words.length; i++) {
        if (!alive) return; out += words[i];
        if (i % 2 === 0) { node.innerHTML = md(out) + '<span class="caret"></span>'; if (i % 6 === 0) { scroll(); CI.sfx('type'); } await CI.sleep(18 + Math.random() * 30); }
      }
      node.innerHTML = md(text); scroll();
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('.suggest button'); if (b) ask(b.textContent);
      const f = e.target.closest('[data-q]'); if (f) ask(f.dataset.q);
      const d = e.target.closest('[data-doc]'); if (d) CI.openDoc(d.dataset.doc);
      const c = e.target.closest('sup.cite'); if (c) { const m = c.closest('.msg'); const chip = m && CI.$$('.src-chip', m).find(x => x.querySelector('.num').textContent === c.dataset.n); chip && CI.openDoc(chip.dataset.doc); }
      const t = e.target.closest('[data-t]'); if (t) CI.toast(t.dataset.t, 'mail');
    });
    CI.$('#ci', el).onsubmit = e => { e.preventDefault(); const v = input.value; input.value = ''; ask(v); };
    if (CI.pendingQuery) { const q = CI.pendingQuery; CI.pendingQuery = null; setTimeout(() => ask(q), 700); }
    else setTimeout(() => input.focus({ preventScroll: true }), 600);
    CI.askHere = q => ask(q);
    return { destroy() { alive = false; CI.askHere = null; } };
  };
})();
