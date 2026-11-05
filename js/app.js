/* ==========================================================
   APP — shell, router, transitions
   ========================================================== */
(function () {
  const { $, $$ } = CI;
  const NAV = [
    ['core', '00', 'Core', 'core'],
    ['briefing', '01', 'Briefing', 'sun', '6'],
    ['ask', '02', 'Ask', 'chat'],
    ['watchdog', '03', 'Watchdog', 'radar', '4'],
    ['actions', '04', 'Actions', 'check', '3'],
    ['projects', '05', 'Projects', 'building'],
    ['people', '06', 'People', 'users'],
    ['comms', '07', 'Comms', 'phone'],
    ['textbot', '08', 'Textbot', 'sms']
  ];
  $('#nav').innerHTML = `<div class="nav-label">Modules</div>` + NAV.map(([id, n, t, ic, b]) => `<a href="#/${id}" data-r="${id}"><span class="n">${n}</span>${CI.icon(ic, 18)}<span class="t">${t}</span>${b ? `<span class="b">${b}</span>` : ''}</a>`).join('');
  $('.ask-bar .ic-wrap').outerHTML = CI.icon('sparkle', 16);

  // clock + live counters
  const tick = () => { $('#clock').textContent = CI.sydTime(); };
  tick(); setInterval(tick, 5000);
  let idx = 48213; setInterval(() => { idx += Math.floor(Math.random() * 3); $('#idx-count').textContent = idx.toLocaleString(); $('#lat').textContent = (18 + Math.floor(Math.random() * 14)) + 'ms'; }, 1800);

  // sound toggle
  const sb = $('#sfx-btn'); const paint = () => { sb.innerHTML = CI.icon(CI.sfxOn ? 'volume' : 'mute', 16); sb.classList.toggle('on', CI.sfxOn); };
  paint(); sb.onclick = () => { CI.sfxOn = !CI.sfxOn; paint(); CI.sfx('ok'); };

  // global ask bar
  $('#ask-bar').onsubmit = e => {
    e.preventDefault(); const v = $('#ask-input').value.trim(); if (!v) return; $('#ask-input').value = ''; $('#ask-input').blur();
    if (CI.askHere) CI.askHere(v); else { CI.pendingQuery = v; location.hash = '#/ask'; }
  };
  addEventListener('keydown', e => {
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#ask-input').focus(); }
  });

  // router
  const view = $('#view'); let current = null, first = true;
  function render() {
    const [name, arg] = location.hash.replace(/^#\/?/, '').split('/');
    const key = CI.views[name] ? name : 'core';
    $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.r === key));
    const label = (NAV.find(n => n[0] === key) || NAV[0])[2].toUpperCase();
    $('#crumb').innerHTML = `VIPER / <b>${label}</b>${arg && CI.proj(arg) ? ' / <b>' + CI.proj(arg).name.toUpperCase() + '</b>' : ''}`;
    CI.drawer.close();
    const swap = () => {
      if (current && current.destroy) current.destroy();
      view.innerHTML = ''; view.scrollTop = 0; view.classList.remove('leaving', 'entering');
      current = CI.views[key](view, arg) || null;
      void view.offsetWidth; view.classList.add('entering'); CI.enhance(view);
      setTimeout(() => view.classList.remove('entering'), 900);
    };
    if (first) { first = false; swap(); return; }
    const beam = $('#beam'); beam.style.setProperty('--from', (innerWidth < 860 ? 0 : 236) + 'px'); beam.classList.remove('go'); void beam.offsetWidth; beam.classList.add('go');
    CI.sfx('open'); view.classList.add('leaving'); setTimeout(swap, 200);
  }
  addEventListener('hashchange', render);

  const start = () => { $('#app').classList.add('on'); render(); };
  const qs = new URLSearchParams(location.search);
  if (qs.has('text') && !location.hash) location.hash = '#/textbot';
  if (qs.has('skip')) { $('#boot').remove(); start(); }
  else CI.boot(() => setTimeout(start, 250));
})();
