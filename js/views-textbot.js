/* ==========================================================
   08 · TEXTBOT — forward a text, get a reply drafted in your voice
   Drafts come from the live A1 Textbot API (Claude Haiku), with
   scripted fallbacks if it can't be reached.
   ========================================================== */
(function () {
  const API = 'https://jxdtextbot.vercel.app/api/draft';
  const MEM_KEY = 'viper.textbot.memory.v1', TH_KEY = 'viper.textbot.threads.v1';
  const KINDS = { persona: 'Persona', rule: 'Rule', fact: 'Fact', 'past-text': 'Past text' };
  const KCOL = { persona: 'var(--red)', rule: 'var(--amber)', fact: 'var(--cyan)', 'past-text': 'var(--violet)' };

  const DEFAULT_MEMORY = [
    { id: 'persona', kind: 'persona', title: 'Who I am', body: 'I’m the assistant to the CEO of Viper, a Sydney property developer and builder. I handle the phone so the boss doesn’t have to. I’m professional, courteous and firm, and my default answer is no. I say no first, give one short reason, and only offer a narrow alternative if there’s a sensible one. I never promise dates, money or extra work I can’t confirm.' },
    { id: 'rule-no', kind: 'rule', title: 'Default to no', body: 'Requests for extra scope, discounts, early payment, free variations, site visits on short notice, or ‘quick favours’ get a no. Variations only happen with a signed variation order and a price.' },
    { id: 'rule-money', kind: 'rule', title: 'Money', body: 'Never agree to pay invoices early or outside the payment schedule. Progress claims are paid 30 days from end of month, after the site manager has signed off the work. No cash deals.' },
    { id: 'rule-site', kind: 'rule', title: 'Site access', body: 'No one goes on site without a site induction, a white card and a booking with the site manager at least 48 hours ahead. No weekend works unless council-approved. Work hours are 7am to 5pm Monday to Friday, 8am to 1pm Saturday.' },
    { id: 'rule-style', kind: 'rule', title: 'Texting style', body: 'SMS length. One to three sentences. Professional, clear and polite, the way a good project manager writes. No swearing, no slang (no mate, arvo, reckon, nah). Open with Hi and their name if known. No emojis.' },
    { id: 'fact-projects', kind: 'fact', title: 'Current projects', body: '8 Phillip St, Parramatta (65-storey tower with hotel, structure at level 41). Archer & Albert, Chatswood (apartments, structure at level 14, completion not confirmed). Mason & Main, Merrylands (fitout, retail handover pencilled for February, not confirmed). Erskineville (build-to-rent, stage 2 structure). Moore Point, Moorebank (in planning, nothing starts until the DA is approved).' },
    { id: 'past-1', kind: 'past-text', title: 'Subbie asking for early payment', body: 'Them: Hey mate any chance we can get paid for the slab this week instead of end of month? Bit tight.\nMe: Hi, unfortunately we can’t pay early. Claims are paid on the 30-day cycle once the site manager has signed off the work. If it’s in by the 25th it will be in the next payment run.' },
    { id: 'past-2', kind: 'past-text', title: 'Buyer wants a change', body: 'Them: Can we swap the kitchen benchtop to stone? Shouldn’t be a big deal.\nMe: Not at this stage, the joinery’s already ordered. Happy to have it priced as a variation, but it will cost and may push handover.' },
    { id: 'past-3', kind: 'past-text', title: 'Neighbour complaint', body: 'Them: Your guys started at 6:30 again, it’s ridiculous.\nMe: Thanks for flagging it, that shouldn’t happen. Works don’t start before 7am and I’ve asked the site manager to sort it today.' }
  ];

  const SAMPLES = [
    { label: 'Early payment', from: '+61 412 555 019', text: 'Hey it’s Mick from Apex Plumbing. Any chance you can pay our Archer & Albert invoice this Friday? Cash flow’s a bit tight this month.', fb: 'Hi Mick, unfortunately we can’t pay early. Claims are paid 30 days from end of month once the site manager has signed off the work. If your claim is in by the 25th it will be in the next payment run.' },
    { label: 'Weekend site visit', from: '+61 433 210 774', text: 'Hi, we bought apartment 1204 at Archer & Albert. Can we come through the site this Saturday arvo to measure up for curtains?', fb: 'Hi, thanks for getting in touch. Unfortunately we can’t arrange site visits at this stage, the building is still under construction and access is restricted to inducted workers. We’ll be in touch closer to handover about a pre-settlement inspection.' },
    { label: 'Free extra work', from: '+61 400 981 332', text: 'Can you guys just throw in an extra power point in the garage while the sparky’s there? Should only take 5 mins.', fb: 'Hi, unfortunately we can’t add work outside the contract. Happy to have it priced as a variation, but it will need a signed variation order before anything is done.' },
    { label: 'Discount ask', from: '+61 421 004 118', text: 'We’re keen on an apartment at Archer & Albert but the price is a stretch. Any chance you’d knock 30k off if we sign this week?', fb: 'Hi, thanks for your interest. Unfortunately we’re not able to discount the price. Happy to send through the current availability if a different apartment suits your budget better.' },
    { label: 'Handover date', from: '+61 437 662 090', text: 'Hey just checking, is Mason & Main definitely handing over in February? Need to plan our fitout crew for the shop.', fb: 'Hi, February is pencilled in but it isn’t confirmed yet, so I’d hold off locking in your crew. We’ll confirm the handover date in writing as soon as it’s set.' },
    { label: 'Neighbour noise', from: '+61 455 318 726', text: 'Your concrete trucks were idling outside my place at 6:15 this morning on Danks St. This is the third time. Sort it out.', fb: 'Hi, thanks for flagging it and sorry for the disruption. Trucks shouldn’t be arriving before 7am, and I’ve asked the site manager to sort it out with the concrete supplier today.' },
    { label: 'Start early', from: '+61 402 777 541', text: 'Mate can my crew start at 6 tomorrow at 8 Phillip St? Want to beat the heat on the roof.', fb: 'Hi, unfortunately not. Approved work hours start at 7am and we can’t start earlier without council approval. Your crew is welcome to start at 7.' },
    { label: 'Moore Point start', from: '+61 418 230 965', text: 'Any update on Moore Point? We’ve got the civil crew ready to go next week if you give us the nod.', fb: 'Hi, thanks for checking in. Moore Point is still in planning and nothing can start until the DA is approved, so please don’t mobilise. We’ll be in touch once there’s an approval.' },
    { label: 'Cash deal', from: '+61 433 845 207', text: 'I can do the landscaping for 20% less if you pay cash, no invoice. Interested?', fb: 'Hi, thanks, but we don’t do cash deals. All work needs to be quoted and invoiced properly. Happy to receive a formal quote if you’d like to be considered.' },
    { label: 'Lost key', from: '+61 409 551 362', text: 'Sorry mate I left the site key at home, can someone from the office drive one out to 8 Phillip St?', fb: 'Hi, unfortunately no one from the office can drive one out today. Please check with the site manager on arrival, who can arrange access for inducted workers.' }
  ];

  const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const sms = (to, body) => `sms:${to.replace(/[^\d+]/g, '')}?&body=${encodeURIComponent(body)}`;
  const ago = ts => { const s = (Date.now() - ts) / 1000 | 0; return s < 60 ? 'just now' : s < 3600 ? `${s / 60 | 0}m ago` : s < 86400 ? `${s / 3600 | 0}h ago` : new Date(ts).toLocaleDateString('en-AU'); };
  const av = f => f.replace(/[^\d]/g, '').slice(-2) || '?';

  async function draft(t, memory, instruction) {
    const started = Date.now();
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: t.from, text: t.text, memory, instruction }), signal: ctl.signal });
      clearTimeout(to);
      const d = await r.json(); if (!r.ok || !d.draft) throw new Error(d.error || 'failed');
      await CI.sleep(Math.max(0, 2600 - (Date.now() - started)));
      return { draft: d.draft, live: true, model: d.model };
    } catch (e) {
      await CI.sleep(Math.max(0, 2600 - (Date.now() - started)));
      const s = SAMPLES.find(x => x.text === t.text);
      return { draft: s ? s.fb : 'Hi, thanks for your message. I’m not able to commit to that right now. I’ll check and come back to you.', live: false };
    }
  }

  CI.views.textbot = function (el) {
    let memory = load(MEM_KEY, DEFAULT_MEMORY), threads = load(TH_KEY, []), active = threads[0] ? threads[0].id : null, alive = true, filter = 'all', openMem = null;
    el.innerHTML = `
    <div class="vh">
      <div><div class="kicker">08 · TEXTBOT</div><h1 data-scramble>Forward a text. Get your reply.</h1>
      <p class="sub">Forward any text and the Reply Agent drafts an answer in your voice, using a memory of your rules, facts and past texts. Tap <b style="color:var(--text)">Reply</b> and it opens Messages, addressed to the sender. Its default answer is no.</p></div>
      <div class="agent-strip" id="as"></div>
    </div>
    <div class="tb-grid">
      <div class="grid" style="align-content:start">
        <div class="card"><div class="card-h"><span class="label">Incoming texts</span><span class="mono dim" style="font-size:10px">${SAMPLES.length} EXAMPLES</span></div>
          <div class="tb-samples">${SAMPLES.map((s, i) => `<button class="tb-sample" data-s="${i}" style="--i:${i}"><div class="tb-st"><b>${s.label}</b><span class="mono dim">${s.from}</span></div><p>${CI.esc(s.text)}</p><span class="go">${CI.icon('arrowR', 14)}</span></button>`).join('')}</div>
          <div id="compose-wrap"><button class="btn primary" id="compose-open" style="width:100%;justify-content:center;margin-top:12px">+ Forward your own text</button></div>
        </div>
        <div class="card"><div class="card-h"><span class="label">Inbox</span><span class="mono dim" id="tcount" style="font-size:10px"></span></div><div class="tb-threads" id="threads"></div></div>
      </div>
      <div class="card tb-console" id="console"></div>
      <div class="card tb-mem" id="mem"></div>
    </div>`;
    CI.agentStrip(['reply', 'inbox'], CI.$('#as', el));
    const $c = CI.$('#console', el), $t = CI.$('#threads', el), $m = CI.$('#mem', el);
    const persist = () => save(TH_KEY, threads.slice(0, 30));
    const th = id => threads.find(t => t.id === id);

    function renderThreads() {
      CI.$('#tcount', el).textContent = threads.length + ' TOTAL';
      $t.innerHTML = threads.length ? threads.map(t => `<button class="tb-thread ${t.id === active ? 'on' : ''}" data-t="${t.id}"><span class="tb-av">${av(t.from)}</span><span style="min-width:0;flex:1"><span class="tb-row"><b>${CI.esc(t.from)}</b><span class="mono dim">${ago(t.at)}</span></span><span class="tb-prev">${CI.esc(t.text)}</span></span><span class="pill ${t.status === 'ready' ? 'green' : 'amber'}" style="font-size:10.5px">${t.status === 'ready' ? 'Ready' : 'Drafting'}</span></button>`).join('')
        : `<div class="mono dim" style="font-size:11px;padding:8px 2px">Nothing forwarded yet. Pick an example above.</div>`;
    }
    function renderConsole(reveal) {
      const t = th(active);
      if (!t) { $c.innerHTML = `<div class="card-h"><span class="label">Draft console</span><span class="mono dim" style="font-size:10px">IDLE</span></div><div class="tb-empty"><div class="orb"><i></i><i></i><i></i></div><h2>Waiting for a text</h2><div class="mute" style="max-width:300px">Forward one on the left and the drafted reply shows up here, ready to send back.</div></div>`; return; }
      $c.innerHTML = `
        <div class="card-h"><span class="label">Draft console</span><span class="mono dim" style="font-size:10px">#${t.id}</span></div>
        <div class="tb-contact"><span class="tb-av lg">${av(t.from)}</span><div><b>${CI.esc(t.from)}</b><div class="mono dim" style="font-size:10.5px">SMS · ${ago(t.at)}</div></div></div>
        <div class="label" style="margin:18px 0 8px">Incoming</div>
        <div class="tb-bub in">${CI.esc(t.text)}</div>
        <div id="out"></div>
        <div class="tb-actions">
          <div class="tb-steer"><input id="steer" placeholder="Steer it: softer, firmer, offer Tuesday…"><button class="btn sm" id="redraft" ${t.status !== 'ready' ? 'disabled' : ''}>${CI.icon('repeat', 13)} Redraft</button></div>
          <div class="tb-row2"><button class="btn" id="copy" ${t.status !== 'ready' ? 'disabled' : ''}>Copy</button><a class="btn primary" id="reply" ${t.status === 'ready' ? `href="${sms(t.from, t.draft)}"` : ''} style="${t.status !== 'ready' ? 'opacity:.4;pointer-events:none' : ''}">${CI.icon('send', 14)} Reply to ${t.from.length > 16 ? 'sender' : CI.esc(t.from)}</a></div>
          <button class="tb-del" id="del">Delete thread</button>
        </div>`;
      const out = CI.$('#out', $c);
      if (t.status === 'drafting') log(out, t);
      else {
        out.innerHTML = `<div class="label" style="margin:18px 0 8px;display:flex;gap:8px;align-items:center">Draft reply <span class="dim" style="letter-spacing:.1em">· tap to edit</span><span class="pill ${t.live ? 'green' : 'grey'}" style="font-size:9.5px;margin-left:auto">${t.live ? '● LIVE AI · HAIKU' : 'OFFLINE SAMPLE'}</span></div><div class="tb-bub out"><textarea id="dt" rows="3"></textarea></div>`;
        const ta = CI.$('#dt', out);
        const fit = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
        if (reveal) decode(ta, t.draft, fit); else { ta.value = t.draft; requestAnimationFrame(fit); }
        ta.oninput = () => { t.draft = ta.value; fit(); persist(); const r = CI.$('#reply', $c); r && r.setAttribute('href', sms(t.from, t.draft)); };
      }
      CI.$('#redraft', $c).onclick = () => { const v = CI.$('#steer', $c).value.trim(); run(t, v); };
      CI.$('#copy', $c).onclick = async () => { try { await navigator.clipboard.writeText(t.draft); CI.toast('Copied to clipboard', 'check'); } catch (e) { CI.toast('Couldn’t copy, select the text instead'); } };
      CI.$('#del', $c).onclick = () => { threads = threads.filter(x => x.id !== t.id); active = threads[0] ? threads[0].id : null; persist(); renderThreads(); renderConsole(); };
    }
    async function log(out, t) {
      const n = k => memory.filter(m => m.kind === k).length;
      const lines = [`parsing incoming SMS from ${t.from}`, `loading memory · ${memory.length} records (${n('rule')} rules, ${n('fact')} fact${n('fact') === 1 ? '' : 's'}, ${n('past-text')} past texts)`, 'matching tone against past texts', 'applying rule: default to no', 'drafting with claude-haiku-5-5', 'checking reply against texting style'];
      out.innerHTML = `<div class="tb-log"></div>`; const box = CI.$('.tb-log', out);
      for (let i = 0; i < lines.length; i++) {
        if (!alive || !box.isConnected) return;
        const d = document.createElement('div'); d.innerHTML = `<span class="red">›</span> <span class="tx"></span>`; box.appendChild(d);
        const tx = CI.$('.tx', d);
        for (let k = 0; k <= lines[i].length; k += 2) { tx.textContent = lines[i].slice(0, k); await CI.sleep(8); if (!box.isConnected) return; }
        tx.textContent = lines[i];
        d.insertAdjacentHTML('beforeend', ' <span class="green">ok</span>'); CI.sfx('tick');
        await CI.sleep(180);
      }
      box.insertAdjacentHTML('beforeend', `<div class="tb-wait"><span class="sp"></span> writing…</div>`);
    }
    function decode(ta, text, fit) {
      const G = '!<>-_\\/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; const start = performance.now(), dur = Math.min(2200, 500 + text.length * 12);
      ta.classList.add('decoding');
      (function f(t) {
        if (!ta.isConnected) return; const p = Math.min(1, (t - start) / dur); const n = Math.floor(text.length * p);
        let s = text.slice(0, n); for (let i = n; i < Math.min(text.length, n + 14); i++) s += text[i] === ' ' ? ' ' : G[(Math.random() * G.length) | 0];
        ta.value = s; fit();
        if (p < 1) requestAnimationFrame(f); else { ta.value = text; ta.classList.remove('decoding'); fit(); CI.sfx('ok'); }
      })(start);
    }
    async function run(t, instruction) {
      t.status = 'drafting'; persist(); renderThreads(); if (t.id === active) renderConsole();
      const r = await draft(t, memory, instruction);
      if (!alive) return;
      Object.assign(t, { status: 'ready', draft: r.draft, live: r.live }); persist(); renderThreads();
      if (t.id === active) renderConsole(true);
      if (!r.live) CI.toast('Live drafting unavailable, showing a sample reply', 'sms');
    }
    function add(from, text) {
      const t = { id: uid(), from: from.trim() || 'Unknown number', text: text.trim(), draft: '', status: 'drafting', at: Date.now() };
      threads.unshift(t); active = t.id; renderThreads(); renderConsole(); run(t);
      if (innerWidth < 1100) $c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderMem() {
      const shown = filter === 'all' ? memory : memory.filter(m => m.kind === filter);
      $m.innerHTML = `
        <div class="card-h"><span class="label">Memory base</span><span class="mono dim" style="font-size:10px">${memory.length} RECORDS</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px"><span class="mute" style="font-size:12.5px">Everything it knows about how you reply.</span><button class="btn sm" id="madd">+ Add</button></div>
        <div class="tb-filters">${['all', 'persona', 'rule', 'fact', 'past-text'].map(k => `<button class="${filter === k ? 'on' : ''}" data-f="${k}">${k === 'all' ? 'All' : KINDS[k]}</button>`).join('')}</div>
        <div class="tb-memlist">${shown.map(m => `<div class="tb-m ${openMem === m.id ? 'open' : ''}" data-m="${m.id}">
          <button class="tb-mh"><span class="tb-kind" style="--k:${KCOL[m.kind]}">${KINDS[m.kind]}</span><b>${CI.esc(m.title)}</b>${CI.icon('chevD', 14)}</button>
          ${openMem === m.id ? `<div class="tb-me"><div style="display:flex;gap:8px"><input data-e="title" value="${CI.esc(m.title)}"><select data-e="kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}" ${k === m.kind ? 'selected' : ''}>${v}</option>`).join('')}</select></div><textarea data-e="body" rows="6">${CI.esc(m.body)}</textarea><button class="tb-del" data-rm>Remove</button></div>`
          : `<div class="tb-mp">${CI.esc(m.body)}</div>`}</div>`).join('')}</div>
        <button class="tb-del" id="mreset" style="margin-top:12px">Reset to default memory</button>`;
    }
    $m.addEventListener('click', e => {
      const f = e.target.closest('[data-f]'); if (f) { filter = f.dataset.f; renderMem(); return; }
      if (e.target.closest('#madd')) { const m = { id: uid(), kind: filter === 'all' ? 'past-text' : filter, title: 'New memory', body: '' }; memory.unshift(m); openMem = m.id; save(MEM_KEY, memory); renderMem(); return; }
      if (e.target.closest('#mreset')) { memory = DEFAULT_MEMORY.map(m => Object.assign({}, m)); openMem = null; save(MEM_KEY, memory); renderMem(); CI.toast('Memory reset', 'check'); return; }
      const box = e.target.closest('[data-m]'); if (!box) return;
      if (e.target.closest('[data-rm]')) { memory = memory.filter(m => m.id !== box.dataset.m); save(MEM_KEY, memory); renderMem(); return; }
      if (e.target.closest('.tb-mh')) { openMem = openMem === box.dataset.m ? null : box.dataset.m; renderMem(); CI.sfx('tick'); }
    });
    $m.addEventListener('input', e => {
      const box = e.target.closest('[data-m]'); const k = e.target.dataset.e; if (!box || !k) return;
      const m = memory.find(x => x.id === box.dataset.m); m[k] = e.target.value; save(MEM_KEY, memory);
      if (k === 'kind') renderMem();
    });

    el.addEventListener('click', e => {
      const s = e.target.closest('[data-s]'); if (s) { const x = SAMPLES[+s.dataset.s]; add(x.from, x.text); return; }
      const t = e.target.closest('[data-t]'); if (t) { active = t.dataset.t; renderThreads(); renderConsole(); if (innerWidth < 1100) $c.scrollIntoView({ behavior: 'smooth' }); return; }
      if (e.target.closest('#compose-open')) {
        CI.$('#compose-wrap', el).innerHTML = `<form class="tb-compose" id="cform"><label><span class="label">From</span><input id="cfrom" placeholder="+61 4xx xxx xxx" inputmode="tel"></label><label><span class="label">Message</span><textarea id="ctext" rows="4" maxlength="2000" placeholder="Paste or write the text you received…"></textarea></label><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn" id="ccancel">Cancel</button><button class="btn primary">Draft reply ${CI.icon('arrowR', 14)}</button></div></form>`;
        CI.$('#cfrom', el).focus();
        CI.$('#ccancel', el).onclick = () => { CI.$('#compose-wrap', el).innerHTML = `<button class="btn primary" id="compose-open" style="width:100%;justify-content:center;margin-top:12px">+ Forward your own text</button>`; };
        CI.$('#cform', el).onsubmit = ev => { ev.preventDefault(); const tx = CI.$('#ctext', el).value.trim(); if (!tx) return; add(CI.$('#cfrom', el).value, tx); CI.$('#ccancel', el).click(); };
      }
    });

    // any thread left mid-draft from a previous visit gets redrafted
    threads.filter(t => t.status === 'drafting').forEach(t => run(t));
    renderThreads(); renderConsole(); renderMem();
    const qs = new URLSearchParams(location.search); const qt = qs.get('text') || qs.get('body');
    if (qt) { add(qs.get('from') || '', qt); history.replaceState(null, '', location.pathname + location.hash); }
    return { destroy() { alive = false; } };
  };
})();
