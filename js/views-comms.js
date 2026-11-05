/* ==========================================================
   07 · COMMS — text the company AI like a colleague
   ========================================================== */
CI.views.comms = function (el) {
  const convo = [
    { k: ['happening', 'chatswood', 'today', 'site'], q: 'What’s happening at Chatswood today?', a: ['Archer & Albert today:', '• L15 formwork going in · 64 workers signed in\n• Concrete pour booked Fri 7:00am\n• ⚠️ RFI-208 is still unanswered. It could hold the pour.'], extra: 'Want me to chase Meridian?' },
    { k: ['remind', 'lena', 'chase', 'nudge'], q: 'Remind Lena about the façade detail', a: ['Done ✓ I texted Lena Kovač:', '“Hi Lena, quick nudge on the L4 façade junction detail. It’s now 3 days overdue and on Tuesday’s PCG agenda. Can you send it through today?”'], receipt: 'Delivered · Read 9:14am' },
    { k: ['safety', 'notice', 'broadcast', 'all site'], q: 'Send a heat safety notice to all site managers', card: true },
    { k: ['who', 'erskineville', 'on site', 'workers'], q: 'Who’s on site at Erskineville?', a: ['142 workers signed in across 11 trades:', '• Formwork 38 · Steelfixers 24\n• Concrete 19 · Electrical 16\n• Others 45\nSite manager on duty: Priya Nair.'] },
    { k: ['spent', 'prelim', 'phillip', 'cost'], q: 'How are prelims tracking at 8 Phillip St?', a: ['Prelims at 8 Phillip St are forecast at $70.4M. That’s flat on last month and 1.2% under budget. 👍', 'The one to watch there is Lifts: +$0.4M with no instruction on file.'] }
  ];
  el.innerHTML = `
  <div class="vh">
    <div><div class="kicker">07 · COMMS</div><h1 data-scramble>Text it like a colleague</h1>
    <p class="sub">No app to learn. Text, WhatsApp or Teams the company AI from anywhere. It answers from your live data, chases people for you, and sends notices to whole teams.</p></div>
    <div class="agent-strip" id="as"></div>
  </div>
  <div class="comms-grid">
    <div class="card">
      <div class="card-h"><span class="label">Try texting</span></div>
      <div class="prompt-list">${convo.map((c, i) => `<button data-i="${i}" style="--i:${i}">${CI.icon('sms', 16)}<span>${c.q}</span></button>`).join('')}</div>
      <div class="ai-box" style="margin-top:18px"><div class="label">${CI.icon('zap', 14)} HOW IT WORKS</div><div style="font-size:13.5px;line-height:1.65;color:var(--mute)">Your message goes to the <b style="color:var(--text)">Comms Bot</b>. It hands the question to the right agent (Watchdog, Minutes Reader, People), then replies in plain English. Anything it sends on your behalf is logged.</div></div>
    </div>
    <div class="phone chat-phone"><div class="phone-notch"></div><div class="phone-screen">
      <div class="cp-head"><span class="ap">${CI.icon('crown', 20)}</span><b>Viper AI</b><small><span class="dot" style="width:6px;height:6px"></span>online</small></div>
      <div class="cp-body" id="cb"></div>
      <form class="cp-input" id="cf"><input id="cin" placeholder="Text message" autocomplete="off"><button type="submit">${CI.icon('send', 14)}</button></form>
    </div></div>
    <div class="c-right grid" style="align-content:start">
      <div class="card"><div class="card-h"><span class="label">Channels</span></div>
        ${[['sms', 'SMS', '+61 4•• ••• 214', 1], ['whatsapp', 'WhatsApp', 'Viper AI', 1], ['teams', 'Microsoft Teams', '@viper-ai', 1], ['mail', 'Email', 'ai@viper (demo)', 0]].map(([ic, n, s, on]) => `<div class="channel"><span class="cav">${CI.icon(ic, 17)}</span><span><div style="font-weight:600;font-size:14px">${n}</div><div class="mono dim" style="font-size:10.5px">${s}</div></span><button class="switch ${on ? 'on' : ''}"></button></div>`).join('')}
      </div>
      <div class="card"><div class="card-h"><span class="label">Recent broadcasts</span></div>
        ${[['Wet weather: Erskineville pour moved to Thu', 'Site managers · 12', 92], ['Toolbox talk: working at heights', 'All site staff · 186', 74], ['PCG pack: Archer & Albert', 'Project team · 9', 100]].map(([t, s, r]) => `<div class="bc"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-weight:600;font-size:13.5px">${t}</b><span class="mono dim" style="font-size:10.5px">${r}% READ</span></div><div class="mono dim" style="font-size:10.5px;margin-top:2px">${s.toUpperCase()}</div><div class="rb"><i data-w="${r}"></i></div></div>`).join('')}
      </div>
    </div>
  </div>`;
  CI.agentStrip(['comms', 'people'], CI.$('#as', el));
  setTimeout(() => CI.$$('.bc .rb i', el).forEach(i => i.style.width = i.dataset.w + '%'), 400);
  el.addEventListener('click', e => { const s = e.target.closest('.switch'); if (s) { s.classList.toggle('on'); CI.sfx('tick'); } });
  const cb = CI.$('#cb', el); let busy = false, alive = true;
  const add = (html, cls) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; cb.appendChild(d); cb.scrollTop = cb.scrollHeight; return d; };
  const fmt = s => CI.esc(s).replace(/\n/g, '<br>');
  async function aiSay(lines) { for (const l of lines) { if (!alive) return; const t = add('<i></i><i></i><i></i>', 'typing'); await CI.sleep(700 + l.length * 8); t.remove(); add(fmt(l), 'bb ai'); CI.sfx('tick'); await CI.sleep(250); } }
  async function send(q, c) {
    if (busy) return; busy = true;
    add(fmt(q), 'bb me'); add('Delivered', 'receipt'); CI.sfx('type');
    await CI.sleep(500);
    if (!c) { const s = q.toLowerCase(); let best = null, sc = 0; convo.forEach(x => { const n = x.k.filter(k => s.includes(k)).length; if (n > sc) { sc = n; best = x; } }); c = best; }
    if (!c) await aiSay(['On it. In the full build I’d answer that from your live project data. For this preview, try one of the suggested texts on the left.']);
    else if (c.card) {
      const t = add('<i></i><i></i><i></i>', 'typing'); await CI.sleep(1100); t.remove();
      const card = add(`<b>Draft notice · 12 site managers</b><div style="margin-top:6px;color:rgba(255,255,255,.8)">⚠️ Heat warning: 36°C forecast Thursday. Start early, extra water breaks every 45 min, and no work on exposed decks after 1pm. Reply OK to confirm.</div><div class="cb-act"><button data-send>Send to 12</button><button class="alt" data-edit>Edit</button></div>`, 'bb card-b');
      card.querySelector('[data-send]').onclick = async () => { card.querySelector('.cb-act').innerHTML = '<small>Sent ✓</small>'; await aiSay(['Sent to 12 site managers.']); const r = add('Read by 0 of 12', 'receipt'); for (let i = 1; i <= 9; i++) { await CI.sleep(380); if (!alive) return; r.textContent = `Read by ${i} of 12`; } add('3 replied OK ✓', 'receipt'); };
      card.querySelector('[data-edit]').onclick = () => CI.toast('Editing opens here — demo', 'sms');
    } else {
      await aiSay(c.a);
      if (c.receipt) add(c.receipt, 'receipt');
      if (c.extra) await aiSay([c.extra]);
    }
    busy = false;
  }
  CI.$('.prompt-list', el).onclick = e => { const b = e.target.closest('[data-i]'); if (b) send(convo[+b.dataset.i].q, convo[+b.dataset.i]); };
  CI.$('#cf', el).onsubmit = e => { e.preventDefault(); const v = CI.$('#cin', el).value.trim(); if (!v) return; CI.$('#cin', el).value = ''; send(v); };
  setTimeout(() => aiSay(['Hi 👋 I’m Viper AI.', 'Text me anything about your projects, people or inbox.']), 600);
  return { destroy() { alive = false; } };
};
