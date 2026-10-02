/* vvEntra — Co-Investment / Investor Syndication (frontend prototype, mock data only) */
(function () {
  if (window.__vveCoinvest) return;
  window.__vveCoinvest = true;

  const KEY = 'vve-coinvest-v1';
  const OPP = { code: 'VVE-2436', title: 'AI Workflow Agent for Vertical Operations', desc: 'An AI agent platform that automates enterprise workflows across sales, operations and customer support for industry verticals.', tags: ['AI', 'B2B SaaS', 'India'], target: 100000 };
  const STAGES = ['Discover', 'Create / Join', 'Discuss', 'Due diligence', 'Agree allocation', 'Individual commitment', 'Sign agreement'];
  const fresh = () => ({
    stage: 3, joined: false, isPrivate: true, tab: 'All', activeStep: 3,
    investors: [
      { id: 1, name: 'Ananya Sharma', role: 'Angel Investor · Lead', firm: 'AS Partners · Bengaluru', amt: 40000, status: 'Confirmed', joined: '12 Sep 2026', lead: true },
      { id: 2, name: 'Rahul Mehta', role: 'Co-Investor A', firm: 'Angel network · Mumbai', amt: 30000, status: 'Confirmed', joined: '14 Sep 2026' },
      { id: 3, name: 'Sneha Kapoor', role: 'Co-Investor B', firm: 'Operator investor · SaaS', amt: 0, status: 'Invited', joined: '18 Sep 2026' },
    ],
    messages: [
      { who: 'Ananya Sharma', tag: 'Lead investor', cat: 'Due diligence', t: '09:42', text: 'I reviewed the financial model. The CAC assumption looks reasonable, but I\'d like to see more detail on enterprise retention.' },
      { who: 'Rahul Mehta', tag: 'Co-investor', cat: 'Terms', t: '10:15', text: 'Agreed. Let\'s ask the architect for retention benchmarks from similar SaaS companies.' },
      { who: 'Sneha Kapoor', tag: 'Invited', cat: 'Meetings', t: '11:03', text: 'Sounds good. I\'ll schedule a call with the architect this week to discuss go-to-market strategy.' },
    ],
    dd: [
      { name: 'Business model & strategy', s: 'complete' },
      { name: 'Financial model', s: 'inprogress' },
      { name: 'Market validation', s: 'pending' },
      { name: 'Legal documents', s: 'pending' },
      { name: 'Technical review', s: 'pending' },
    ],
    files: [
      { name: 'Financial Model v2.xlsx', by: 'Ananya Sharma', d: '18 Sep' },
      { name: 'Market Research.pdf', by: 'Architect', d: '16 Sep' },
      { name: 'Pitch Deck.pdf', by: 'Architect', d: '12 Sep' },
      { name: 'Competitor Analysis.pdf', by: 'Rahul Mehta', d: '19 Sep' },
    ],
    syndicates: [
      { name: OPP.title + ' · investor syndicate', stage: 'Discover', c: 70, t: 100, n: 3, cur: true },
      { name: 'Healthtech Diagnostics', stage: 'Negotiation', c: 120, t: 150, n: 5 },
      { name: 'Climate Monitoring', stage: 'Agreement', c: 80, t: 80, n: 4 },
    ],
    history: [22000, 38000, 55000, 70000],
  });
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const k = (n) => '$' + Math.round(n / 1000) + 'K';
  const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const committed = () => S.investors.filter((i) => i.status === 'Confirmed').reduce((a, i) => a + i.amt, 0);
  const proposed = () => S.investors.reduce((a, i) => a + i.amt, 0);
  const remaining = () => Math.max(0, OPP.target - committed());
  const pct = () => Math.min(100, Math.round((committed() / OPP.target) * 100));
  const now = () => new Date().toTimeString().slice(0, 5);
  const ARROW = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  const DOC = '<svg class="ic" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';

  function toast(msg) {
    document.querySelectorAll('.ci-toast').forEach((t) => t.remove());
    const t = document.createElement('div'); t.className = 'ci-toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
  }
  function eyebrow(n, label) { return `<div class="ci-eyebrow"><span class="n">${n}</span><span class="ci-mono">${label}</span></div>`; }

  function render() {
    const root = document.getElementById('coinvestRoot');
    if (!root) return;
    const c = committed(), r = remaining();
    const lead = S.investors.find((i) => i.lead) || S.investors[0];
    const others = S.investors.filter((i) => i !== lead && i.amt > 0).slice(0, 1);
    const seatAmt = Math.max(0, OPP.target - proposed());
    const filtered = S.tab === 'All' ? S.messages : S.messages.filter((m) => m.cat === S.tab);
    const leadAmt = lead ? lead.amt : 0, coAmt = S.investors.filter((i) => i !== lead && i.status === 'Confirmed').reduce((a, i) => a + i.amt, 0);
    const p1 = (leadAmt / OPP.target) * 100, p2 = p1 + (coAmt / OPP.target) * 100;
    const maxH = Math.max(...S.history, OPP.target);

    root.innerHTML = `
<div class="ci-wrap">
  <div class="ci-top"><button class="ci-back" data-act="back">← Back to opportunity</button><span class="ci-pill">Prototype · Simulated</span></div>
  <div class="ci-hero">
    <div>
      <span class="ci-mono role">New · Co-investment</span>
      <h1>Co-Investment / <em>Investor Syndication</em></h1>
      <p class="ci-sub" style="margin:0">Collaborate with verified investors to jointly evaluate and fund one opportunity.</p>
      <div class="ci-mono" style="margin-top:.8rem">Opportunity-led collaboration · Individual investor decisions</div>
    </div>
    <div class="ci-hero-actions">
      <button class="ci-btn primary" data-act="create">+ Create a Syndicate</button>
      <button class="ci-btn" data-act="mine">View My Syndicates ${ARROW}</button>
    </div>
  </div>

  <div class="ci-card ci-opp">
    <div>
      <div class="ci-between"><span class="ci-mono">${OPP.code} · India</span><span class="ci-mono" style="color:var(--green)"><span class="ci-dot"></span>${S.joined ? 'Joined · Member' : 'Verified opportunity'}</span></div>
      <div class="ci-tags">${OPP.tags.map((t) => `<span class="ci-tag">${t}</span>`).join('')}</div>
      <h2 class="ci-serif" style="font-size:1.8rem;margin:.2rem 0">${OPP.title}</h2>
      <p style="color:var(--text-muted);font-size:.88rem;margin:0">${OPP.desc}</p>
      <div class="ci-checks"><span>High demand</span><span>Early traction</span><span>Scalable</span><span>Proprietary tech</span></div>
    </div>
    <div>
      <div class="ci-stats">
        <div class="ci-stat"><span class="ci-mono">Capital target</span><div class="v">${money(OPP.target)}</div></div>
        <div class="ci-stat"><span class="ci-mono">Committed</span><div class="v">${money(c)}</div></div>
        <div class="ci-stat"><span class="ci-mono">Remaining</span><div class="v role">${money(r)}</div></div>
      </div>
      <div class="ci-bar"><i style="width:${pct()}%"></i></div>
      <div class="ci-mono" style="text-align:right;margin-bottom:1rem">${pct()}% committed</div>
      <div class="ci-row"><button class="ci-btn" data-act="back">View Opportunity ${ARROW}</button><button class="ci-btn primary" data-act="invite">Invite Co-Investors</button></div>
    </div>
  </div>
</div>

<section class="ci-section" style="margin-top:4rem"><div class="ci-wrap">
  ${eyebrow('01', 'Why co-invest')}
  <h2 class="ci-h">Bring the right investors together for <em>stronger decisions.</em></h2>
  <p class="ci-sub">Pool capital, perspectives and diligence around one opportunity—while every investor keeps an individual decision.</p>
  <div class="ci-grid3">
    <div class="ci-card"><span class="ci-num">01</span><h4>Share capital</h4><p>Participate in larger, high-potential opportunities by pooling capital with like-minded investors.</p><button class="ci-link" data-act="scroll" data-to="ci-commit">See capital commitment →</button></div>
    <div class="ci-card"><span class="ci-num">02</span><h4>Combine expertise</h4><p>Leverage diverse experience, networks and domain knowledge for better evaluation.</p>
      <div class="ci-row" style="margin-bottom:.6rem">${['Fundraising', 'Healthcare expertise', 'Go-to-market'].map((x) => `<span class="ci-chip" data-act="chip">${x}</span>`).join('')}</div><button class="ci-link" data-act="scroll" data-to="ci-workspace">Meet the investors →</button></div>
    <div class="ci-card"><span class="ci-num">03</span><h4>Collaborate on diligence</h4><p>Share research, ask questions and evaluate documents together in a secure, structured workspace.</p>
      <div style="font-size:.75rem;color:var(--text-muted);display:grid;gap:.3rem">${S.dd.slice(0, 3).map((d) => `<span>${d.s === 'complete' ? '✓' : '○'} ${d.name}</span>`).join('')}</div></div>
  </div>
</div></section>

<section class="ci-section"><div class="ci-wrap">
  ${eyebrow('02', 'Illustrative allocation')}
  <h2 class="ci-h">Syndicate <em>structure.</em></h2>
  <p class="ci-sub">Illustrative structure for this opportunity. Allocations can be updated as the syndicate evolves.</p>
  <div class="ci-card ci-tree">
    <div class="ci-card tint ci-tree-top"><span class="ci-mono role">Opportunity · ${OPP.code}</span><h4>${OPP.title}</h4><div class="ci-serif" style="font-size:1.5rem;color:var(--role);font-style:italic">${money(OPP.target)}</div></div>
    <div class="ci-tree-lines"></div>
    <div class="ci-grid3">
      ${lead ? `<div class="ci-card bone ci-node"><span class="ci-mono">Lead</span><div style="font-weight:500;margin:.3rem 0">${esc(lead.name)}</div><div class="amt">${money(lead.amt)}</div><span class="ci-mono">${Math.round((lead.amt / OPP.target) * 100)}% allocation</span></div>` : ''}
      ${others.map((o) => `<div class="ci-card bone ci-node"><span class="ci-mono">${esc(o.role)}</span><div style="font-weight:500;margin:.3rem 0">${esc(o.name)}</div><div class="amt">${money(o.amt)}</div><span class="ci-mono">${Math.round((o.amt / OPP.target) * 100)}% allocation</span></div>`).join('')}
      <div class="ci-card ci-node open"><span class="ci-mono">Available</span><div style="font-weight:500;margin:.3rem 0">Open allocation</div><div class="amt">${money(seatAmt)}</div><span class="ci-mono">${Math.round((seatAmt / OPP.target) * 100)}% allocation</span></div>
    </div>
    <div class="ci-between" style="margin-top:1.6rem;border-top:1px solid var(--line);padding-top:1rem"><span style="font-size:.78rem;color:var(--text-muted)">Each participant evaluates and decides on an individual basis.</span><button class="ci-btn" data-act="alloc">Manage Allocation ${ARROW}</button></div>
  </div>
</div></section>

<section class="ci-section" id="ci-workspace"><div class="ci-wrap">
  ${eyebrow('03', 'Verified participants')}
  <h2 class="ci-h">Investor <em>workspace.</em></h2>
  <p class="ci-sub">Verified investors collaborating on this opportunity.</p>
  <div class="ci-between" style="margin-bottom:1rem"><span style="font-size:.88rem"><b style="color:var(--role)">${S.investors.length} investors</b> <span class="ci-mono">· ${S.isPrivate ? 'Private workspace' : 'Visible to verified investors'}</span></span>
    <div class="ci-row"><button class="ci-btn" data-act="join" ${S.joined ? 'disabled' : ''}>${S.joined ? 'Joined ✓' : 'Join Syndicate'}</button><button class="ci-btn primary" data-act="invite">+ Invite Verified Investor</button></div></div>
  <div class="ci-card ci-scroll" style="padding:0"><table class="ci-table">
    <thead><tr><th>Investor</th><th>Role</th><th>Allocation</th><th>Status</th><th>Joined on</th><th>Actions</th></tr></thead>
    <tbody>
    ${S.investors.map((i) => `<tr>
      <td><div class="ci-person"><span class="ci-av">${initials(i.name)}</span><div><b>${esc(i.name)}</b><small>${esc(i.firm)}</small></div></div></td>
      <td><span class="ci-chip">${esc(i.role)}</span></td>
      <td><b>${money(i.amt)}</b><br><small style="color:var(--text-faint)">${i.amt ? Math.round((i.amt / OPP.target) * 100) + '% of target' : 'Allocation pending'}</small></td>
      <td><span class="ci-dot ${i.status === 'Confirmed' ? '' : 'amber'}"></span>${i.status}</td>
      <td style="color:var(--text-faint)">${i.joined}</td>
      <td><div class="ci-row"><button class="ci-icon-btn" title="Message" data-act="dm" data-id="${i.id}">✉</button>
        <span class="ci-menu"><button class="ci-icon-btn" title="More" data-act="menu" data-id="${i.id}">⋯</button>
        <div class="ci-menu-pop" data-pop="${i.id}" hidden>
          ${i.status !== 'Confirmed' ? `<button data-act="confirm" data-id="${i.id}">Mark as confirmed</button>` : ''}
          <button data-act="alloc">Edit allocation</button>
          ${!i.lead ? `<button data-act="remove" data-id="${i.id}">Remove from syndicate</button>` : ''}
        </div></span></div></td>
    </tr>`).join('')}
    <tr><td><div class="ci-person"><span class="ci-av" style="border-style:dashed">+</span><div><b>Seeking verified investor</b><small>Allocation available for this opportunity</small></div></div></td>
      <td><span class="ci-chip">Open allocation</span></td><td><b>${money(seatAmt)}</b></td><td><span class="ci-dot grey"></span>Open</td><td style="color:var(--text-faint)">Awaiting investor</td>
      <td><button class="ci-btn sm" data-act="invite">Invite →</button></td></tr>
    </tbody></table></div>
  <p style="font-size:.75rem;color:var(--text-faint);margin-top:.8rem">✓ Investor identities are private and visible only to members of this syndicate.</p>
</div></section>

<section class="ci-section" id="ci-commit"><div class="ci-wrap">
  ${eyebrow('04', 'Individual participation')}
  <h2 class="ci-h">Capital <em>commitment.</em></h2>
  <p class="ci-sub">Real-time view of target capital, confirmed commitments and remaining allocation.</p>
  <div class="ci-grid3" style="margin-bottom:1rem">
    <div class="ci-card ci-stat"><span class="ci-mono">Capital target</span><div class="v" style="font-size:2.4rem">${money(OPP.target)}</div><span class="l">Opportunity requirement</span></div>
    <div class="ci-card ci-stat"><span class="ci-mono">Committed</span><div class="v" style="font-size:2.4rem">${money(c)}</div><span class="l"><span class="ci-dot"></span>${pct()}% confirmed · ${S.investors.filter((i) => i.status === 'Confirmed').length} investors</span></div>
    <div class="ci-card ci-stat"><span class="ci-mono">Remaining</span><div class="v role" style="font-size:2.4rem">${money(r)}</div><span class="l">${100 - pct()}% to target</span></div>
  </div>
  <div class="ci-card" style="margin-bottom:1rem"><div class="ci-between"><span style="font-size:.82rem">Confirmed capital</span><span class="ci-mono">${k(c)} / ${k(OPP.target)}</span></div><div class="ci-bar"><i style="width:${pct()}%"></i></div><div class="ci-between"><span style="font-size:.72rem;color:var(--text-faint)">Updated as investors confirm their individual commitments.</span><span class="ci-mono role">${pct()}% committed</span></div></div>
  <div class="ci-grid2">
    <div class="ci-card"><div class="ci-between"><div><span class="ci-mono">Proposed allocation mix</span><h4>Commitment breakdown</h4></div><button class="ci-btn sm" data-act="alloc">Edit split</button></div>
      <div class="ci-row" style="gap:2rem;margin-top:1rem"><div class="ci-donut" style="background:conic-gradient(var(--role) 0 ${p1}%, var(--text) ${p1}% ${p2}%, var(--bg-bone) ${p2}% 100%)"><span>${k(OPP.target)}</span></div>
      <div class="ci-legend"><div><span><i style="background:var(--role)"></i>Lead investor</span><b>${Math.round(p1)}%</b></div><div><span><i style="background:var(--text)"></i>Co-investors</span><b>${Math.round(p2 - p1)}%</b></div><div><span><i style="background:var(--bg-bone);border:1px solid var(--line)"></i>Open allocation</span><b>${Math.round(100 - p2)}%</b></div></div></div></div>
    <div class="ci-card"><div class="ci-between"><div><span class="ci-mono">Mock analytics · Sep 2026</span><h4>Commitment over time</h4></div><button class="ci-btn sm" data-act="refresh">Refresh</button></div>
      <div class="ci-bars" style="margin-top:1rem">${S.history.map((h, i) => `<div><span>${k(h)}</span><i style="height:${(h / maxH) * 85}%"></i><span>Wk ${i + 1}</span></div>`).join('')}</div></div>
  </div>
</div></section>

<section class="ci-section"><div class="ci-wrap">
  ${eyebrow('05', 'Collaborative review')}
  <h2 class="ci-h">Shared due <em>diligence.</em></h2>
  <p class="ci-sub">Track progress across key areas. Select an item to update its mock review state.</p>
  <div class="ci-side">
    <div class="ci-card" style="padding:0">${S.dd.map((d, i) => `<div class="ci-dd" data-act="dd" data-i="${i}"><span class="ci-ring ${d.s}">${d.s === 'complete' ? '✓' : ''}</span>${d.name}<span class="st ${d.s}">${{ complete: 'Complete', inprogress: 'In review', pending: 'Pending' }[d.s]} →</span></div>`).join('')}</div>
    <div class="ci-card bone"><span class="ci-mono">Authorised review</span><p style="margin-top:.6rem">Documents and questions stay within this opportunity's authorised investors and architect workflow.</p>
      <button class="ci-btn primary block" data-act="dataroom" style="margin-bottom:.6rem">Open Data Room</button><button class="ci-btn block" data-act="architect">Ask Architect ${ARROW}</button></div>
  </div>
</div></section>

<section class="ci-section"><div class="ci-wrap">
  ${eyebrow('06', 'Current stage · ' + STAGES[S.stage])}
  <h2 class="ci-h">Syndicate <em>overview.</em></h2>
  <p class="ci-sub">One shared process. Separate investor decisions.</p>
  <div class="ci-grid2">
    <div class="ci-card"><span class="ci-mono">Current syndicate</span><h4>${OPP.title}</h4>
      <div class="ci-stats" style="grid-template-columns:repeat(4,1fr);margin-top:1rem"><div class="ci-stat"><div class="v">${S.investors.length}</div><span class="l">Investors</span></div><div class="ci-stat"><div class="v">${k(c)}</div><span class="l">Committed</span></div><div class="ci-stat"><div class="v">${k(r)}</div><span class="l">Open</span></div><div class="ci-stat"><div class="v">4 days</div><span class="l">In current stage</span></div></div>
      <div class="ci-bar"><i style="width:${pct()}%"></i></div></div>
    <div class="ci-card"><div class="ci-between"><span class="ci-mono">Shared progress</span><span class="ci-mono">Stage ${S.stage + 1} of ${STAGES.length}</span></div><h4>Status timeline</h4>
      <div class="ci-tl">${STAGES.map((s, i) => `<div class="ci-tl-step ${i < S.stage ? 'done' : i === S.stage ? 'cur' : ''}" data-act="stage" data-i="${i}"><span class="d">${i < S.stage ? '✓' : i + 1}</span>${s}</div>`).join('')}</div>
      <div class="ci-between"><span style="font-size:.78rem;color:var(--text-muted)">${S.joined ? 'You are a member of this syndicate.' : 'Interested in participating in this syndicate?'}</span>
        ${S.joined ? `<button class="ci-btn sm primary" data-act="advance" ${S.stage >= STAGES.length - 1 ? 'disabled' : ''}>Advance stage →</button>` : `<button class="ci-btn sm primary" data-act="join">Join Syndicate →</button>`}</div></div>
  </div>
</div></section>

<section class="ci-section" id="ci-chat"><div class="ci-wrap">
  ${eyebrow('07', 'Verified investors · Private workspace')}
  <h2 class="ci-h">Private investor <em>discussion.</em></h2>
  <p class="ci-sub">Discuss, ask questions and align before committing.</p>
  <div class="ci-side">
    <div class="ci-card ci-chat">
      <div class="ci-chat-head ci-between"><span class="ci-mono">🔒 Syndicate members only</span><button class="ci-btn sm" data-act="call">Start Group Call</button></div>
      <div class="ci-tabs">${['All', 'Due diligence', 'Terms', 'Meetings', 'General'].map((t) => `<button class="${S.tab === t ? 'on' : ''}" data-act="tab" data-t="${t}">${t}</button>`).join('')}</div>
      <div class="ci-msgs">${filtered.length ? filtered.map((m) => `<div class="ci-msg"><span class="ci-av">${initials(m.who)}</span><div class="body"><b>${esc(m.who)}</b><span class="tg">${esc(m.tag)}</span><p>${esc(m.text)}</p></div><span class="t">${m.t}</span></div>`).join('') : '<div class="ci-msg"><p style="color:var(--text-faint)">No messages in this thread yet.</p></div>'}</div>
      <div class="ci-compose"><textarea id="ciMsg" rows="2" placeholder="Write a message…"></textarea>
        <div class="ci-between" style="margin-top:.6rem"><button class="ci-link" data-act="attach">📎 Attach</button><div class="ci-row"><span style="font-size:.68rem;color:var(--text-faint)">Visible to syndicate members</span><button class="ci-btn sm primary" data-act="send">Send ➤</button></div></div></div>
    </div>
    <div class="ci-card"><div class="ci-between"><div><span class="ci-mono">Workspace references</span><h4>Shared files</h4></div><button class="ci-icon-btn" title="Upload" data-act="attach">＋</button></div>
      ${S.files.map((f, i) => `<div class="ci-file" data-act="file" data-i="${i}">${DOC}<div><b>${esc(f.name)}</b><small>Shared by ${esc(f.by)} · ${f.d}</small></div></div>`).join('')}
      <p style="font-size:.7rem;color:var(--text-faint);margin-top:.8rem">✓ Access to shared files is monitored.</p></div>
  </div>
</div></section>

<section class="ci-section"><div class="ci-wrap">
  ${eyebrow('08', 'A considered path to agreement')}
  <h2 class="ci-h">How co-investment <em>works.</em></h2>
  <p class="ci-sub">Seven clear stages, from the first signal to an individual agreement with the architect.</p>
  <div class="ci-steps">${STAGES.map((s, i) => `<div class="ci-step ${S.activeStep === i ? 'on' : ''}" data-act="step" data-i="${i}"><span class="ci-num">0${i + 1}</span><b>${s}</b><p>${['Find an opportunity that matches your investment focus.', 'Start a new syndicate or join an existing one.', 'Collaborate privately with verified investors.', 'Review documents, ask questions and align on key items.', 'Determine each investor\'s individual allocation.', 'Each investor confirms their own commitment.', 'Proceed toward the agreement with the architect.'][i]}</p></div>`).join('')}</div>
  <p style="font-size:.72rem;color:var(--text-faint);margin-top:1rem">Stages 06–07 represent future backend integrations (KYC, agreements, escrow). No real transaction occurs in this prototype.</p>
</div></section>

<section class="ci-section"><div class="ci-wrap">
  ${eyebrow('09', 'Control your participation')}
  <h2 class="ci-h">Investor discovery <em>&amp; privacy.</em></h2>
  <p class="ci-sub">You decide how your syndicate participation is shared.</p>
  <div class="ci-grid3">
    <div class="ci-card"><h4>Private by default</h4><p>Investor identities are shared only with authorised participants.</p><div class="ci-row"><button class="ci-toggle ${S.isPrivate ? 'on' : ''}" data-act="private" aria-label="Toggle privacy"></button><span style="font-size:.8rem">${S.isPrivate ? 'Private (default)' : 'Discoverable'}</span></div></div>
    <div class="ci-card"><h4>Invite verified investors</h4><p>Invite relevant investors from the vvEntra network who may be interested in this opportunity.</p><button class="ci-link" data-act="invite">Invite verified investor →</button></div>
    <div class="ci-card"><h4>Visibility settings</h4><p>Manage what information you share with other members.</p><button class="ci-link" data-act="privacy">Manage privacy →</button></div>
  </div>
  <div class="ci-card bone ci-disclaimer"><span class="ci-mono role" style="white-space:nowrap">Prototype workflow</span><p style="margin:0;flex:1">This interface demonstrates a proposed collaboration flow only. It does not perform investments, payments, escrow, identity verification, securities issuance or legal agreements. Any production workflow would require regulatory, legal and payment integrations.</p><button class="ci-btn" data-act="back">Return to opportunity →</button></div>
  <div style="text-align:right;margin-top:1rem"><button class="ci-link" data-act="reset">Reset demo data</button></div>
</div></section>`;
  }

  /* ---------- Modals ---------- */
  function modal(html, wide) {
    closeModal();
    const bg = document.createElement('div'); bg.className = 'ci-modal-bg'; bg.id = 'ciModal';
    bg.innerHTML = `<div class="ci-modal ${wide ? 'wide' : ''}"><button class="ci-x" data-act="close" aria-label="Close">×</button>${html}</div>`;
    bg.addEventListener('click', (e) => { if (e.target === bg) closeModal(); });
    document.body.appendChild(bg);
    return bg;
  }
  function closeModal() { const m = document.getElementById('ciModal'); if (m) m.remove(); }
  const val = (id) => (document.getElementById(id) || {}).value || '';
  const num = (s) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

  const modals = {
    create() {
      modal(`<span class="ci-mono role">Opportunity-linked · Prototype</span><h3>Create a syndicate</h3><p>Start a private investor workspace around this opportunity. No investment or agreement is created.</p>
        <div class="ci-card bone" style="margin-bottom:1rem"><span class="ci-mono role">Opportunity</span><div style="margin-top:.3rem;font-size:.9rem">${OPP.code} · ${OPP.title}</div></div>
        <div class="ci-field"><label>Syndicate name</label><input id="ciName" value="${OPP.title} · investor syndicate"></div>
        <div class="ci-grid2"><div class="ci-field"><label>Capital target</label><input id="ciTarget" value="${money(OPP.target)}"></div>
        <div class="ci-field"><label>Visibility</label><select id="ciVis"><option>Members only</option><option>Verified investors</option><option>Invite only</option></select></div></div>
        <div class="ci-note">🛡 Investor participation is private by default. Commitments are simulated.</div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Cancel</button><button class="ci-btn primary" data-act="doCreate">Create syndicate ${ARROW}</button></div>`);
    },
    mine() {
      modal(`<span class="ci-mono role">Investor workspace</span><h3>My Syndicates</h3><p>Open an opportunity workspace or review the current progress of your syndicates.</p>
        ${S.syndicates.map((s, i) => `<div class="ci-synd"><div><span class="ci-mono">${esc(s.stage)}</span><h5>${esc(s.name)}</h5><small>$${s.c}K / $${s.t}K committed · ${s.n} investors</small></div><div style="min-width:170px"><div class="ci-bar" style="margin-top:0"><i style="width:${Math.min(100, (s.c / s.t) * 100)}%"></i></div><button class="ci-btn block" data-act="openSynd" data-i="${i}">${s.c >= s.t ? 'View' : 'Open'} ${ARROW}</button></div></div>`).join('')}`, true);
    },
    invite() {
      const F = window.__ciF || (window.__ciF = { ind: '', rng: '', geo: '', typ: '', exp: '' });
      const sel = (id, label, opts) => `<div class="ci-field" style="margin:0"><label style="font-size:.72rem;color:var(--text-muted)">${label}</label><select data-f="${id}" onchange="window.__ciFilter(this)">${opts.map((o, i) => `<option value="${i ? esc(o) : ''}" ${F[id] === (i ? o : '') ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
      const list = NETWORK.filter((n) => (!F.ind || n.ind.includes(F.ind)) && (!F.rng || n.rng === F.rng) && (!F.geo || n.geo === F.geo) && (!F.typ || n.typ === F.typ) && (!F.exp || n.exp === F.exp));
      const invited = S.netInvited || [];
      modal(`<span class="ci-mono role">vvEntra network · Private invitation</span><h3>Invite verified investors</h3><p>Invite relevant investors from the vvEntra network to participate in this opportunity.</p>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.6rem;margin-bottom:1.2rem">
          ${sel('ind', 'Industry', ['All industries', 'AI', 'SaaS', 'Fintech', 'Healthcare'])}
          ${sel('rng', 'Investment range', ['Any range', '$10K–$30K', '$30K–$100K', '$100K+'])}
          ${sel('geo', 'Geography', ['All geographies', 'India', 'Asia-Pacific', 'Global'])}
          ${sel('typ', 'Investor type', ['All types', 'VC Partner', 'Family Office', 'Strategic Buyer', 'Operator Investor'])}
          ${sel('exp', 'Expertise', ['All expertise', 'AI / SaaS', 'Enterprise', 'Go-to-market', 'Healthcare'])}
        </div>
        <div class="ci-between" style="margin-bottom:.4rem"><span class="ci-mono role">Suggested investors</span><small style="color:var(--text-faint);font-size:.72rem">Identities are only shared after an invitation is accepted.</small></div>
        ${list.length ? list.map((n) => `<div class="ci-between" style="padding:.8rem 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><div class="ci-person"><span class="ci-av" style="border-radius:4px">👥</span><div><b>${esc(n.title)}</b><small>${esc(n.desc)}</small></div></div>${invited.includes(n.id) ? `<button class="ci-btn sm" disabled style="color:var(--green)">✓ Invited</button>` : `<button class="ci-btn sm" data-act="inviteOne" data-id="${n.id}">Invite ${ARROW}</button>`}</div>`).join('') : `<p style="padding:1rem 0;color:var(--text-faint)">No investors match these filters.</p>`}
        <div class="ci-note" style="margin-top:1rem">🔒 Only role, investment range and relevant expertise are shown before an invitation is accepted.</div>`, true);
    },
    inviteForm(n) {
      modal(`<span class="ci-mono role">Verified network</span><h3>Invite a verified investor</h3><p>Invitations are sent only to identity-verified vvEntra investors. They will see the opportunity summary before joining.</p>
        <input type="hidden" id="ciInvNet" value="${n ? n.id : ''}">
        <div class="ci-field"><label>Investor name</label><input id="ciInvName" placeholder="e.g. Karan Malhotra" value="${n ? esc(n.title) : ''}"></div>
        <div class="ci-grid2"><div class="ci-field"><label>Email</label><input id="ciInvEmail" placeholder="investor@firm.com"></div>
        <div class="ci-field"><label>Proposed allocation</label><input id="ciInvAmt" value="${money(Math.max(0, OPP.target - proposed()))}"></div></div>
        <div class="ci-field"><label>Personal note (optional)</label><textarea id="ciInvNote" rows="2" placeholder="Why this opportunity might interest them…"></textarea></div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="${n ? 'invite' : 'close'}">Cancel</button><button class="ci-btn primary" data-act="doInvite">Send invitation ${ARROW}</button></div>`);
    },
    join() {
      modal(`<span class="ci-mono role">Join syndicate</span><h3>Join this syndicate</h3><p>Indicate an allocation you are considering. This is a non-binding, simulated indication of interest.</p>
        <div class="ci-field"><label>Your name</label><input id="ciJoinName" value="You (Investor)"></div>
        <div class="ci-field"><label>Indicative allocation (open: ${money(Math.max(0, OPP.target - proposed()))})</label><input id="ciJoinAmt" value="${money(Math.min(30000, Math.max(0, OPP.target - proposed())))}"></div>
        <div class="ci-note">Your final decision remains individual. No funds are moved.</div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Cancel</button><button class="ci-btn primary" data-act="doJoin">Join syndicate ${ARROW}</button></div>`);
    },
    alloc() {
      modal(`<span class="ci-mono role">Allocation</span><h3>Manage allocation</h3><p>Adjust each investor's proposed allocation. Total cannot exceed the ${money(OPP.target)} target.</p>
        ${S.investors.map((i) => `<div class="ci-field"><label>${esc(i.name)} <span class="ci-mono">· ${esc(i.role)}</span></label><input data-alloc="${i.id}" value="${money(i.amt)}"></div>`).join('')}
        <div id="ciAllocErr" style="color:var(--red);font-size:.8rem"></div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Cancel</button><button class="ci-btn primary" data-act="doAlloc">Save allocation</button></div>`);
    },
    dataroom() {
      modal(`<span class="ci-mono role">Controlled access</span><h3>Data room</h3><p>Reviewed documents shared with authorised syndicate members.</p>
        ${S.files.concat([{ name: 'Architecture Spec.pdf', by: 'Architect', d: '10 Sep' }, { name: 'Customer References.pdf', by: 'Architect', d: '11 Sep' }]).map((f) => `<div class="ci-file" data-act="preview" data-n="${esc(f.name)}">${DOC}<div><b>${esc(f.name)}</b><small>${esc(f.by)} · ${f.d}</small></div><span class="ci-mono" style="margin-left:auto">View</span></div>`).join('')}
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Close</button></div>`);
    },
    architect() {
      modal(`<span class="ci-mono role">Opportunity creator</span><h3>Ask the architect</h3><p>Your question is shared with the verified architect and visible to syndicate members.</p>
        <div class="ci-field"><label>Topic</label><select id="ciArchTopic"><option>Due diligence</option><option>Terms</option><option>Meetings</option><option>General</option></select></div>
        <div class="ci-field"><label>Question</label><textarea id="ciArchQ" rows="3" placeholder="e.g. Can you share retention benchmarks from comparable deployments?"></textarea></div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Cancel</button><button class="ci-btn primary" data-act="doArch">Send question ${ARROW}</button></div>`);
    },
    call() {
      modal(`<span class="ci-mono role">Group call · Simulated</span><h3>Start a group call</h3><p>Invite syndicate members and the architect to a call.</p>
        ${S.investors.map((i) => `<label class="ci-file"><input type="checkbox" checked> <span class="ci-av">${initials(i.name)}</span>${esc(i.name)}</label>`).join('')}
        <label class="ci-file"><input type="checkbox" checked> <span class="ci-av">A</span>Verified Architect</label>
        <div class="ci-grid2" style="margin-top:1rem"><div class="ci-field"><label>Date</label><input type="date" id="ciCallDate"></div><div class="ci-field"><label>Time</label><input type="time" id="ciCallTime" value="16:00"></div></div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="doCall" data-now="1">Start now</button><button class="ci-btn primary" data-act="doCall">Schedule call</button></div>`);
    },
    privacy() {
      const opts = ['Show my name to members', 'Show my allocation to members', 'Show my firm / affiliation', 'Allow discovery by verified investors'];
      S.privacyOpts = S.privacyOpts || [true, true, true, false];
      modal(`<span class="ci-mono role">Visibility</span><h3>Privacy settings</h3><p>Control what other syndicate members can see about you.</p>
        ${opts.map((o, i) => `<label class="ci-file"><input type="checkbox" data-priv="${i}" ${S.privacyOpts[i] ? 'checked' : ''}> ${o}</label>`).join('')}
        <div class="ci-modal-foot"><button class="ci-btn" data-act="close">Cancel</button><button class="ci-btn primary" data-act="doPriv">Save settings</button></div>`);
    },
  };

  /* ---------- Actions ---------- */
  function addMsg(text, cat, who, tag) {
    S.messages.push({ who: who || 'You', tag: tag || (S.joined ? 'Member' : 'Investor'), cat: cat || (S.tab === 'All' ? 'General' : S.tab), t: now(), text });
  }
  const act = {
    back() { location.hash = 'listing'; },
    close: closeModal,
    scroll(el) { const t = document.getElementById(el.dataset.to); if (t) t.scrollIntoView({ behavior: 'smooth' }); },
    chip(el) { el.classList.toggle('on'); },
    doCreate() {
      const name = val('ciName').trim() || 'New syndicate';
      const t = num(val('ciTarget')) || OPP.target;
      S.syndicates.unshift({ name, stage: 'Create / Join', c: 0, t: Math.round(t / 1000), n: 1 });
      save(); closeModal(); toast('Syndicate "' + name + '" created (' + val('ciVis') + ').'); setTimeout(modals.mine, 400);
    },
    openSynd(el) {
      const s = S.syndicates[+el.dataset.i]; closeModal();
      if (s.cur || s.name.indexOf(OPP.title) === 0) document.getElementById('ci-workspace').scrollIntoView({ behavior: 'smooth' });
      else toast('Opening "' + s.name + '" workspace — available in a future release.');
    },
    inviteOne(el) { modals.inviteForm(NETWORK.find((n) => n.id === el.dataset.id)); },
    doInvite() {
      const name = val('ciInvName').trim(); const email = val('ciInvEmail').trim();
      if (!name) return toast('Please enter the investor\'s name.');
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return toast('Please enter a valid email.');
      const amt = Math.min(num(val('ciInvAmt')), Math.max(0, OPP.target - proposed()));
      S.investors.push({ id: Date.now(), name, role: 'Co-Investor', firm: email || 'Verified investor', amt, status: 'Invited', joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
      const netId = val('ciInvNet');
      if (netId) { S.netInvited = (S.netInvited || []).concat(netId); save(); render(); modals.invite(); return toast('Invitation sent to ' + name + '.'); }
      save(); closeModal(); render(); toast('Invitation sent to ' + name + '.');
    },
    join() { if (!S.joined) modals.join(); },
    doJoin() {
      const amt = Math.min(num(val('ciJoinAmt')), Math.max(0, OPP.target - proposed()));
      S.investors.push({ id: Date.now(), name: val('ciJoinName') || 'You', role: 'Co-Investor', firm: 'Verified investor · You', amt, status: 'Confirmed', joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), you: true });
      S.joined = true; S.history.push(committed());
      if (S.history.length > 6) S.history.shift();
      addMsg('Joined the syndicate with an indicative allocation of ' + money(amt) + '.', 'General');
      save(); closeModal(); render(); toast('You joined the syndicate. Commitment is simulated.');
    },
    doAlloc() {
      const inputs = document.querySelectorAll('[data-alloc]'); let total = 0; const vals = {};
      inputs.forEach((i) => { vals[i.dataset.alloc] = num(i.value); total += vals[i.dataset.alloc]; });
      if (total > OPP.target) { document.getElementById('ciAllocErr').textContent = 'Total ' + money(total) + ' exceeds target of ' + money(OPP.target) + '.'; return; }
      S.investors.forEach((i) => { if (vals[i.id] != null) i.amt = vals[i.id]; });
      S.history[S.history.length - 1] = committed();
      save(); closeModal(); render(); toast('Allocation updated.');
    },
    menu(el) {
      const pop = document.querySelector(`[data-pop="${el.dataset.id}"]`);
      const was = !pop.hidden; document.querySelectorAll('.ci-menu-pop').forEach((p) => (p.hidden = true)); pop.hidden = was;
    },
    confirm(el) { const i = S.investors.find((x) => x.id == el.dataset.id); i.status = 'Confirmed'; S.history.push(committed()); if (S.history.length > 6) S.history.shift(); save(); render(); toast(i.name + ' marked as confirmed.'); },
    remove(el) { const i = S.investors.find((x) => x.id == el.dataset.id); if (!window.confirm('Remove ' + i.name + ' from the syndicate?')) return; S.investors = S.investors.filter((x) => x !== i); if (i.you) S.joined = false; save(); render(); toast(i.name + ' removed.'); },
    dm(el) {
      const i = S.investors.find((x) => x.id == el.dataset.id);
      document.getElementById('ci-chat').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { const t = document.getElementById('ciMsg'); t.value = '@' + i.name.split(' ')[0] + ' '; t.focus(); }, 500);
    },
    refresh() { S.history = S.history.map((h, i, a) => (i === a.length - 1 ? committed() : h)); render(); toast('Analytics refreshed.'); },
    dd(el) { const d = S.dd[+el.dataset.i]; d.s = { pending: 'inprogress', inprogress: 'complete', complete: 'pending' }[d.s]; save(); render(); toast(d.name + ': ' + { complete: 'Complete', inprogress: 'In review', pending: 'Pending' }[d.s]); },
    stage(el) { if (!S.joined) return toast('Join the syndicate to update its stage.'); S.stage = +el.dataset.i; S.activeStep = S.stage; save(); render(); },
    advance() { if (S.stage < STAGES.length - 1) { S.stage++; S.activeStep = S.stage; save(); render(); toast('Stage advanced to ' + STAGES[S.stage] + '.'); } },
    tab(el) { S.tab = el.dataset.t; save(); render(); },
    send() {
      const t = document.getElementById('ciMsg'); const text = t.value.trim();
      if (!text) return toast('Write a message first.');
      addMsg(text); save(); render();
      const m = document.querySelector('.ci-msgs'); if (m) m.scrollTop = m.scrollHeight;
    },
    attach() {
      const inp = document.createElement('input'); inp.type = 'file';
      inp.onchange = () => { const f = inp.files[0]; if (!f) return; S.files.unshift({ name: f.name, by: 'You', d: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) }); addMsg('Shared a file: ' + f.name); save(); render(); toast(f.name + ' shared with the syndicate (stored locally).'); };
      inp.click();
    },
    file(el) { act.preview({ dataset: { n: S.files[+el.dataset.i].name } }); },
    preview(el) {
      modal(`<span class="ci-mono role">Document preview · Watermarked</span><h3>${esc(el.dataset.n)}</h3><p>Preview restricted to syndicate members. Downloads are disabled in this prototype.</p>
        <div class="ci-card bone" style="height:220px;display:grid;place-items:center;color:var(--text-faint);font-family:'JetBrains Mono',monospace;font-size:.75rem">CONFIDENTIAL · ${OPP.code} · PREVIEW</div>
        <div class="ci-modal-foot"><button class="ci-btn" data-act="dataroom">Back to data room</button><button class="ci-btn primary" data-act="close">Done</button></div>`);
    },
    doArch() {
      const q = val('ciArchQ').trim(); if (!q) return toast('Please write your question.');
      addMsg('Question for the architect: ' + q, val('ciArchTopic'));
      save(); closeModal(); render(); toast('Question sent to the architect.');
      setTimeout(() => { addMsg('Thanks — I\'ll share detailed notes in the data room within 48 hours.', val('ciArchTopic') || 'General', 'Verified Architect', 'Architect'); save(); if (document.querySelector('.coinvest-page.active')) render(); }, 2500);
    },
    doCall(el) {
      if (el.dataset.now) { closeModal(); toast('Group call started (simulated). Members have been notified.'); addMsg('Started a group call.', 'Meetings'); }
      else { const d = val('ciCallDate') || 'the next available date'; addMsg('Scheduled a group call for ' + d + ' at ' + val('ciCallTime') + '.', 'Meetings'); closeModal(); toast('Group call scheduled.'); }
      save(); render();
    },
    step(el) { S.activeStep = +el.dataset.i; save(); render(); },
    private() { S.isPrivate = !S.isPrivate; save(); render(); toast(S.isPrivate ? 'Participation is now private.' : 'Your participation is discoverable by verified investors.'); },
    doPriv() { document.querySelectorAll('[data-priv]').forEach((c) => (S.privacyOpts[+c.dataset.priv] = c.checked)); S.isPrivate = !S.privacyOpts[3]; save(); closeModal(); render(); toast('Privacy settings saved.'); },
    reset() { if (!window.confirm('Reset all co-investment demo data?')) return; S = fresh(); save(); render(); toast('Demo data reset.'); },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || !(el.closest('#coinvestRoot') || el.closest('#ciModal'))) {
      if (!e.target.closest('.ci-menu')) document.querySelectorAll('.ci-menu-pop').forEach((p) => (p.hidden = true));
      return;
    }
    const a = el.dataset.act;
    if (el.tagName === 'INPUT') return;
    e.preventDefault();
    if (act[a]) act[a](el); else if (modals[a]) modals[a]();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'ciMsg') { e.preventDefault(); act.send(); }
  });

  function check() { if ((location.hash || '').slice(1).split('/')[0] === 'coinvest') { render(); } else closeModal(); }
  window.addEventListener('hashchange', check);
  render();
  check();
})();
