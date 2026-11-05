/* ==========================================================
   PLACEHOLDER DATA — every figure, name and document below is
   invented for the concept demo. Swap with real sources later.
   ========================================================== */
window.CI = window.CI || {};
(function () {
  const qs = new URLSearchParams(location.search);
  CI.user = { name: (qs.get('name') || '').trim() };

  // deterministic random
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  CI.rng = rng;

  /* ---------------- PROJECTS ---------------- */
  CI.projects = [
    { id: 'phillip', name: '8 Phillip St', suburb: 'Parramatta', type: 'Residential tower · QT Hotel', value: 640, levels: 65, built: 41, stage: 'Structure — Level 41', progress: 62, pc: 'Jun 2028', health: 'watch', rfis: 21, vars: 6, actions: 11, pm: 'Daniel Reyes', shape: 'spire', color: '#ff2e4d' },
    { id: 'erko', name: 'Erskineville', suburb: 'Erskineville', type: 'Build-to-rent precinct · 1,000+ homes', value: 980, levels: 14, built: 8, stage: 'Stage 2 — Structure', progress: 44, pc: 'Mar 2029', health: 'good', rfis: 17, vars: 3, actions: 8, pm: 'Priya Nair', shape: 'precinct', color: '#38e8ff' },
    { id: 'mason', name: 'Mason & Main', suburb: 'Merrylands', type: 'Mixed-use BTR · Eat Street', value: 410, levels: 20, built: 20, stage: 'Fitout & Commissioning', progress: 88, pc: 'Feb 2027', health: 'risk', rfis: 6, vars: 5, actions: 7, pm: 'Tom Whitfield', shape: 'twin', color: '#ffb547' },
    { id: 'ashbury', name: 'Ashbury Terraces', suburb: 'Ashbury', type: 'Terrace homes & apartments', value: 120, levels: 5, built: 5, stage: 'Façade & Landscaping', progress: 79, pc: 'Apr 2027', health: 'good', rfis: 3, vars: 1, actions: 3, pm: 'Lena Kovač', shape: 'terraces', color: '#3dffa8' },
    { id: 'p75', name: 'Precinct 75', suburb: 'St Peters', type: 'BTR · Retail · Creative hub', value: 310, levels: 8, built: 8, stage: 'Defects liability period', progress: 100, pc: 'Complete', health: 'good', rfis: 0, vars: 0, actions: 2, pm: 'Priya Nair', shape: 'block', color: '#a283ff' },
    { id: 'archer', name: 'Archer & Albert', suburb: 'Chatswood', type: 'Residential apartments', value: 186, levels: 24, built: 14, stage: 'Structure — Level 14', progress: 58, pc: 'Sep 2027', health: 'watch', rfis: 12, vars: 4, actions: 9, pm: 'Daniel Reyes', shape: 'tower', color: '#ff2e4d' },
    { id: 'danks', name: 'Danks St', suburb: 'Waterloo', type: 'Mixed-use BTR · Retail', value: 265, levels: 12, built: 3, stage: 'Structure — Level 3', progress: 27, pc: 'Nov 2028', health: 'good', rfis: 9, vars: 2, actions: 5, pm: 'Tom Whitfield', shape: 'stepped', color: '#5b8cff' },
    { id: 'stleonards', name: 'Nation St Leonards', suburb: 'St Leonards', type: 'High-rise build-to-rent', value: 450, levels: 38, built: 0, stage: 'Excavation & Basement', progress: 11, pc: 'Aug 2029', health: 'good', rfis: 5, vars: 1, actions: 4, pm: 'Daniel Reyes', shape: 'curve', color: '#ff5ad1' },
    { id: 'papermill', name: 'The Paper Mill', suburb: 'Liverpool', type: 'Riverfront mixed-use precinct', value: 500, levels: 18, built: 18, stage: 'Retail fitout', progress: 94, pc: 'Dec 2026', health: 'watch', rfis: 4, vars: 3, actions: 6, pm: 'Lena Kovač', shape: 'podium', color: '#ff7a45' },
    { id: 'moore', name: 'Moore Point', suburb: 'Moorebank', type: 'Masterplanned community', value: 0, levels: 30, built: 0, stage: 'Planning & DA', progress: 3, pc: 'TBC', health: 'good', rfis: 0, vars: 0, actions: 3, pm: 'Hamish O’Connell', shape: 'masterplan', color: '#9097a9' }
  ];
  CI.proj = id => CI.projects.find(p => p.id === id);

  /* ---------------- WATCHDOG ---------------- */
  CI.categories = ['Preliminaries', 'Concrete', 'Structural steel', 'Façade', 'Electrical', 'Mechanical', 'Hydraulic', 'Fire', 'Lifts', 'Finishes'];
  const weights = [.11, .19, .07, .13, .10, .08, .06, .04, .05, .17];

  const forecasts = {};
  CI.projects.filter(p => p.id !== 'moore').forEach((p, pi) => {
    const r = rng(pi * 97 + 13);
    forecasts[p.id] = CI.categories.map((c, ci) => {
      const prev = +(p.value * weights[ci] * (0.9 + r() * 0.2)).toFixed(2);
      let d = 0; const roll = r();
      if (p.progress < 100) {
        if (roll > 0.78) d = +Math.min(1.2, prev * (0.015 + r() * 0.04)).toFixed(2);
        else if (roll < 0.12) d = -Math.min(0.6, prev * (0.008 + r() * 0.015)).toFixed(2);
      }
      const status = d === 0 ? 'none' : 'explained';
      return { cat: c, prev, curr: +(prev + d).toFixed(2), status, note: '' };
    });
  });
  // Archer & Albert — hand tuned to match the pitch slides
  const A = { Preliminaries: [5.2, 5.5, 'unexplained', 'Tower crane hire extended ~6 weeks. No variation or cost report note on file.'], Concrete: [8.4, 8.4, 'none'], 'Structural steel': [1.6, 1.6, 'none'], 'Façade': [6.1, 6.1, 'none'], Electrical: [4.2, 4.5, 'partial', '$270K linked to VAR-112 & VAR-115. $30K has no explanation on file.'], Mechanical: [3.1, 3.3, 'explained', 'VAR-108 chiller upgrade, approved 14 Oct.'], Hydraulic: [2.4, 2.35, 'explained', 'Value management saving VM-07, pump rationalisation.'], Fire: [1.2, 1.2, 'none'], Lifts: [1.9, 1.9, 'none'], Finishes: [7.3, 7.3, 'none'] };
  forecasts.archer = CI.categories.map(c => ({ cat: c, prev: A[c][0], curr: A[c][1], status: A[c][2], note: A[c][3] || '' }));
  // 8 Phillip — a second clear story
  const ph = forecasts.phillip;
  ph[3] = { cat: 'Façade', prev: 84.2, curr: 85.4, status: 'partial', note: '$0.9M linked to unitised curtain wall escalation (VAR-221). $0.3M not yet explained.' };
  ph[8] = { cat: 'Lifts', prev: 31.5, curr: 31.9, status: 'unexplained', note: 'Lift subcontractor claim includes $0.4M “programme acceleration” with no instruction on file.' };
  ph[0].status = ph[0].curr > ph[0].prev ? 'explained' : ph[0].status;
  forecasts.mason.forEach(r => { if (r.status === 'unexplained') r.status = 'explained'; });
  CI.forecasts = forecasts;
  const all = Object.values(forecasts).flat();
  CI.portfolioMove = +all.reduce((a, r) => a + r.curr - r.prev, 0).toFixed(1);
  CI.unexplainedMove = +all.filter(r => r.status === 'unexplained' && r.curr > r.prev).reduce((a, r) => a + r.curr - r.prev, 0).toFixed(1);

  CI.prelimLines = [
    ['01-010', 'Site Labour & Supervision', 0], ['01-015', 'Programme Services', 0], ['01-017', 'Traffic Controller', 0], ['01-018', 'Hoist Driver', 0],
    ['01-019', 'Forklift Driver', 0], ['01-020', 'Quality Consultant', 0], ['01-040', 'Surveyor', 0], ['01-050', 'Insurances, Legal & Fees', 0],
    ['01-060', 'Authorities & Fees', 0], ['01-070', 'Site Accommodation & Leases', 0], ['01-080', 'Site Safety, PPE & First Aid', 0], ['01-090', 'Security', 24],
    ['01-100', 'Hoarding / Gantries / Temp Fencing', 0], ['01-110', 'Temp Services (incl. IT & Cert)', 30], ['01-140', 'Access / Temp Road', 0], ['01-160', 'Tower Crane', 142],
    ['01-161', 'Tower Crane — Labour', 58], ['01-163', 'Mobile Cranes', 0], ['01-170', 'Hoists', 46], ['01-180', 'Scaffold & Screens', 0],
    ['01-190', 'Plant & Equipment', 0], ['01-191', 'Manitou / Forklift', 0], ['01-195', 'Loading Platforms', 0], ['01-200', 'Waste Bins / Rubbish Removal', 0],
    ['01-210', 'Cleaning (incl. Completion)', 0], ['01-220', 'Small Tools / Sundry', 0], ['01-230', 'Office Supplies (Stat & Print)', 0], ['01-270', 'Saw Cutting & Core Holing', 0],
    ['01-300', 'Site Investigations', 0], ['01-400', 'DLP Commissioning', 0]
  ];

  /* ---------------- ACTIONS ---------------- */
  CI.actions = [
    { id: 1, text: 'Resolve façade panel junction detail at L4', owner: 'Design manager', who: 'Lena Kovač', project: 'archer', due: '3 Nov', status: 'overdue', src: 'meeting', srcName: 'Site Meeting #42', raised: 4 },
    { id: 2, text: 'Respond to RFI-208 — column setout grid C/4', owner: 'Structural consultant', who: 'Meridian Structures', project: 'archer', due: '5 Nov', status: 'overdue', src: 'email', srcName: 'Email · RE: RFI-208', raised: 3 },
    { id: 3, text: 'Issue November hoist booking schedule', owner: 'Site manager', who: 'Tom Whitfield', project: 'danks', due: '4 Nov', status: 'overdue', src: 'meeting', srcName: 'Site Meeting #17', raised: 3 },
    { id: 4, text: 'Confirm structural revision to L15 transfer slab', owner: 'Structural consultant', who: 'Meridian Structures', project: 'archer', due: '10 Nov', status: 'open', src: 'meeting', srcName: 'Site Meeting #42', raised: 1 },
    { id: 5, text: 'Submit revised lobby lighting quote (VAR-115)', owner: 'Electrical subcontractor', who: 'Voltline Electrical', project: 'archer', due: '12 Nov', status: 'open', src: 'meeting', srcName: 'Site Meeting #42', raised: 1 },
    { id: 6, text: 'Issue Rev 14 programme reflecting crane extension', owner: 'Planner', who: 'Ben Hartley', project: 'archer', due: '8 Nov', status: 'open', src: 'meeting', srcName: 'Site Meeting #42', raised: 1 },
    { id: 7, text: 'Clarify $0.4M lift “acceleration” claim', owner: 'Commercial manager', who: 'James Liu', project: 'phillip', due: '11 Nov', status: 'open', src: 'email', srcName: 'Email · Lift claim #9', raised: 2 },
    { id: 8, text: 'Lodge s4.55 modification — basement changes', owner: 'Development manager', who: 'Hamish O’Connell', project: 'moore', due: '20 Nov', status: 'open', src: 'meeting', srcName: 'PCG Meeting — Moore Point', raised: 1 },
    { id: 9, text: 'Confirm lift commissioning dates', owner: 'Lift subcontractor', who: 'Apex Lifts', project: 'mason', due: '11 Nov', status: 'open', src: 'email', srcName: 'Email · Lift commissioning', raised: 2 },
    { id: 10, text: 'Defects walk — Levels 12 to 16', owner: 'Site manager', who: 'Tom Whitfield', project: 'mason', due: '7 Nov', status: 'open', src: 'meeting', srcName: 'Site Meeting #61', raised: 1 },
    { id: 11, text: 'Traffic management plan for crane delivery', owner: 'Site manager', who: 'Kiri Walker', project: 'stleonards', due: '13 Nov', status: 'open', src: 'email', srcName: 'Email · Crane delivery', raised: 1 },
    { id: 12, text: 'Assess payment claim #18', owner: 'Contract administrator', who: 'Olivia Grant', project: 'erko', due: '9 Nov', status: 'open', src: 'email', srcName: 'Email · Progress claim 18', raised: 1 },
    { id: 13, text: 'Approve façade sample board', owner: 'Client representative', who: 'Nation (client)', project: 'danks', due: '28 Oct', status: 'done', src: 'email', srcName: 'Email · Sample approval', raised: 1 },
    { id: 14, text: 'Close out backcharge BC-031 (scaffold damage)', owner: 'Contract administrator', who: 'Olivia Grant', project: 'papermill', due: '31 Oct', status: 'done', src: 'email', srcName: 'Email · BC-031', raised: 2 },
    { id: 15, text: 'Retail tenancy handover checklist — Eat Street', owner: 'Project manager', who: 'Tom Whitfield', project: 'mason', due: '14 Nov', status: 'open', src: 'meeting', srcName: 'PCG Meeting — Mason & Main', raised: 1 }
  ];

  CI.sources = [
    { id: 'm42', kind: 'meeting', title: 'Site Meeting #42', proj: 'archer', date: '30 Oct 2026', from: 'Minutes · Archer & Albert',
      body: [
        ['h', 'ARCHER & ALBERT — SITE MEETING #42'],
        ['m', 'Thursday 30 October 2026 · Site office · Chair: D. Reyes'],
        ['p', '<b>4.1 Structure.</b> Level 14 pour completed 28/10. <span class="hl" data-a="Confirm revision to L15 transfer slab reinforcement|Structural consultant|10 Nov">Meridian Structures to confirm revision to L15 transfer slab reinforcement by 10/11.</span>'],
        ['p', '<b>4.2 Façade.</b> Panel junction detail at L4 still unresolved. <span class="hl" data-a="Issue revised façade junction detail L4|Design manager|Overdue · raised 4×">Design Manager to issue revised detail — item carried from Meetings #39, #40 and #41.</span>'],
        ['p', '<b>5.1 Services.</b> <span class="hl" data-a="Submit revised lobby lighting quote (VAR-115)|Electrical subcontractor|12 Nov">Electrical subcontractor to submit revised quote for lobby lighting upgrade (VAR-115) by 12/11.</span> Sub-mains variation VAR-112 approved.'],
        ['p', '<b>6.1 Programme.</b> Crane hire extended to suit revised structure cycle. <span class="hl" data-a="Issue Rev 14 programme with crane extension|Planner|8 Nov">Planner to issue Rev 14 programme reflecting the extension by 8/11.</span>'],
        ['p', '<b>7.0 General.</b> Site amenities relocation complete. No further action.']
      ] },
    { id: 'e208', kind: 'email', title: 'RE: RFI-208 Column setout', proj: 'archer', date: '3 Nov 2026', from: 'Email · Site engineer → Meridian',
      body: [
        ['h', 'RE: RFI-208 — Column setout grid C/4'],
        ['m', 'From: Site Engineer · To: Meridian Structures · Mon 3 Nov 2026 4:12pm'],
        ['p', 'Hi team,'],
        ['p', 'Following up on RFI-208 issued 22 October. <span class="hl" data-a="Respond to RFI-208 (column setout C/4)|Structural consultant|5 Nov">We need your response by Wednesday 5 November</span> to avoid holding the L15 pour.'],
        ['p', '<span class="hl" data-a="Issue revised L15 slab drawing with RFI response|Structural consultant|5 Nov">Can you also confirm the revised slab drawing will be issued with it?</span> The formwork crew is booked for the 7th.'],
        ['p', 'Separately, <span class="hl" data-a="Book core-hole inspection for L14|Site manager|7 Nov">please book a core-hole inspection for L14 before Friday.</span>'],
        ['p', 'Thanks,<br>Site Engineering']
      ] },
    { id: 'pcg', kind: 'meeting', title: 'PCG — Moore Point', proj: 'moore', date: '29 Oct 2026', from: 'Minutes · Project Control Group',
      body: [
        ['h', 'MOORE POINT — PROJECT CONTROL GROUP'],
        ['m', 'Wednesday 29 October 2026 · Head office · Chair: S. Tan'],
        ['p', '<b>2.0 Planning.</b> Council feedback received on basement levels. <span class="hl" data-a="Lodge s4.55 modification for basement changes|Development manager|20 Nov">Development Manager to lodge s4.55 modification by 20/11.</span>'],
        ['p', '<b>3.0 Design.</b> <span class="hl" data-a="Circulate stage 1 masterplan options|Planning manager|14 Nov">Planning Manager to circulate stage 1 masterplan options before next PCG.</span>'],
        ['p', '<b>4.0 Commercial.</b> <span class="hl" data-a="Update feasibility with revised yield|Commercial manager|21 Nov">Commercial to update feasibility with revised yield and land rate.</span>'],
        ['p', '<b>5.0 Next meeting.</b> 26 November 2026.']
      ] }
  ];

  CI.recurring = [
    { text: 'Façade panel junction at L4', proj: 'archer', count: 4, of: 5, since: 'since 2 Oct' },
    { text: 'Hoist booking conflicts', proj: 'danks', count: 3, of: 5, since: 'since 9 Oct' },
    { text: 'RFI-208 response outstanding', proj: 'archer', count: 3, of: 5, since: '3 emails, 2 meetings' },
    { text: 'Lift commissioning dates unconfirmed', proj: 'mason', count: 2, of: 5, since: 'since 21 Oct' }
  ];

  /* ---------------- PEOPLE ---------------- */
  const P = (id, name, role, dept, opts = {}) => Object.assign({ id, name, role, dept }, opts);
  CI.depts = [
    { id: 'con', name: 'Construction', color: '#ff2e4d' },
    { id: 'dev', name: 'Development', color: '#38e8ff' },
    { id: 'com', name: 'Commercial & Finance', color: '#ffb547' },
    { id: 'pc', name: 'People & Culture', color: '#a283ff' },
    { id: 'whs', name: 'Safety (WHS)', color: '#3dffa8' }
  ];
  CI.people = [
    P('ceo', 'You', 'Chief Executive Officer', 'exec', { start: 2009, base: 0, loc: 'Head Office' }),
    P('mb', 'Marcus Bellamy', 'Director of Construction', 'con', { lead: true, start: 2014, base: 395000, loc: 'Head Office' }),
    P('dr', 'Daniel Reyes', 'Senior Project Manager', 'con', { start: 2017, base: 238000, loc: 'Archer & Albert · 8 Phillip St', review: true }),
    P('tw', 'Tom Whitfield', 'Project Manager', 'con', { start: 2019, base: 192000, loc: 'Mason & Main · Danks St' }),
    P('lk', 'Lena Kovač', 'Design Manager', 'con', { start: 2020, base: 176000, loc: 'Archer & Albert', review: true }),
    P('pn', 'Priya Nair', 'Project Director', 'con', { start: 2016, base: 262000, loc: 'Erskineville' }),
    P('st', 'Sophie Tan', 'Head of Development', 'dev', { lead: true, start: 2015, base: 345000, loc: 'Head Office' }),
    P('ho', 'Hamish O’Connell', 'Development Manager', 'dev', { start: 2018, base: 205000, loc: 'Moore Point' }),
    P('ar', 'Aisha Rahman', 'Planning Manager', 'dev', { start: 2021, base: 168000, loc: 'Head Office', review: true }),
    P('cw', 'Callum West', 'Acquisitions Analyst', 'dev', { start: 2023, base: 118000, loc: 'Head Office' }),
    P('rd', 'Rachel Dimitriou', 'Chief Financial Officer', 'com', { lead: true, start: 2013, base: 410000, loc: 'Head Office' }),
    P('jl', 'James Liu', 'Commercial Manager', 'com', { start: 2018, base: 214000, loc: 'Head Office · 8 Phillip St' }),
    P('og', 'Olivia Grant', 'Contract Administrator', 'com', { start: 2022, base: 132000, loc: 'Erskineville', review: true }),
    P('bh', 'Ben Hartley', 'Cost Planner & Scheduler', 'com', { start: 2020, base: 151000, loc: 'Head Office' }),
    P('nm', 'Natalie Moretti', 'Head of People & Culture', 'pc', { lead: true, start: 2016, base: 298000, loc: 'Head Office' }),
    P('ca', 'Chris Ahn', 'HR Business Partner', 'pc', { start: 2021, base: 142000, loc: 'Head Office' }),
    P('ms', 'Mia Santos', 'Payroll & Benefits Lead', 'pc', { start: 2019, base: 128000, loc: 'Head Office' }),
    P('gf', 'Grant Fraser', 'Head of WHS', 'whs', { lead: true, start: 2012, base: 265000, loc: 'All sites' }),
    P('kw', 'Kiri Walker', 'WHS Manager', 'whs', { start: 2018, base: 168000, loc: 'Nation St Leonards', review: true }),
    P('sp', 'Sam Patel', 'Safety Advisor', 'whs', { start: 2023, base: 112000, loc: 'The Paper Mill' })
  ];
  CI.person = id => CI.people.find(p => p.id === id);
  CI.comp = function (p) {
    const r = rng(p.name.length * 31 + p.base);
    const yrs = []; let b = Math.round(p.base / Math.pow(1.045, 4) / 1000) * 1000;
    for (let y = 2022; y <= 2026; y++) {
      if (y < p.start) continue;
      const inc = y === 2022 ? 0 : 2.5 + Math.round(r() * 45) / 10;
      if (y > 2022) b = Math.round(b * (1 + inc / 100) / 500) * 500;
      if (y === 2026) b = p.base;
      const bonus = Math.round(b * (0.04 + r() * 0.08) / 500) * 500;
      yrs.push({ y, base: b, inc, bonus });
    }
    return yrs;
  };
  const ratings = ['Exceeds', 'Strong', 'Strong', 'Exceeds', 'Meets'];
  CI.reviews = function (p) {
    const r = rng(p.base + 7);
    const out = [];
    for (let fy = 26; fy >= 23; fy--) {
      if (2000 + fy - 1 < p.start) continue;
      const rt = ratings[Math.floor(r() * ratings.length)];
      out.push({ fy: 'FY' + fy, date: (fy === 26 ? 'Aug 2026' : 'Aug 20' + fy), rating: rt, score: rt === 'Exceeds' ? 5 : rt === 'Strong' ? 4 : 3,
        summary: [
          'Delivered milestones on time. Strong subcontractor relationships. Development area: delegating more to site teams.',
          'Good commercial awareness and clear reporting. Agreed goal: lead the next PCG cycle and mentor a junior.',
          'Consistently reliable. Safety record exemplary. Next step: complete leadership program in FY27.',
          'High output under a heavy load. Recommend support on documentation backlog.'][Math.floor(r() * 4)] });
    }
    return out;
  };

  /* ---------------- DOCUMENTS ---------------- */
  const AA = 'Y: › Projects › 2. Current Projects › ARCHER & ALBERT';
  CI.docs = {
    ffc: { title: 'FFC - October.xlsx', kind: 'xls', label: 'Cost Report', path: AA + ' › 06. Project Management › 01. Contract Admin › 10. FFC › 1. October 2026', modified: '8 Oct 2026, 1:43 PM', author: 'Commercial', size: '274 KB',
      summary: 'October forecast final cost. Total FFC up <b>$800K</b> on September across Preliminaries, Electrical and Mechanical. Electrical movement references VAR-112 and VAR-115; Preliminaries movement has <b>no commentary</b>.',
      body: `<h4>Archer Street — Chatswood | FFC Summary (October 2026)</h4><div class="pm">PLACEHOLDER FIGURES · $M</div>
      <table><tr><th>Trade</th><th class="r">Sep</th><th class="r">Oct</th><th class="r">Δ</th><th>Comment</th></tr>
      <tr><td>Preliminaries</td><td class="r">5.20</td><td class="r">5.50</td><td class="r"><mark>+0.30</mark></td><td><mark>—</mark></td></tr>
      <tr><td>Concrete</td><td class="r">8.40</td><td class="r">8.40</td><td class="r">0.00</td><td></td></tr>
      <tr><td>Electrical</td><td class="r">4.20</td><td class="r">4.50</td><td class="r">+0.30</td><td>VAR-112, VAR-115</td></tr>
      <tr><td>Mechanical</td><td class="r">3.10</td><td class="r">3.30</td><td class="r">+0.20</td><td>VAR-108</td></tr>
      <tr><td>Hydraulic</td><td class="r">2.40</td><td class="r">2.35</td><td class="r">−0.05</td><td>VM-07</td></tr></table>` },
    varreg: { title: 'Variation Register.xlsx', kind: 'xls', label: 'Variation Register', path: AA + ' › 06. Project Management › 01. Contract Admin › 04. Procurement', modified: '28 Oct 2026, 9:02 AM', author: 'Contract Admin', size: '88 KB',
      summary: 'Lists 4 open and 11 approved variations. <b>VAR-112</b> (sub-mains, $210K) and <b>VAR-115</b> (lobby lighting, $60K) are the only electrical items this period.',
      body: `<h4>Variation Register — Archer & Albert</h4><div class="pm">PLACEHOLDER · UPDATED 28 OCT 2026</div>
      <table><tr><th>Ref</th><th>Description</th><th class="r">$K</th><th>Status</th></tr>
      <tr><td>VAR-108</td><td>Chiller upgrade</td><td class="r">200</td><td>Approved</td></tr>
      <tr><td><mark>VAR-112</mark></td><td><mark>Additional sub-mains L10–L24</mark></td><td class="r">210</td><td>Approved</td></tr>
      <tr><td><mark>VAR-115</mark></td><td><mark>Lobby lighting upgrade</mark></td><td class="r">60</td><td>Approved</td></tr>
      <tr><td>VAR-117</td><td>Façade upgrade — podium</td><td class="r">184</td><td>Awaiting CEO</td></tr></table>` },
    m42: { title: 'Site Meeting #42 — Minutes.pdf', kind: 'pdf', label: 'Meeting Minutes', path: AA + ' › 08. Meeting Minutes › 2026 › October', modified: '30 Oct 2026, 5:20 PM', author: 'D. Reyes', size: '412 KB',
      summary: '6 actions recorded. Façade junction at L4 carried for the <b>4th consecutive meeting</b>. Crane hire extension noted under Programme, but <b>no cost impact recorded</b>.',
      body: `<h4>Site Meeting #42 — Minutes</h4><div class="pm">30 OCT 2026 · PLACEHOLDER</div><p><b>4.2 Façade.</b> Panel junction detail at L4 still unresolved — carried from Meetings #39, #40, #41.</p><p><b>5.1 Services.</b> Sub-mains variation VAR-112 approved. Electrical to resubmit lobby lighting quote.</p><p><b>6.1 Programme.</b> <mark>Crane hire extended to suit revised structure cycle.</mark> Planner to issue Rev 14.</p>` },
    prog: { title: 'Programme Rev 13.pdf', kind: 'pdf', label: 'Programme', path: AA + ' › 06. Project Management › 02. Programme & Planning', modified: '2 Oct 2026, 11:15 AM', author: 'B. Hartley', size: '2.1 MB',
      summary: 'Structure completion moved from <b>12 Feb</b> to <b>26 Mar 2027</b> (+6 weeks), driven by L9–L11 slab cycle delays. Tower crane dismantle shifts with it.',
      body: `<h4>Construction Programme — Revision 13</h4><div class="pm">ISSUED 2 OCT 2026 · PLACEHOLDER</div><p>Key change: <mark>structure topping-out moved from 12 Feb 2027 to 26 Mar 2027</mark> following slab cycle delays at L9–L11.</p><p>Tower crane dismantle: now 9 Apr 2027.</p>` },
    rfi208: { title: 'RE: RFI-208 Column setout.msg', kind: 'mail', label: 'Email', path: 'Outlook › Projects › Archer & Albert', modified: '3 Nov 2026, 4:12 PM', author: 'Site Engineer', size: '38 KB',
      summary: 'Third follow-up on RFI-208. Response needed by <b>5 Nov</b> to avoid holding the L15 pour. No reply received yet.',
      body: `<h4>RE: RFI-208 — Column setout grid C/4</h4><div class="pm">3 NOV 2026 · PLACEHOLDER</div><p>Following up on RFI-208 issued 22 October. <mark>We need your response by Wednesday 5 November</mark> to avoid holding the L15 pour.</p>` },
    lift9: { title: 'Lift claim #9.pdf', kind: 'pdf', label: 'Payment Claim', path: 'Y: › Projects › 2. Current Projects › 8 PHILLIP ST › 06. Project Management › 01. Contract Admin › 06. Cost Report', modified: '31 Oct 2026, 2:40 PM', author: 'Apex Lifts', size: '640 KB',
      summary: 'Claim includes a <b>$0.4M “programme acceleration”</b> line. No matching site instruction or variation found.',
      body: `<h4>Progress Claim #9 — Lifts</h4><div class="pm">31 OCT 2026 · PLACEHOLDER</div><p>Item 14: <mark>Programme acceleration — additional crews, $412,000</mark>.</p><p>Reference: verbal instruction (no SI number).</p>` },
    hr: { title: 'Annual Review Schedule FY27.xlsx', kind: 'xls', label: 'HR Register', path: 'Y: › Corporate › People & Culture › Reviews', modified: '1 Nov 2026', author: 'People & Culture', size: '54 KB',
      summary: '5 reviews due in November. Salary review cycle closes <b>30 Nov</b>.', body: `<h4>Review Schedule FY27</h4><div class="pm">RESTRICTED · PLACEHOLDER</div><p>November: D. Reyes, L. Kovač, A. Rahman, O. Grant, K. Walker.</p>` }
  };

  /* ---------------- FILE TREE ---------------- */
  const F = (n, kids) => ({ n, kids: kids || [] });
  const f = (n, meta, doc) => ({ n, file: true, meta, doc });
  CI.fileTree = function (p) {
    const aa = p.id === 'archer';
    const minutes = [f('Site Meeting #40 — Minutes.pdf', '388 KB'), f('Site Meeting #41 — Minutes.pdf', '402 KB'), f('Site Meeting #42 — Minutes.pdf', '412 KB', 'm42')];
    return [
      F('00. Council & Authorities', [F('DA Consent'), F('CC'), F('Section 4.55 Mods')]),
      F('01. Client', [F('Correspondence'), F('Reports')]),
      F('02. Consultants', [F('Architect'), F('Structural'), F('Services'), F('Façade')]),
      F('03. Subcontractors', [F('Electrical'), F('Mechanical'), F('Hydraulic'), F('Formwork')]),
      F('04. Suppliers'),
      F('05. Drawings, Specs & Reports', [F('Architectural'), F('Structural'), F('Specifications')]),
      F('06. Project Management', [
        F('01. Contract Admin', [
          F('00. Templates'), F('02. Budget & BoQ'), F('03. Cash Flow'), F('04. Procurement', aa ? [f('Variation Register.xlsx', '88 KB', 'varreg')] : []), F('05. Cost Plan'),
          F('06. Cost Report'), F('07. Value Mgt'), F('08. Licences & Insurance'), F('09. Monthly Project Rev'),
          F('10. FFC', [F('1. October 2026', [f('FFC - October.pdf', '103 KB', aa ? 'ffc' : null), f('FFC - October.xlsx', '274 KB', aa ? 'ffc' : null), f('FFC (Utilities) - October.pdf', '60 KB')]), F('2. September 2026')]),
          F('11. Retail'), F('12. Tool Register'), F('13. Labour Hire Register'), F('14. Council Fees'), F('15. Internal Admin'),
          F('16. Prelim Forecast'), F('17. Backcharge Register'), F('18. Finishes Trade Register'), F('PCG Report'), F('SS')
        ]),
        F('02. Programme & Planning', [f('Programme Rev 13.pdf', '2.1 MB', aa ? 'prog' : null)]),
        F('03. Samples'), F('04. Project Finalisation')
      ]),
      F('07. Site Files'),
      F('08. Meeting Minutes', [F('2026', [F('October', minutes)])]),
      F('09. Photos'), F('10. Display Suite'), F('11. Quality Control'), F('12. Defects Management'), F('13. Post Completion'),
      F('14. Archive'), F('15. Working Folder'), F('16. WHSE'), F('17. Tracking Registers'), F('18. Heritage House')
    ];
  };

  /* ---------------- AGENTS ---------------- */
  CI.agents = [
    { id: 'brief', name: 'Briefing Agent', icon: 'sun', color: '#ffb547', desc: 'Writes your 6:00am brief', state: 'Next run 6:00am' },
    { id: 'ask', name: 'Research Agent', icon: 'chat', color: '#38e8ff', desc: 'Answers questions from files & email', state: 'Ready' },
    { id: 'watch', name: 'Watchdog Agent', icon: 'radar', color: '#ff2e4d', desc: 'Compares every cost report', state: 'Scanning FFCs' },
    { id: 'minutes', name: 'Minutes Reader', icon: 'check', color: '#a283ff', desc: 'Pulls actions from minutes', state: 'Reading #42' },
    { id: 'inbox', name: 'Inbox Agent', icon: 'mail', color: '#5b8cff', desc: 'Triages 3 mailboxes', state: '12 new threads' },
    { id: 'files', name: 'File Indexer', icon: 'folder', color: '#3dffa8', desc: 'Keeps Y: drive searchable', state: 'Indexing' },
    { id: 'people', name: 'People Agent', icon: 'users', color: '#ff5ad1', desc: 'Tracks reviews, licences, pay', state: 'Synced' },
    { id: 'comms', name: 'Comms Bot', icon: 'phone', color: '#ff7a45', desc: 'Text it like a colleague', state: 'Online' },
    { id: 'safety', name: 'Safety Sentinel', icon: 'shield', color: '#3dffa8', desc: 'Watches incident reports', state: '0 incidents today' }
  ];
  CI.agent = id => CI.agents.find(a => a.id === id);

  CI.feed = [
    ['watch', 'Flagged <b>+$300K Preliminaries</b> at Archer & Albert — no explanation on file'],
    ['minutes', 'Extracted <b>6 actions</b> from Site Meeting #42'],
    ['inbox', 'Meridian Structures replied on <b>RFI-211</b> — marked resolved'],
    ['files', 'Indexed <b>142 new files</b> in 8 Phillip St / 05. Drawings'],
    ['watch', 'Lift claim #9 at 8 Phillip St contains <b>$0.4M</b> with no instruction'],
    ['people', '<b>Kiri Walker</b> — white card renewal due in 21 days'],
    ['brief', 'Drafted tomorrow’s brief — <b>4 items</b> need your attention'],
    ['safety', 'Toolbox talk logged at <b>Nation St Leonards</b> · 38 attendees'],
    ['inbox', 'Client approved façade sample board at <b>Danks St</b>'],
    ['comms', 'Sent site notice to <b>12 site managers</b> · 9 read'],
    ['minutes', '“Façade junction L4” raised for the <b>4th time</b> — escalated'],
    ['files', 'FFC October uploaded for <b>Mason & Main</b> — handed to Watchdog'],
    ['watch', 'Mason & Main October report compared — <b>2 movements</b>, both explained'],
    ['people', 'FY27 review cycle opens <b>1 Dec</b> — 14 reviews scheduled'],
    ['ask', 'Answered “<b>What’s our prelim position at Erskineville?</b>” for Priya Nair']
  ];
})();
