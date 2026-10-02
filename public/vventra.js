
/* ============================================== */
/* UNIFIED ROUTER + SHARED LOGIC */
/* ============================================== */
(function() {
  'use strict';
  
  // ===== Theme toggle =====
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('vve-theme', next);
    });
  }
  
  // ===== Role toggle (global - works on any .role-btn anywhere) =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.role-btn');
    if (!btn) return;
    const target = btn.dataset.role;
    if (!target) return;
    const cur = document.documentElement.getAttribute('data-role');
    if (target === cur) return;
    document.documentElement.setAttribute('data-role', target);
    localStorage.setItem('vve-role', target);
    
    // Re-trigger reveal animations on currently visible page
    setTimeout(() => {
      document.querySelectorAll('.page.active .role-show .reveal').forEach(el => {
        const visible = el.closest('.role-show') && el.closest('.role-show').dataset.show === target;
        if (visible) {
          el.classList.remove('in');
          setTimeout(() => el.classList.add('in'), 50);
        }
      });
      // Re-trigger funnel/region bar animations if dashboard is visible
      const activePage = document.querySelector('.page.active');
      if (activePage) {
        if (target === 'architect') {
          activePage.querySelectorAll('#funnel .funnel-stage').forEach((s, i) => {
            s.classList.remove('in');
            setTimeout(() => s.classList.add('in'), i * 100);
          });
          activePage.querySelectorAll('#region-bars-arc .region-bar').forEach((b, i) => {
            b.classList.remove('in');
            setTimeout(() => b.classList.add('in'), i * 80);
          });
        } else {
          activePage.querySelectorAll('#region-bars-inv .region-bar').forEach((b, i) => {
            b.classList.remove('in');
            setTimeout(() => b.classList.add('in'), i * 80);
          });
        }
      }
    }, 50);
  });

  
  // ===== Reveal observer (shared across all pages) =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('in'); 
        revealObserver.unobserve(e.target); 
      } 
    });
  }, { threshold: 0.12 });
  
  function observeReveals(scope) {
    (scope || document).querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
  }
  
  // ===== Ticker rotates per active page =====
  const tickerLabel = document.getElementById('ticker-label');
  const tickerTrack = document.getElementById('ticker-track');
  
  const tickerByPage = {
    home: {
      label: 'Live',
      items: [
        { code: 'VVE-2440', text: 'B2B media subscription play opens', delta: '+12%' },
        { code: 'VVE-2438', text: 'D2C ayurveda · UNLOCKED · $4,800', delta: 'Closed' },
        { code: 'VVE-2436', text: 'AI workflow agent · 3 buyers active', delta: '+14%' },
        { code: 'VVE-2434', text: 'SMB lending tier-2 India listed', delta: 'New' },
      ]
    },
    dashboard: {
      label: 'Live',
      items: [
        { code: 'VVE-2440', text: 'B2B media · subscription play', delta: '+12%' },
        { code: 'GAP', text: 'RegTech mid-market · 18 listings', delta: 'Surge' },
        { code: 'BUYER', text: 'PE Director · AI workflow search', delta: 'Active' },
        { code: 'GAP', text: 'AI Agents vertical · 60-pt gap', delta: 'Hot' },
      ]
    },
    trust: {
      label: 'Trust',
      items: [
        { code: '▲', text: 'Every transaction · escrow protected', delta: '' },
        { code: '▲', text: '7-day inspection · 5-day dispute SLA', delta: '' },
        { code: '▲', text: 'KYC verified · architects + buyers', delta: '' },
      ]
    },
    playbook: {
      label: 'Playbook',
      items: [
        { code: '▲', text: 'Read this before your first transaction', delta: '' },
        { code: '▲', text: 'Strategic guidelines · not just rules', delta: '' },
        { code: '▲', text: 'How serious users get serious results', delta: '' },
      ]
    },
    faq: {
      label: 'FAQ',
      items: [
        { code: '▲', text: 'Everything you need · before transaction', delta: '' },
        { code: '▲', text: 'Buyer questions · 24 answered', delta: '' },
        { code: '▲', text: 'Architect questions · 22 answered', delta: '' },
      ]
    },
    pricing: {
      label: 'Pricing',
      items: [
        { code: '▲', text: 'Simple economics · Disciplined process', delta: '' },
        { code: '▲', text: 'No subscriptions · No listing fees · No surprises', delta: '' },
        { code: '▲', text: 'Three engagement paths · Buyer chooses how to proceed', delta: '' },
        { code: '▲', text: 'Try the live calculator below', delta: '' },
      ]
    },
    about: {
      label: 'About',
      items: [
        { code: '▲', text: 'Built carefully · Operated quietly · Trusted structurally', delta: '' },
        { code: '▲', text: 'A platform for the AI era · Where intelligence meets execution', delta: '' },
        { code: '▲', text: 'Small team · Deliberate scale · Long horizon', delta: '' },
      ]
    },
    listing: {
      label: 'Opportunity',
      items: [
        { code: '▲', text: 'Confidential · Verified · Structured to 90 pages', delta: '' },
        { code: '▲', text: 'Six sections visible · Six unlocked after payment', delta: '' },
        { code: '▲', text: 'Escrow-protected · Meet the architect before committing', delta: '' },
      ]
    },
    browse: {
      label: 'Marketplace',
      items: [
        { code: '▲', text: 'Six opportunities live · Verified and documentation-reviewed', delta: '' },
        { code: '▲', text: 'Browse freely · Unlock only what earns your attention', delta: '' },
        { code: '▲', text: 'Every listing carries a trust score and verified architect', delta: '' },
      ]
    },
    list: {
      label: 'Compose',
      items: [
        { code: '▲', text: 'Free fields build trust · Teasers create curiosity', delta: '' },
        { code: '▲', text: 'Show the first 100 characters · Let the blur do the selling', delta: '' },
        { code: '▲', text: 'Depth is your moat · Structure is your signal', delta: '' },
      ]
    },
    purchase: {
      label: 'Checkout',
      items: [
        { code: '▲', text: 'Escrow-protected · Funds release only on your approval', delta: '' },
        { code: '▲', text: 'See every document before you commit', delta: '' },
        { code: '▲', text: 'Unlock first · Then choose how you engage', delta: '' },
      ]
    }
  };
  
  function updateTicker(page) {
    if (!tickerTrack || !tickerLabel) return;
    const config = tickerByPage[page] || tickerByPage.home;
    tickerLabel.textContent = config.label;
    const html = config.items.map(it => 
      `<span class="ticker-item"><span class="code">${it.code}</span><span>${it.text}</span>${it.delta ? `<span class="up">${it.delta}</span>` : ''}<span class="sep"></span></span>`
    ).join('');
    tickerTrack.innerHTML = html + html + html + html;
  }
  
  // ===== Router =====
  const VALID_ROUTES = ['home', 'dashboard', 'trust', 'playbook', 'faq', 'pricing', 'about', 'listing', 'browse', 'list', 'purchase', 'apply', 'verify', 'terms', 'profile', 'earnings', 'settings', 'coinvest'];
  let composedListing = null;  // carries architect's composed data to the buyer preview

  // ===================================================================
  // VVE SESSION — central account + verification state for the prototype
  // Persists in localStorage so the journey survives page refreshes.
  // Account stages: 'guest' -> 'applied' -> 'verified'
  // ===================================================================
  const VVE = (function() {
    const KEY = 'vve-session';
    const DEFAULT = { stage: 'guest', role: null, name: '', email: '', verifyState: 'none', profile: null, earnings: null, settings: null };
    function load() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? Object.assign({}, DEFAULT, JSON.parse(raw)) : Object.assign({}, DEFAULT);
      } catch (e) { return Object.assign({}, DEFAULT); }
    }
    function save(s) {
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    }
    let state = load();
    return {
      get: () => state,
      set: (patch) => { state = Object.assign({}, state, patch); save(state); renderAccountUI(); },
      reset: () => { state = Object.assign({}, DEFAULT); save(state); renderAccountUI(); },
      isVerified: () => state.stage === 'verified',
      hasApplied: () => state.stage === 'applied' || state.stage === 'verified'
    };
  })();

  // ----- Tier system (based on value transacted) -----
  const VVE_TIERS = [
    { name: 'Charter', min: 250000, cls: 'elite',         note: 'Top tier. A proven track record of high-value deals.' },
    { name: 'Distinguished', min: 50000, cls: 'distinguished', note: 'A strong, established history on the platform.' },
    { name: 'Established', min: 10000, cls: 'established',  note: 'Multiple completed deals and a growing reputation.' },
    { name: 'Active', min: 1, cls: 'active',               note: 'First deals completed. Building a track record.' },
    { name: 'New', min: 0, cls: 'new',                     note: 'Verified, with no completed deals yet.' }
  ];
  function tierFor(total) {
    for (const t of VVE_TIERS) { if (total >= t.min) return t; }
    return VVE_TIERS[VVE_TIERS.length - 1];
  }
  function nextTier(total) {
    // find the tier just above current
    const sorted = VVE_TIERS.slice().sort((a,b)=>a.min-b.min);
    for (const t of sorted) { if (t.min > total) return t; }
    return null;
  }
  function fmtMoney(n) {
    n = Number(n) || 0;
    return '$' + n.toLocaleString('en-US');
  }

  // ----- Seed earnings for a verified account if not present (demo data so the feature is alive) -----
  function ensureEarnings() {
    const s = VVE.get();
    if (s.stage !== 'verified') return null;
    if (s.earnings && s.earnings.history) return s.earnings;
    const isSeller = (s.role === 'architect');
    // seeded demo history
    const sellerHistory = [
      { id:'VVE-2207', title:'B2B compliance SaaS · vertical model', counterparty:'Meridian Capital', date:'May 2026', amount:18500, status:'Released', type:'earned' },
      { id:'VVE-1984', title:'D2C ayurveda operations blueprint', counterparty:'Anand Ventures', date:'Apr 2026', amount:9200, status:'Released', type:'earned' },
      { id:'VVE-1822', title:'Logistics automation system', counterparty:'TrueNorth Holdings', date:'Mar 2026', amount:6400, status:'Released', type:'earned' }
    ];
    const buyerHistory = [
      { id:'VVE-2310', title:'AI workflow agency · execution model', counterparty:'Listed by R. Mehta', date:'May 2026', amount:12000, status:'Engaged', type:'deployed' },
      { id:'VVE-2055', title:'Subscription box financial model', counterparty:'Listed by S. Kapoor', date:'Apr 2026', amount:4800, status:'Closed', type:'deployed' }
    ];
    const history = isSeller ? sellerHistory : buyerHistory;
    const total = history.reduce((a,h)=>a + h.amount, 0);
    const escrow = isSeller ? 7400 : 0;
    const available = isSeller ? Math.max(0, total - escrow) : 0;
    const earnings = { role: s.role, total, escrow, available, deals: history.length, history };
    VVE.set({ earnings });
    return earnings;
  }

  // ----- Account UI in the nav (status pill + verified dropdown) -----
  function renderAccountUI() {
    const s = VVE.get();
    document.querySelectorAll('.nav-account-pill').forEach(pill => {
      let label, cls, route;
      if (s.stage === 'verified') { label = (s.name ? s.name.split(' ')[0] : 'Account') + ' · Verified'; cls = 'verified'; route = 'profile'; }
      else if (s.stage === 'applied') { label = 'Verify identity'; cls = 'applied'; route = 'verify'; }
      else { label = 'Apply for access'; cls = 'guest'; route = 'apply'; }
      pill.textContent = label;
      pill.className = 'nav-account-pill ' + cls;
      pill.setAttribute('data-route', route);
      pill.setAttribute('href', '#' + route);
      // verified users get a dropdown instead of a direct route
      pill.dataset.menu = (s.stage === 'verified') ? '1' : '0';
    });
    // build / sync the account menu
    let menu = document.getElementById('vveAccountMenu');
    if (s.stage === 'verified') {
      if (!menu) {
        menu = document.createElement('div');
        menu.id = 'vveAccountMenu';
        menu.className = 'vve-account-menu';
        document.body.appendChild(menu);
      }
      const firstName = s.name ? s.name.split(' ')[0] : 'Account';
      const tier = (s.earnings && s.earnings.history) ? tierFor(s.earnings.total) : tierFor(0);
      menu.innerHTML =
        '<div class="vam-head"><span class="vam-name">'+ (s.name||'Your account') +'</span><span class="vam-tier tier-'+tier.cls+'">'+tier.name+' tier</span></div>'
        + '<a href="#profile" data-route="profile" class="vam-item"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></svg>My profile</a>'
        + '<a href="#earnings" data-route="earnings" class="vam-item"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Earnings &amp; history</a>'
        + '<a href="#settings" data-route="settings" class="vam-item"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Account settings</a>'
        + '<div class="vam-divider"></div>'
        + '<button class="vam-item vam-logout" id="vveLogoutBtn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Log out</button>';
      // wire menu item routing + logout
      menu.querySelectorAll('a[data-route]').forEach(a => a.addEventListener('click', (e) => { closeAccountMenu(); }));
      const lo = menu.querySelector('#vveLogoutBtn');
      if (lo) lo.addEventListener('click', () => { closeAccountMenu(); VVE.reset(); showGateToast('You have been logged out.'); setTimeout(()=>{ location.hash='home'; }, 600); });
    } else if (menu) {
      menu.remove();
    }
  }

  function positionAccountMenu(pill) {
    const menu = document.getElementById('vveAccountMenu');
    if (!menu) return;
    const r = pill.getBoundingClientRect();
    menu.style.top = (r.bottom + 8) + 'px';
    menu.style.right = (window.innerWidth - r.right) + 'px';
  }
  function openAccountMenu(pill) { const m = document.getElementById('vveAccountMenu'); if (m) { positionAccountMenu(pill); m.classList.add('open'); } }
  function closeAccountMenu() { const m = document.getElementById('vveAccountMenu'); if (m) m.classList.remove('open'); }

  // pill click: verified -> toggle menu; else route normally
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.nav-account-pill');
    if (pill && pill.dataset.menu === '1') {
      e.preventDefault();
      const m = document.getElementById('vveAccountMenu');
      if (m && m.classList.contains('open')) closeAccountMenu(); else openAccountMenu(pill);
      return;
    }
    // click outside closes menu
    if (!e.target.closest('#vveAccountMenu')) closeAccountMenu();
  });

  // ----- Verification gate: call before any action requiring a verified account -----
  // Returns true if allowed; otherwise routes the user to the right place and returns false.
  function requireVerified(actionLabel) {
    const s = VVE.get();
    if (s.stage === 'verified') return true;
    showGateToast(s.stage === 'applied'
      ? 'Verify your identity to ' + actionLabel + '. Redirecting to verification…'
      : 'Apply for access and verify your identity to ' + actionLabel + '. Redirecting…');
    setTimeout(() => { location.hash = (s.stage === 'applied') ? 'verify' : 'apply'; }, 1400);
    return false;
  }

  // ----- Lightweight toast for gate messages -----
  let gateToastTimer = null;
  function showGateToast(msg) {
    let t = document.getElementById('vveGateToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'vveGateToast';
      t.className = 'vve-gate-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>' + msg + '</span>';
    t.classList.add('show');
    clearTimeout(gateToastTimer);
    gateToastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  
  function showPage(route, anchor) {
    if (!VALID_ROUTES.includes(route)) route = 'home';
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show the target
    const targetPage = document.querySelector(`.page[data-page="${route}"]`);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Update nav active states
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.route === route && !a.dataset.anchor) {
        a.classList.add('active');
      }
    });
    
    // Update ticker
    updateTicker(route);

    // Keep account pill in sync
    renderAccountUI();
    
    // Re-observe any reveal elements on the now-visible page
    if (targetPage) {
      observeReveals(targetPage);
      // Safety net: force-reveal anything still hidden after the page is shown
      // (covers the display:none -> display:block IntersectionObserver race)
      setTimeout(() => {
        targetPage.querySelectorAll('.reveal:not(.in)').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 200) el.classList.add('in');
        });
      }, 220);
    }
    
    // Run page-specific init
    if (pageInits[route]) {
      try { pageInits[route](targetPage); } catch (e) { console.warn('Page init error:', e); }
    }
    // Apply composed listing data (from architect composer) on every listing visit
    if (route === 'listing' && typeof applyComposedListing === 'function') {
      try { applyComposedListing(targetPage); } catch (e) { console.warn('Composed apply error:', e); }
    }
    // If buyer committed on purchase page, show engagement view
    if (route === 'listing' && typeof applyCommittedEngagement === 'function') {
      try { applyCommittedEngagement(targetPage); } catch (e) { console.warn('Engagement apply error:', e); }
    }
    
    // Scroll to top or anchor
    if (anchor) {
      const el = targetPage && targetPage.querySelector(`[id="${anchor}"], .${anchor}-section`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  
  function parseRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [route, ...anchorParts] = hash.split('/');
    return {
      route: route || 'home',
      anchor: anchorParts.join('/') || null
    };
  }
  
  // ===== Click handler for route links =====
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (!link) return;
    const route = link.dataset.route;
    const anchor = link.dataset.anchor;
    if (route && VALID_ROUTES.includes(route)) {
      e.preventDefault();
      const newHash = anchor ? `${route}/${anchor}` : route;
      if (window.location.hash !== `#${newHash}`) {
        window.location.hash = newHash;
      } else {
        // Same hash - manually trigger
        showPage(route, anchor);
      }
    }
  });
  
  // ===== Listen for hash changes =====
  window.addEventListener('hashchange', () => {
    const { route, anchor } = parseRoute();
    showPage(route, anchor);
  });
  
  // ===== Page-specific init functions =====
  const pageInits = {};
  const pageInitDone = {};

  // ===== Page init: home =====
  pageInits['home'] = function(scope) {
    if (pageInitDone['home']) {
      // On subsequent activations, just re-run reveal observer
      return;
    }
    pageInitDone['home'] = true;
    
    try {

  // ===== THEME TOGGLE =====
  // Theme toggle handled by shared global handler

  // reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 + i * 80));
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // HERO CANVAS (theme-aware)
  (function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    const nodes = [];
    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr); w = rect.width; h = rect.height;
    }
    window.addEventListener('resize', () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize(); nodes.length = 0; init(); });
    resize();
    function init() {
      for (let i = 0; i < 38; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, r: Math.random() * 1.2 + 0.6 });
    }
    init();
    function tick() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const lineColor = isDark ? '242, 237, 228' : '10, 9, 8';
      const dotColor = isDark ? 'rgba(244, 169, 130, 0.55)' : 'rgba(226, 87, 27, 0.45)';
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]; const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(${lineColor}, ${(1 - d / 140) * 0.12})`;
            ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.fillStyle = dotColor;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // TICKER
  (function() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const items = [
      { code: 'VVE-2440', text: 'B2B media · subscription play, US', delta: '+12%' },
      { code: 'VVE-2441', text: 'Specialty logistics · SEA', delta: '+8%' },
      { code: 'VVE-2442', text: 'Vertical AI · legal ops, India', delta: '+24%' },
      { code: 'VVE-2443', text: 'Healthtech · diagnostics, India', delta: '+6%' },
      { code: 'VVE-2438', text: 'D2C ayurveda · UNLOCKED', delta: 'Closed' },
      { code: 'VVE-2429', text: 'Creator marketplace · listed', delta: '+18%' },
      { code: 'VVE-2436', text: 'AI agent · 3 new buyer requests', delta: '+14%' },
      { code: 'VVE-2425', text: 'Climate · industrial monitoring', delta: '+9%' },
      { code: 'VVE-2434', text: 'SMB lending · validated', delta: '+22%' },
      { code: 'VVE-2412', text: 'Niche marketplace · DEAL CLOSED', delta: '$5.2k' },
    ];
    const html = items.map(it => `<span class="ticker-item"><span class="code">${it.code}</span><span>${it.text}</span><span class="up">${it.delta}</span><span class="sep"></span></span>`).join('');
    track.innerHTML = html + html;
  })();

  // DASHBOARD TAPE
  (function() {
    const tape = document.getElementById('tape-track');
    if (!tape) return;
    const items = [
      { code: 'VVE-2438', text: 'D2C ayurveda', delta: 'UNLOCKED' },
      { code: 'VVE-2437', text: 'B2B compliance SaaS', delta: '+12%' },
      { code: 'VVE-2440', text: 'B2B media · new listing', delta: 'LIVE' },
      { code: 'VVE-2436', text: 'AI agent · vertical ops', delta: '+8%' },
      { code: 'VVE-2435', text: 'Edtech · MEA reskill', delta: 'PENDING' },
      { code: 'VVE-2434', text: 'SMB lending tier-2', delta: '+22%' },
      { code: 'VVE-2429', text: 'Creator marketplace', delta: 'LIVE' },
      { code: 'VVE-2432', text: 'Climate industrial', delta: '+14%' },
    ];
    const html = items.map(it => `<span class="tape-item"><span class="code">${it.code}</span><span>${it.text}</span><span class="up">${it.delta}</span><span class="sep"></span></span>`).join('');
    tape.innerHTML = html + html;
  })();

  // INDEX BAR
  (function() {
    let idx = 1847, live = 184, cap = 42, arch = 247, deals = 37;
    const elIx = document.getElementById('ix-index');
    const elIxD = document.getElementById('ix-index-d');
    const elLive = document.getElementById('ix-live');
    const elLiveD = document.getElementById('ix-live-d');
    const elCap = document.getElementById('ix-cap');
    const elArch = document.getElementById('ix-arch');
    const elArchD = document.getElementById('ix-arch-d');
    const elDeals = document.getElementById('ix-deals');
    function tickCell(el) { if (!el) return; el.classList.add('tick'); setTimeout(() => el.classList.remove('tick'), 600); }
    setInterval(() => {
      const drift = Math.round((Math.random() - 0.3) * 8);
      idx += drift;
      elIx.innerText = idx.toLocaleString();
      const change = idx - 1819;
      const pct = ((change / 1819) * 100).toFixed(1);
      elIxD.innerHTML = `↑ +${change} (+${pct}%)`;
      tickCell(elIx);
      if (Math.random() > 0.5) {
        live += 1; elLive.innerText = live;
        elLiveD.innerHTML = `↑ +${live - 172} today`;
        tickCell(elLive);
        const sl = document.getElementById('side-live'); if (sl) sl.innerText = live;
        const bc = document.getElementById('browse-count'); if (bc) bc.innerText = live;
        const pc = document.getElementById('preview-count'); if (pc) pc.innerText = `${live} active · sorted by depth`;
      }
      if (Math.random() > 0.7) {
        cap += 0.2; elCap.innerText = `$${cap.toFixed(1)}M`; tickCell(elCap);
        const ca = document.getElementById('cap-aside'); if (ca) ca.innerText = `$${Math.round(cap)}M`;
      }
      if (Math.random() > 0.8) { arch += 1; elArch.innerText = arch; elArchD.innerHTML = `↑ +${arch - 239} this wk`; tickCell(elArch); }
      if (Math.random() > 0.85) { deals += 1; elDeals.innerText = deals; tickCell(elDeals); }
    }, 4500);
  })();

  // BARS
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const rows = e.target.querySelectorAll('.bar-wrap');
        rows.forEach((r, i) => setTimeout(() => r.classList.add('in'), i * 70));
        barIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.bars-card').forEach(el => barIO.observe(el));

  // PULSE
  (function() {
    const grid = document.getElementById('pulse-grid');
    if (!grid) return;
    const sectors = [
      { name: 'AI Agents', count: 29, dir: 'up', delta: 24 },
      { name: 'RegTech', count: 18, dir: 'up', delta: 26 },
      { name: 'B2B SaaS', count: 42, dir: 'up', delta: 22 },
      { name: 'Climate Tech', count: 11, dir: 'up', delta: 18 },
      { name: 'Workflow AI', count: 18, dir: 'up', delta: 16 },
      { name: 'Healthtech', count: 14, dir: 'up', delta: 12 },
      { name: 'Crypto / Web3', count: 6, dir: 'down', delta: -8 },
      { name: 'Web3 Gaming', count: 3, dir: 'down', delta: -18 },
    ];
    const POINTS = 20;
    const series = sectors.map(s => {
      const arr = []; let v = 50 + Math.random() * 20;
      for (let i = 0; i < POINTS; i++) { v += (Math.random() - 0.5) * 8; v = Math.max(20, Math.min(90, v)); arr.push(v); }
      if (s.dir === 'up') arr[arr.length - 1] = Math.max(arr[arr.length - 1], arr[0] + 8);
      else arr[arr.length - 1] = Math.min(arr[arr.length - 1], arr[0] - 5);
      return arr;
    });
    function buildPath(arr) {
      const W = 200, H = 36; const max = Math.max(...arr), min = Math.min(...arr); const range = max - min || 1;
      return arr.map((v, i) => { const x = (i / (arr.length - 1)) * W; const y = H - ((v - min) / range) * (H - 4) - 2; return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
    }
    function buildArea(arr) { return buildPath(arr) + ` L 200 36 L 0 36 Z`; }
    sectors.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'pulse-card';
      card.innerHTML = `
        <div class="row"><span class="name">${s.name}</span><span class="count" id="pulse-count-${idx}">${s.count}</span></div>
        <div class="spark"><svg viewBox="0 0 200 36" preserveAspectRatio="none"><path class="area" id="spark-area-${idx}" d="${buildArea(series[idx])}"/><path id="spark-path-${idx}" d="${buildPath(series[idx])}"/></svg></div>
        <div class="row"><span class="delta ${s.dir}">${s.delta > 0 ? '↑' : '↓'} ${Math.abs(s.delta)}% · 7d</span><span style="font-size:.65rem;color:var(--text-faint);font-family:'JetBrains Mono',monospace;">LIVE</span></div>
      `;
      grid.appendChild(card);
    });
    setInterval(() => {
      sectors.forEach((s, idx) => {
        const arr = series[idx]; arr.shift();
        let next = arr[arr.length - 1] + (Math.random() - 0.45) * 8;
        next = Math.max(20, Math.min(90, next)); arr.push(next);
        const path = document.getElementById(`spark-path-${idx}`);
        const area = document.getElementById(`spark-area-${idx}`);
        if (path) path.setAttribute('d', buildPath(arr));
        if (area) area.setAttribute('d', buildArea(arr));
        if (Math.random() > 0.7) {
          const cEl = document.getElementById(`pulse-count-${idx}`);
          if (cEl) { const dir = Math.random() > 0.3 ? 1 : -1; const newCount = Math.max(1, s.count + dir); s.count = newCount; cEl.innerText = newCount; }
        }
      });
    }, 2500);
  })();

  // MINI CHART
  (function() {
    const svg = document.getElementById('mini-svg');
    if (!svg) return;
    const path = svg.querySelector('.live-path');
    const area = svg.querySelector('.live-area');
    const W = 240, H = 60; const POINTS = 14;
    let arr = []; let v = 30;
    for (let i = 0; i < POINTS; i++) { v += (Math.random() - 0.4) * 6; v = Math.max(8, Math.min(54, v)); arr.push(v); }
    function build() {
      const p = arr.map((y, i) => { const x = (i / (arr.length - 1)) * W; return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(H - y).toFixed(1)}`; }).join(' ');
      path.setAttribute('d', p);
      area.setAttribute('d', p + ` L ${W} ${H} L 0 ${H} Z`);
    }
    build();
    setInterval(() => {
      arr.shift();
      let next = arr[arr.length - 1] + (Math.random() - 0.35) * 5;
      next = Math.max(8, Math.min(54, next)); arr.push(next); build();
    }, 2200);
  })();

  // DEMAND
  const dsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.ds-bar').forEach((b, i) => setTimeout(() => b.classList.add('in'), i * 60));
        dsIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const dsRows = document.getElementById('ds-rows');
  if (dsRows) dsIO.observe(dsRows);

  // GAUGE
  const gaugeIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); gaugeIO.unobserve(e.target); } });
  }, { threshold: 0.3 });
  const gauge = document.getElementById('gauge');
  if (gauge) gaugeIO.observe(gauge);

  // INVESTOR FEED
  (function() {
    const feed = document.getElementById('investor-feed');
    if (!feed) return;
    const acts = [
      { role: 'PE Director', action: 'unlocked', code: 'VVE-2438', sector: 'D2C Ayurveda' },
      { role: 'Family Office', action: 'requested access to', code: 'VVE-2436', sector: 'AI Workflow' },
      { role: 'VC Partner', action: 'unlocked', code: 'VVE-2434', sector: 'Fintech SMB' },
      { role: 'Operator-Investor', action: 'closed deal on', code: 'VVE-2425', sector: 'Climate Ind.' },
      { role: 'Strategic Buyer', action: 'requested access to', code: 'VVE-2437', sector: 'B2B SaaS' },
      { role: 'Founder', action: 'unlocked', code: 'VVE-2432', sector: 'Climate Industry' },
    ];
    function row(a) {
      const d = document.createElement('div');
      d.style.cssText = 'display:grid;grid-template-columns:1fr auto;gap:.85rem;align-items:center;padding:.55rem 0;border-bottom:1px solid var(--section-dark-line);font-size:.82rem;';
      d.innerHTML = `<div style="display:flex;flex-direction:column;gap:.1rem;"><span style="color:var(--section-dark-text);"><span style="color:var(--role);">${a.role}</span> ${a.action} <span style="font-family:'JetBrains Mono',monospace;color:var(--role);">${a.code}</span></span><span style="font-size:.65rem;color:var(--section-dark-text-faint);letter-spacing:.04em;font-family:'JetBrains Mono',monospace;">${a.sector} · just now</span></div><span class="live-dot" style="color:var(--section-dark-text-muted);"></span>`;
      return d;
    }
    acts.slice(0, 4).forEach(a => feed.appendChild(row(a)));
    let idx = 4;
    setInterval(() => {
      const a = acts[idx % acts.length]; idx++;
      const r = row(a);
      r.style.opacity = '0'; r.style.transform = 'translateY(-8px)';
      r.style.transition = 'opacity .5s, transform .5s';
      feed.insertBefore(r, feed.firstChild);
      requestAnimationFrame(() => { r.style.opacity = '1'; r.style.transform = 'translateY(0)'; });
      if (feed.children.length > 4) feed.removeChild(feed.lastChild);
    }, 5500);
  })();

  // FEED in dashboard
  (function() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const samples = [
      { code: 'VVE-2440', title: 'Niche B2B media · subscription, US', meta: '108 pages · 7 frameworks · 4 fin models', price: '$3,900', status: 'live' },
      { code: 'VVE-2441', title: 'Specialty logistics · cross-border, SEA', meta: '124 pages · 9 frameworks · 5 fin models', price: '$5,100', status: 'live' },
      { code: 'VVE-2442', title: 'Vertical AI · legal ops, India', meta: '96 pages · 6 frameworks · 3 fin models', price: '$3,400', status: 'pending' },
      { code: 'VVE-2443', title: 'Healthtech · diagnostics, India', meta: '142 pages · 11 frameworks · 6 fin models', price: '$6,800', status: 'live' },
      { code: 'VVE-2444', title: 'Creator marketplace · niche', meta: '88 pages · 5 frameworks · 3 fin models', price: '$2,800', status: 'live' },
      { code: 'VVE-2445', title: 'Climate · carbon accounting, EU', meta: '116 pages · 8 frameworks · 4 fin models', price: '$4,600', status: 'locked' },
    ];
    let idx = 0;
    setInterval(() => {
      const s = samples[idx % samples.length]; idx++;
      const row = document.createElement('div');
      row.className = 'feed-row new';
      row.innerHTML = `<span class="feed-code">${s.code}</span><div class="feed-info"><span class="feed-title">${s.title}</span><span class="feed-meta">${s.meta}</span></div><span class="feed-price">${s.price}</span><span class="feed-status ${s.status}"></span>`;
      feed.insertBefore(row, feed.firstChild);
      setTimeout(() => row.classList.remove('new'), 800);
      if (feed.children.length > 4) feed.removeChild(feed.lastChild);
      const ta = document.getElementById('today-act');
      if (ta) { const cur = parseInt(ta.innerText.replace(/\D/g, ''), 10) || 0; ta.innerText = `+${cur + 1}`; }
    }, 4200);
  })();

    } catch (err) {
      console.warn('Init error for home:', err);
    }
  };

  // ===== Page init: dashboard =====
  pageInits['dashboard'] = function(scope) {
    if (pageInitDone['dashboard']) {
      // On subsequent activations, just re-run reveal observer
      return;
    }
    pageInitDone['dashboard'] = true;
    
    try {

  // ===== WHAT SHOULD I LIST? recommender =====
  (function(){
    const module = scope.querySelector('#whatToListModule');
    if (!module) return;
    // category dataset: demand, supply, avg unlock, clear days, build cost, domain
    const CATS = [
      { name:'RegTech · mid-market compliance', demand:84, supply:18, unlock:6200, clear:12, cost:'mid', domain:'ops' },
      { name:'AI agents · vertical operations', demand:92, supply:32, unlock:7800, clear:8, cost:'mid', domain:'tech' },
      { name:'Healthtech · diagnostics workflow', demand:74, supply:28, unlock:5400, clear:15, cost:'heavy', domain:'tech' },
      { name:'Climate · industrial efficiency', demand:68, supply:22, unlock:6900, clear:18, cost:'heavy', domain:'ops' },
      { name:'Fintech SMB · embedded lending', demand:62, supply:36, unlock:5800, clear:11, cost:'mid', domain:'ops' },
      { name:'D2C · subscription retention engine', demand:71, supply:41, unlock:3900, clear:9, cost:'lean', domain:'consumer' },
      { name:'B2B SaaS · onboarding automation', demand:79, supply:35, unlock:4600, clear:10, cost:'lean', domain:'tech' },
      { name:'Creator economy · monetization ops', demand:58, supply:26, unlock:3200, clear:13, cost:'lean', domain:'consumer' },
      { name:'Logistics · last-mile optimization', demand:66, supply:24, unlock:6100, clear:14, cost:'mid', domain:'ops' },
      { name:'Insurtech · claims automation', demand:70, supply:20, unlock:7200, clear:12, cost:'heavy', domain:'tech' }
    ];

    const state = { capital:'lean', speed:'fast', domain:'any' };

    function score(c) {
      const gap = c.demand - c.supply;              // core opportunity
      let s = gap * 1.2 + c.demand * 0.4;
      // speed preference
      if (state.speed === 'fast') s += Math.max(0, (20 - c.clear)) * 2.2;
      else if (state.speed === 'value') s += (c.unlock / 1000) * 3.0;
      else s += Math.max(0, (20 - c.clear)) * 1.0 + (c.unlock/1000) * 1.2;
      // capital fit
      const order = { lean:1, mid:2, heavy:3 };
      const fitGap = Math.abs(order[state.capital] - order[c.cost]);
      s -= fitGap * 10;                              // penalize mismatch in build cost
      // domain preference
      if (state.domain !== 'any') s += (c.domain === state.domain) ? 16 : -6;
      return s;
    }
    function fitLabel(c) {
      const order = { lean:1, mid:2, heavy:3 };
      const fitGap = Math.abs(order[state.capital] - order[c.cost]);
      const domainOk = (state.domain === 'any' || c.domain === state.domain);
      return (fitGap === 0 && domainOk) ? { t:'Strong fit', c:'high' } : { t:'Good fit', c:'mid' };
    }

    function render() {
      const ranked = CATS.map(c => ({ c, s: score(c) })).sort((a,b)=>b.s-a.s).slice(0,4);
      const list = scope.querySelector('#wslResults');
      if (!list) return;
      list.innerHTML = ranked.map((r,i) => {
        const c = r.c; const gap = c.demand - c.supply; const fit = fitLabel(c);
        return '<div class="wsl-card" style="animation-delay:'+(i*0.05)+'s">'
          + '<div class="wsl-card-rank">0'+(i+1)+'</div>'
          + '<div class="wsl-card-main"><p class="wsl-card-name">'+c.name+'</p>'
          + '<div class="wsl-card-meta"><span>Demand <b>'+c.demand+'</b></span><span>Supply <b>'+c.supply+'</b></span><span>Avg unlock <b>$'+c.unlock.toLocaleString('en-US')+'</b></span><span>~<b>'+c.clear+'d</b> clear</span></div></div>'
          + '<div class="wsl-card-score"><span class="wsl-score-num">+'+gap+'</span><span class="wsl-score-lbl">demand gap</span><br><span class="wsl-fit '+fit.c+'">'+fit.t+'</span></div>'
          + '</div>';
      }).join('');
      const ctaText = scope.querySelector('#wslCtaText');
      if (ctaText && ranked[0]) ctaText.textContent = 'Top match: ' + ranked[0].c.name + '. Structure a 90+ page opportunity here and it clears fastest for your profile.';
    }

    module.querySelectorAll('.wsl-options').forEach(group => {
      const key = group.dataset.wsl;
      group.querySelectorAll('.wsl-opt').forEach(btn => btn.addEventListener('click', () => {
        group.querySelectorAll('.wsl-opt').forEach(b => b.classList.toggle('active', b===btn));
        state[key] = btn.dataset.val;
        render();
      }));
    });
    render();
  })();


  // THEME TOGGLE
  // Theme toggle handled by shared global handler

  // ROLE TOGGLE handled by shared global handler

  // REVEAL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('load', () => {
    document.querySelectorAll('.role-toggle-section .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 + i * 80));
  });

  // FUNNEL ANIMATION
  const funnelIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.funnel-stage').forEach((s, i) => setTimeout(() => s.classList.add('in'), i * 120));
      }
    });
  }, { threshold: 0.3 });
  const funnel = document.getElementById('funnel');
  if (funnel) funnelIO.observe(funnel);

  // REGION BAR ANIMATIONS
  ['region-bars-inv', 'region-bars-arc'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.region-bar').forEach((b, i) => setTimeout(() => b.classList.add('in'), i * 90));
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  // TICKER
  (function() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const items = [
      { code: 'VVE-2440', text: 'B2B media · subscription play', delta: '+12%' },
      { code: 'VVE-2441', text: 'Specialty logistics SEA', delta: '+8%' },
      { code: 'VVE-2442', text: 'Vertical AI · legal ops India', delta: '+24%' },
      { code: 'GAP', text: 'RegTech mid-market · 18 listings', delta: 'Surge' },
      { code: 'VVE-2438', text: 'D2C ayurveda · UNLOCKED', delta: 'Closed' },
      { code: 'BUYER', text: 'PE Director · AI workflow search', delta: 'Active' },
      { code: 'VVE-2436', text: 'AI agent · 3 new requests', delta: '+14%' },
      { code: 'GAP', text: 'AI Agents vertical · 60-pt gap', delta: 'Hot' },
    ];
    const html = items.map(it => `<span class="ticker-item"><span class="code">${it.code}</span><span>${it.text}</span><span class="up">${it.delta}</span><span class="sep"></span></span>`).join('');
    track.innerHTML = html + html;
  })();

  // LIVE METRICS
  (function() {
    let invL = 184, invA = 87, invW = 42, invAr = 247;
    let arcB = 87, arcS = 312, arcC = 37;
    function tick(el) { if (!el) return; el.classList.add('tick'); setTimeout(() => el.classList.remove('tick'), 600); }
    setInterval(() => {
      if (Math.random() > 0.5) { invL++; document.getElementById('inv-m1').innerText = invL; document.getElementById('inv-m1-d').innerText = `↑ +${invL-172} today`; tick(document.getElementById('inv-m1')); }
      if (Math.random() > 0.4) { invA += (Math.random() > 0.5 ? 1 : -1); invA = Math.max(80, Math.min(110, invA)); document.getElementById('inv-m2').innerText = invA; tick(document.getElementById('inv-m2')); }
      if (Math.random() > 0.7) { invW++; document.getElementById('inv-m3').innerText = invW; }
      if (Math.random() > 0.8) { invAr++; document.getElementById('inv-m4').innerText = invAr; }
      if (Math.random() > 0.4) { arcB += (Math.random() > 0.5 ? 1 : -1); arcB = Math.max(80, Math.min(110, arcB)); document.getElementById('arc-m1').innerText = arcB; }
      if (Math.random() > 0.3) { arcS += Math.round(Math.random() * 3); document.getElementById('arc-m2').innerText = arcS; }
      if (Math.random() > 0.85) { arcC++; document.getElementById('arc-m3').innerText = arcC; }
    }, 3800);
  })();

  // DEMAND CHART
  (function() {
    const W = 600, H = 320, POINTS = 30;
    let demand = [], supply = [];
    let dv = 60, sv = 30;
    for (let i = 0; i < POINTS; i++) {
      dv += (Math.random() - 0.45) * 12;
      sv += (Math.random() - 0.5) * 8;
      dv = Math.max(20, Math.min(95, dv));
      sv = Math.max(15, Math.min(75, sv));
      demand.push(dv); supply.push(sv);
    }
    function buildPath(arr) {
      return arr.map((v, i) => {
        const x = (i / (arr.length - 1)) * W;
        const y = H - (v / 100) * (H - 40) - 20;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(' ');
    }
    function buildArea(arr) {
      return buildPath(arr) + ` L ${W} ${H} L 0 ${H} Z`;
    }
    function update() {
      const dl = document.getElementById('demand-line'), da = document.getElementById('demand-area');
      const sl = document.getElementById('supply-line'), sa = document.getElementById('supply-area');
      if (!dl) return;
      dl.setAttribute('d', buildPath(demand));
      da.setAttribute('d', buildArea(demand));
      sl.setAttribute('d', buildPath(supply));
      sa.setAttribute('d', buildArea(supply));
    }
    update();
    setInterval(() => {
      demand.shift(); supply.shift();
      dv += (Math.random() - 0.4) * 10;
      sv += (Math.random() - 0.5) * 7;
      dv = Math.max(20, Math.min(95, dv));
      sv = Math.max(15, Math.min(75, sv));
      demand.push(dv); supply.push(sv);
      update();
    }, 2400);
  })();

  // HEATMAP
  (function() {
    const grid = document.getElementById('heatmap');
    if (!grid) return;
    const sectors = ['AI Compliance', 'RegTech', 'AI Agents', 'B2B SaaS', 'Climate Tech', 'Workflow AI', 'Healthtech', 'Fintech SMB', 'D2C Wellness', 'Edtech'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const corner = document.createElement('div');
    corner.className = 'heatmap-header';
    grid.appendChild(corner);
    days.forEach(d => {
      const c = document.createElement('div');
      c.className = 'heatmap-header';
      c.textContent = d;
      grid.appendChild(c);
    });
    sectors.forEach((sector, sIdx) => {
      const label = document.createElement('div');
      label.className = 'heatmap-row-label';
      label.textContent = sector;
      grid.appendChild(label);
      days.forEach((d, dIdx) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        const sectorWeight = sIdx < 4 ? 3 : sIdx < 7 ? 2 : 1;
        const dayWeight = dIdx < 5 ? 1.2 : 0.6;
        const raw = Math.random() * 4 + sectorWeight * dayWeight;
        const v = Math.min(5, Math.max(0, Math.round(raw)));
        cell.setAttribute('data-v', v);
        const counts = Math.round(raw * 20 + 5);
        cell.setAttribute('data-tooltip', `${sector} · ${d} · ${counts} signals`);
        if (v >= 3) cell.textContent = counts;
        grid.appendChild(cell);
      });
    });
  })();

  // LIVE DEAL FEED
  (function() {
    const feed = document.getElementById('deal-feed');
    if (!feed) return;
    const samples = [
      { code: 'VVE-2447', title: 'Niche B2B media · vertical newsletters', meta: '94p · 6 frameworks · ex-editor', price: '$3,400', status: 'live' },
      { code: 'VVE-2448', title: 'Specialty logistics · cold chain MENA', meta: '118p · 8 frameworks · ex-ops director', price: '$5,800', status: 'surge' },
      { code: 'VVE-2449', title: 'AI ops · vertical legal automation', meta: '102p · 7 frameworks · ex-counsel', price: '$4,200', status: 'live' },
      { code: 'VVE-2450', title: 'Climate · grid storage software', meta: '126p · 9 frameworks · ex-energy', price: '$5,400', status: 'surge' },
      { code: 'VVE-2451', title: 'Creator economy · niche B2B vertical', meta: '88p · 5 frameworks · operator', price: '$2,900', status: 'live' },
    ];
    let idx = 0;
    setInterval(() => {
      const s = samples[idx % samples.length]; idx++;
      const row = document.createElement('div');
      row.className = 'deal-row new';
      row.innerHTML = `<span class="deal-code">${s.code}</span><div class="deal-info"><span class="deal-title">${s.title}</span><span class="deal-meta">${s.meta}</span></div><span class="deal-price">${s.price}</span><span class="deal-status ${s.status}"></span>`;
      feed.insertBefore(row, feed.firstChild);
      setTimeout(() => row.classList.remove('new'), 800);
      if (feed.children.length > 8) feed.removeChild(feed.lastChild);
    }, 5800);
  })();

  // LIVE PEER ACTIVITY (INVESTOR)
  (function() {
    const feed = document.getElementById('peer-activity-inv');
    if (!feed) return;
    const samples = [
      { type: 'pe', role: 'PE Director', interest: 'Unlocked B2B SaaS · VVE-2437', badge: 'Senior', time: 'just now' },
      { type: 'vc', role: 'VC Partner', interest: 'Requested climate tech access', badge: 'Premium', time: '1m ago' },
      { type: 'fo', role: 'Family Office', interest: 'Closed healthtech · $6.8k', badge: 'Senior', time: '3m ago' },
      { type: 'sb', role: 'Strategic Buyer', interest: 'NDA signed · AI workflow', badge: 'Verified', time: '15m ago' },
    ];
    let idx = 0;
    setInterval(() => {
      const a = samples[idx % samples.length]; idx++;
      const row = document.createElement('div');
      row.className = 'looking-row';
      row.style.opacity = '0'; row.style.transform = 'translateY(-8px)';
      row.style.transition = 'opacity .5s, transform .5s';
      row.innerHTML = `<div class="avatar ${a.type}">${a.type.toUpperCase()}</div><div class="info"><span class="role">${a.role}</span><span class="interest">${a.interest}</span></div><span class="badge">${a.badge}</span><span class="time">${a.time}</span>`;
      feed.insertBefore(row, feed.firstChild);
      requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'translateY(0)'; });
      if (feed.children.length > 8) feed.removeChild(feed.lastChild);
    }, 6200);
  })();

  // LIVE LOOKING (ARCHITECT)
  (function() {
    const feed = document.getElementById('looking-arc');
    if (!feed) return;
    const samples = [
      { type: 'pe', role: 'PE Principal', interest: 'AI vertical compliance' },
      { type: 'vc', role: 'VC Partner', interest: 'B2B SaaS healthcare' },
      { type: 'sb', role: 'Strategic Buyer', interest: 'Tier 3: AI agents' },
      { type: 'fo', role: 'Family Office', interest: 'Workflow AI vertical' },
    ];
    let idx = 0;
    setInterval(() => {
      const s = samples[idx % samples.length]; idx++;
      const row = document.createElement('div');
      row.className = 'looking-row';
      row.style.opacity = '0'; row.style.transform = 'translateY(-8px)';
      row.style.transition = 'opacity .5s, transform .5s';
      row.innerHTML = `<div class="avatar ${s.type}">${s.type.toUpperCase()}</div><div class="info"><span class="role">${s.role}</span><span class="interest">${s.interest}</span></div><span class="time">just now</span>`;
      feed.insertBefore(row, feed.firstChild);
      requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'translateY(0)'; });
      if (feed.children.length > 8) feed.removeChild(feed.lastChild);
    }, 7200);
  })();

    } catch (err) {
      console.warn('Init error for dashboard:', err);
    }
  };

  // ===== Page init: trust =====
  pageInits['trust'] = function(scope) {
    if (pageInitDone['trust']) {
      // On subsequent activations, just re-run reveal observer
      return;
    }
    pageInitDone['trust'] = true;
    
    try {

  // Theme toggle handled by shared global handler

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 + i * 80));
  });

    } catch (err) {
      console.warn('Init error for trust:', err);
    }
  };

  // ===== Page init: playbook =====
  pageInits['playbook'] = function(scope) {
    if (pageInitDone['playbook']) {
      // On subsequent activations, just re-run reveal observer
      return;
    }
    pageInitDone['playbook'] = true;
    
    try {

  // THEME TOGGLE
  // Theme toggle handled by shared global handler

  // ROLE TOGGLE handled by shared global handler

  // REVEAL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 + i * 80));
  });

  // PROGRESS NAV - active state on scroll
  (function() {
    const steps = document.querySelectorAll('.prog-step');
    const chapters = document.querySelectorAll('.chapter');
    function updateActive() {
      let active = null;
      chapters.forEach(ch => {
        const r = ch.getBoundingClientRect();
        if (r.top < 200) active = ch.id;
      });
      steps.forEach(s => {
        s.classList.toggle('active', s.dataset.target === active);
      });
    }
    document.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    // smooth scroll on click
    steps.forEach(s => {
      s.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(s.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();

    } catch (err) {
      console.warn('Init error for playbook:', err);
    }
  };

  // ===== Page init: faq =====
  pageInits['faq'] = function(scope) {
    if (pageInitDone['faq']) {
      // On subsequent activations, just re-run reveal observer
      return;
    }
    pageInitDone['faq'] = true;
    
    try {

  // THEME TOGGLE
  // Theme toggle handled by shared global handler

  // REVEAL ANIMATIONS
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 + i * 80));
  });

  // FAQ ACCORDION
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // open this if it wasn't already
      if (!wasOpen) item.classList.add('open');
    });
  });

  // TAB SWITCHER
  const tabsWrap = document.getElementById('tabs-wrap');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tracks = {
    buyer: document.getElementById('track-buyer'),
    architect: document.getElementById('track-architect')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabsWrap.setAttribute('data-tab', target);
      Object.keys(tracks).forEach(k => tracks[k].classList.remove('active'));
      tracks[target].classList.add('active');
      // close all open items when switching
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // reset search
      const searchInput = document.getElementById('faq-search-input');
      if (searchInput.value) {
        searchInput.value = '';
        runSearch('');
      }
      // update count
      updateCount();
      // SYNC: also drive global role state so site-wide colour switches
      // (FAQ tab=buyer means site role=investor)
      const globalRole = (target === 'buyer') ? 'investor' : 'architect';
      const curGlobal = document.documentElement.getAttribute('data-role');
      if (curGlobal !== globalRole) {
        document.documentElement.setAttribute('data-role', globalRole);
        localStorage.setItem('vve-role', globalRole);
      }
    });
  });

  // SYNC: when external role-btn (nav) changes data-role, update FAQ tab too
  const _faqSyncObserver = new MutationObserver(() => {
    const role = document.documentElement.getAttribute('data-role');
    const wantedTab = (role === 'architect') ? 'architect' : 'buyer';
    const wantedBtn = document.querySelector(`.tab-btn[data-tab="${wantedTab}"]`);
    if (wantedBtn && !wantedBtn.classList.contains('active')) {
      wantedBtn.click();  // triggers the existing handler, keeping logic consistent
    }
  });
  _faqSyncObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-role'] });

  // Initial sync: align FAQ tab to current global data-role on page load
  (function alignInitial() {
    const role = document.documentElement.getAttribute('data-role');
    if (role === 'architect') {
      const archBtn = document.querySelector('.tab-btn[data-tab="architect"]');
      if (archBtn && !archBtn.classList.contains('active')) archBtn.click();
    }
  })();

  // SEARCH
  function runSearch(query) {
    query = query.toLowerCase().trim();
    const activeTrack = document.querySelector('.faq-track.active');
    const items = activeTrack.querySelectorAll('.faq-item');
    const categories = activeTrack.querySelectorAll('.faq-category');
    const noResults = document.getElementById('no-results');
    let matchCount = 0;

    if (!query) {
      items.forEach(item => item.style.display = '');
      categories.forEach(cat => cat.style.display = '');
      noResults.classList.remove('show');
      updateCount();
      return;
    }

    items.forEach(item => {
      const q = item.querySelector('.q-text').textContent.toLowerCase();
      const a = item.querySelector('.faq-a').textContent.toLowerCase();
      if (q.includes(query) || a.includes(query)) {
        item.style.display = '';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // hide categories with no visible items
    categories.forEach(cat => {
      const visibleItems = cat.querySelectorAll('.faq-item:not([style*="display: none"])');
      cat.style.display = visibleItems.length === 0 ? 'none' : '';
    });

    if (matchCount === 0) noResults.classList.add('show');
    else noResults.classList.remove('show');

    document.getElementById('faq-count').textContent = matchCount + (matchCount === 1 ? ' question' : ' questions');
  }

  function updateCount() {
    const activeTrack = document.querySelector('.faq-track.active');
    const total = activeTrack.querySelectorAll('.faq-item').length;
    document.getElementById('faq-count').textContent = total + ' questions';
  }

  document.getElementById('faq-search-input').addEventListener('input', (e) => runSearch(e.target.value));
  updateCount();

    } catch (err) {
      console.warn('Init error for faq:', err);
    }
  };

  // ===== Page init: pricing =====
  pageInits['pricing'] = function(scope) {
    if (pageInitDone['pricing']) return;
    pageInitDone['pricing'] = true;
    
    
// CALCULATOR
  (function() {
    const input = document.getElementById('calc-input');
    const slider = document.getElementById('calc-slider');
    const presets = document.querySelectorAll('.calc-preset');

    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

    function update(val) {
      const v = parseInt(val) || 10000;
      const safe = Math.max(500, Math.min(1000000, v));
      const capped = safe > 50000;
      // Toggle body class so CSS can hide $ signs that aren't part of dynamic spans
      document.body.classList.toggle('is-capped', capped);

      // Compute every value from the safe listed price
      const unlock = safe * 0.10;
      const remaining = safe - unlock;
      const opt1 = remaining;
      const opt2 = remaining * 0.70;
      const opt3 = remaining * 0.50;
      const arch_unlock = unlock * 0.90;
      const arch_opt1 = opt1 * 0.90;
      const arch_opt2 = opt2 * 0.90;
      const arch_opt3 = opt3 * 0.90;
      const arch_best = arch_unlock + arch_opt1;
      const buyer_opt1 = unlock + opt1;
      const buyer_opt2 = unlock + opt2;
      const buyer_opt3 = unlock + opt3;
      const arch_opt1_total = arch_unlock + arch_opt1;
      const arch_opt2_total = arch_unlock + arch_opt2;
      const arch_opt3_total = arch_unlock + arch_opt3;

      // Display helpers
      // disp(amount, pctOfListed) — show $amount normally, or pctOfListed% when capped
      // dispListed() — show $listed normally, or "50K+" when capped (no clean % for the input)
      function disp(amount, pctOfListed) {
        if (capped) return pctOfListed + '%';
        return '$' + fmt(amount);
      }
      function dispListed() {
        if (capped) return '50K+';
        return '$' + fmt(safe);
      }

      // ===== CALCULATOR RESULTS =====
      // unlock = 10% of listed
      setText('r-unlock', disp(unlock, '10'));
      // arch_best = 90% of listed (90% of unlock + 90% of 100% of remaining)
      setText('r-best', disp(arch_best, '90'));
      // buyer_opt1 = 100% of listed (full price)
      setText('r-opt1-b', disp(buyer_opt1, '100'));
      // buyer_opt2 = 73% of listed (10% unlock + 63% of listed for guidance)
      setText('r-opt2-b', disp(buyer_opt2, '70'));
      // buyer_opt3 = 55% of listed (10% unlock + 45% for docs only)
      setText('r-opt3-b', disp(buyer_opt3, '50'));
      // arch_opt1_total = 90% of listed
      setText('r-opt1-a', disp(arch_opt1_total, '90'));
      // arch_opt2_total = 65.7% rounded to 66% of listed
      setText('r-opt2-a', disp(arch_opt2_total, '63'));
      // arch_opt3_total = 49.5% rounded to 50% of listed
      setText('r-opt3-a', disp(arch_opt3_total, '45'));

      // ===== OPTION CARD FOOTERS (same math as calc) =====
      setText('card1-buyer', disp(buyer_opt1, '100'));
      setText('card2-buyer', disp(buyer_opt2, '70'));
      setText('card3-buyer', disp(buyer_opt3, '50'));
      setText('card1-arch', disp(arch_opt1_total, '90'));
      setText('card2-arch', disp(arch_opt2_total, '63'));
      setText('card3-arch', disp(arch_opt3_total, '45'));

      // ===== "Based on $X listed price" =====
      setText('based-on-price', dispListed());

      // ===== MONEY FLOW DIAGRAM (buyer view) =====
      setText('flow-buyer-unlock', disp(unlock, '10'));
      setText('flow-buyer-listed', dispListed());
      setText('flow-buyer-escrow', disp(unlock, '10'));
      // Range floor: Documents Only path = 0.45 * listed = 45% of listed
      setText('flow-buyer-min', disp(opt3, '50'));
      // Range ceiling: Full Partnership remaining = 0.90 * listed = 90% of listed
      setText('flow-buyer-max', disp(opt1, '100'));

      // ===== MONEY FLOW DIAGRAM (architect view) =====
      setText('flow-arch-buyer', dispListed());
      setText('flow-arch-escrow', dispListed());
      // Architect receives 90% of listed
      setText('flow-arch-receive', disp(safe * 0.90, '90'));

      // ===== FLOW SECTION HEADER =====
      setText('flow-head-buyer', dispListed());
      setText('flow-head-arch', dispListed());

      // ===== CALCULATOR ARCHITECT PRIMARY DESCRIPTION =====
      // arch_unlock = 9% of listed (90% of 10%)
      setText('calc-arch-unlock-earn', disp(arch_unlock, '9'));
      // arch_opt1 = 81% of listed (90% of 90% of listed remaining)
      setText('calc-arch-exec-earn', disp(arch_opt1, '81'));

      // ===== DISPUTE SCENARIOS =====
      // The dispute uses "remaining" (90% of listed) as the deal amount
      // Then splits within remaining:
      //   commission = 10% of remaining = 9% of listed
      //   architect earn = 90% of remaining = 81% of listed
      //   60/40 splits of architect's portion = 48.6% / 32.4% of listed
      const disputeCommission = remaining * 0.10;
      const disputeArchEarn = remaining * 0.90;
      const disputeWin60 = disputeArchEarn * 0.60;
      const disputeLose40 = disputeArchEarn * 0.40;

      // dispute-deal-amount = remaining = 90% of listed
      setText('dispute-deal-amount', disp(remaining, '90'));

      // Scenario 1: clean
      setText('d1-comm', disp(disputeCommission, '9'));
      setText('d1-arch', disp(disputeArchEarn, '81'));
      setText('d1-total', dispListed());

      // Scenario 2: architect ghosts
      setText('d2-comm', disp(disputeCommission, '9'));
      setText('d2-refund', disp(disputeArchEarn, '81'));

      // Scenario 3: buyer wins 60%
      setText('d3-comm', disp(disputeCommission, '9'));
      // 48.6% rounded to 49%
      setText('d3-buyer60', disp(disputeWin60, '49'));
      // 32.4% rounded to 32%
      setText('d3-arch40', disp(disputeLose40, '32'));

      // Scenario 4: architect wins 60%
      setText('d4-comm', disp(disputeCommission, '9'));
      setText('d4-arch60', disp(disputeWin60, '49'));
      setText('d4-buyer40', disp(disputeLose40, '32'));

      // ===== BENEFIT CARDS =====
      setText('ben-buyer-unlock', disp(unlock, '10'));
      setText('ben-buyer-listed', dispListed());
      setText('ben-arch-listed', dispListed());
      setText('ben-arch-takehome', disp(safe * 0.90, '90'));
      setText('ben-arch-unlock-earn', disp(arch_unlock, '9'));

      // ===== SLIDER + PRESETS =====
      if (safe <= 50000) {
        slider.value = safe;
      } else {
        slider.value = 50000;
      }
      presets.forEach(p => p.classList.toggle('active', parseInt(p.dataset.val) === safe));
    }

    // Helper: safely set textContent on an element if it exists
    function setText(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    input.addEventListener('input', e => update(e.target.value));
    slider.addEventListener('input', e => { input.value = e.target.value; update(e.target.value); });
    presets.forEach(p => {
      p.addEventListener('click', () => {
        input.value = p.dataset.val;
        update(p.dataset.val);
      });
    });
    update(10000);
  })();

// RULES ACCORDION
  document.querySelectorAll('.rule-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.rule-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  };


  // ===== Page init: about =====
  pageInits['about'] = function(scope) {
    if (pageInitDone['about']) return;
    pageInitDone['about'] = true;
    // About page has no interactive logic - all behaviour comes from
    // global reveal observer and global role/theme handlers
  };


function applyComposedListing(scope) {
      if (!composedListing) return;
      const d = composedListing;
      const set = (sel, val) => { const el = scope.querySelector(sel); if (el && val) el.textContent = val; };

      // Title + hook
      if (d.title) { const t = scope.querySelector('.listing-title'); if (t) t.textContent = d.title; }
      if (d.hook) { const h = scope.querySelector('.listing-hook'); if (h) h.textContent = d.hook; }

      // Industry tags in meta row
      if (d.tags) {
        const tagWrap = scope.querySelectorAll('.listing-industry');
        const tags = d.tags.split(',').map(s=>s.trim()).filter(Boolean);
        if (tagWrap[0] && tags[0]) tagWrap[0].textContent = tags[0];
        if (tagWrap[1]) tagWrap[1].textContent = tags[1] || '';
      }

      // Key stats
      const price = parseFloat(d.price)||0;
      const unlock = Math.round(price*0.10);
      const stats = scope.querySelectorAll('.lstat-v');
      if (stats[0] && price) stats[0].textContent = '$'+price.toLocaleString('en-US');
      if (stats[1] && unlock) stats[1].textContent = '$'+unlock.toLocaleString('en-US');
      if (stats[2] && d.timeline) stats[2].textContent = d.timeline;

      // Sidebar snapshot
      const snapVals = scope.querySelectorAll('.snap-val');
      if (snapVals[0] && d.stage) snapVals[0].textContent = d.stage;
      if (snapVals[1] && d.geography) snapVals[1].textContent = d.geography;
      if (snapVals[2] && d.capital) snapVals[2].textContent = d.capital;
      if (snapVals[3] && d.timeline) snapVals[3].textContent = d.timeline;
      if (snapVals[5] && d.monet) snapVals[5].textContent = d.monet;

      // Deep sections: render AI summary (free) + blurred glimpse of real text + unlock prompt
      const TEASER_PREVIEW_CHARS = 90;
      const sums = d.aiSummaryHTML || {};
      const fullMap = { 0:d.thesis, 1:d.problem, 2:d.gap, 3:d.model, 4:d.competitive, 5:d.risks };
      const sumMap  = { 0:sums.thesis, 1:sums.problem, 2:sums.gap, 3:sums.model, 4:sums.competitive, 5:sums.risks };
      const feeStr = unlock ? '$'+unlock.toLocaleString('en-US') : 'the unlock fee';

      function deepHTML(summaryHTML, full) {
        let html = '';
        if (summaryHTML) html += summaryHTML;
        if (full) {
          const clean = full.replace(/\s+/g,' ').trim();
          const vis = clean.slice(0, TEASER_PREVIEW_CHARS);
          const blur = clean.slice(TEASER_PREVIEW_CHARS, TEASER_PREVIEW_CHARS+260) || 'and continues in full detail behind the unlock';
          html += '<div style="background:var(--bg-bone);border-radius:8px;padding:.85rem 1rem;margin-top:.5rem;">'+
            '<span style="font-family:\'JetBrains Mono\',monospace;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint);display:block;margin-bottom:.4rem;">From the architect\u2019s full write-up</span>'+
            '<div style="font-size:.9rem;line-height:1.55;"><span>'+vis+'</span><span style="filter:blur(4px);user-select:none;color:var(--text-muted);"> '+blur+'</span></div>'+
            '<div style="margin-top:.65rem;"><span style="display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .8rem;background:var(--role-ghost);border:1px solid var(--role-faint);border-radius:100px;font-family:\'JetBrains Mono\',monospace;font-size:.66rem;color:var(--role);">\uD83D\uDD12 Pay '+feeStr+' to read the full section</span></div>'+
          '</div>';
        }
        return html;
      }

      const secEls = scope.querySelectorAll('.listing-section');
      secEls.forEach((sec, idx) => {
        if (fullMap[idx]) {
          const firstText = sec.querySelector('.ls-text');
          if (firstText) {
            // clear extra nodes in this section, keep the title
            sec.querySelectorAll('.ls-text:not(:first-of-type), .ls-quote, .ls-problem-grid, .ls-gap-bar, .ls-architect-card, .ls-engagement-grid, .ls-why-row').forEach(n => n.remove());
            firstText.outerHTML = deepHTML(sumMap[idx], fullMap[idx]);
          }
        }
      });

      // Document package -> render real architect file names as a visible table of contents
      const docs = (d.docs||'').split('\n').map(s=>s.trim()).filter(Boolean);
      const lockFee = scope.querySelector('#lockGateFee');
      if (lockFee && unlock) lockFee.textContent = '$'+unlock.toLocaleString('en-US');
      if (docs.length) {
        const listEl = scope.querySelector('#docPackageList');
        const titleEl = scope.querySelector('#lockGateTitle');
        if (titleEl) titleEl.textContent = 'The full package (' + docs.length + ' documents) unlocks after payment';
        if (listEl) {
          listEl.innerHTML = docs.map(function(name){
            // try to detect a file type in the name e.g. (PDF) (XLSX)
            var typeMatch = name.match(/\((PDF|XLSX|DOCX|CSV|PPTX|ZIP)\)/i);
            var type = typeMatch ? typeMatch[1].toUpperCase() : 'PDF';
            var clean = name.replace(/\s*\((PDF|XLSX|DOCX|CSV|PPTX|ZIP)\)\s*/i,'').trim();
            return '<div class="doc-pkg-row">'+
              '<span class="doc-pkg-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>'+
              '<span class="doc-pkg-name"></span>'+
              '<span class="doc-pkg-type">'+type+'</span>'+
              '<span class="doc-pkg-lock"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>'+
            '</div>';
          }).join('');
          // set names via textContent to avoid HTML injection
          var rows = listEl.querySelectorAll('.doc-pkg-name');
          docs.forEach(function(name, idx){
            var clean = name.replace(/\s*\((PDF|XLSX|DOCX|CSV|PPTX|ZIP)\)\s*/i,'').trim();
            if (rows[idx]) rows[idx].textContent = clean;
          });
        }
      }
    }

  // Show the engagement view on the listing if the buyer committed on the purchase page
  function applyCommittedEngagement(scope) {
    if (!window._ujCommitted) return;
    const journey = scope.querySelector('#unlockedJourney');
    const gate = scope.querySelector('.listing-lock-gate');
    const bottom = scope.querySelector('.listing-unlock-bottom');
    if (journey) journey.style.display = 'block';
    if (gate) gate.style.display = 'none';
    if (bottom) bottom.style.display = 'none';
    // rail to step 4
    scope.querySelectorAll('.uj-step').forEach(s => {
      const n = parseInt(s.dataset.ujstep, 10);
      s.classList.toggle('is-done', n < 4);
      s.classList.toggle('is-active', n === 4);
      const dot = s.querySelector('.uj-dot');
      dot.textContent = (n < 4) ? '✓' : n;
    });
    ['unlocked','path','commit','engage'].forEach(p => {
      const el = scope.querySelector('#ujPanel-'+p);
      if (el) el.style.display = (p === 'engage') ? 'block' : 'none';
    });
  }

  // ===== Page init: listing =====
  pageInits['listing'] = function(scope) {
    // --- If arriving from the composer with real data, render it over the demo ---

    if (pageInitDone['listing']) return;
    pageInitDone['listing'] = true;

    const root = document.getElementById('lstModalRoot');
    if (!root) return;

    const modals = {
      nda: document.getElementById('lstModalNda'),
      pay: document.getElementById('lstModalPay'),
      done: document.getElementById('lstModalDone'),
    };

    function showModal(which) {
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      Object.values(modals).forEach(m => m && m.classList.remove('is-active'));
      if (modals[which]) modals[which].classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      Object.values(modals).forEach(m => m && m.classList.remove('is-active'));
      document.body.style.overflow = '';
      // reset NDA consent for next time
      const consent = document.getElementById('ndaConsent');
      const contBtn = document.getElementById('ndaContinueBtn');
      if (consent) consent.checked = false;
      if (contBtn) contBtn.disabled = true;
    }

    // Open flow from either unlock button -> go to the dedicated purchase page (gated by verification)
    const openBtns = scope.querySelectorAll('.unlock-primary-btn, .unlock-mini-btn');
    openBtns.forEach(btn => btn.addEventListener('click', () => {
      if (!requireVerified('unlock this opportunity')) return;
      location.hash = 'purchase';
    }));

    // Close triggers (backdrop, X buttons, cancel/continue-browsing)
    root.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', (e) => {
        // allow dashboard link to navigate AND close
        if (el.getAttribute('href')) { closeModal(); return; }
        e.preventDefault();
        closeModal();
      });
    });

    // Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) closeModal();
    });

    // NDA consent gating
    const consent = document.getElementById('ndaConsent');
    const ndaContinue = document.getElementById('ndaContinueBtn');
    if (consent && ndaContinue) {
      consent.addEventListener('change', () => {
        ndaContinue.disabled = !consent.checked;
      });
      ndaContinue.addEventListener('click', () => {
        if (!consent.checked) return;
        showModal('pay');
      });
    }

    // Payment flow
    const payBack = document.getElementById('payBackBtn');
    const payConfirm = document.getElementById('payConfirmBtn');
    if (payBack) payBack.addEventListener('click', () => showModal('nda'));
    if (payConfirm) payConfirm.addEventListener('click', () => {
      // simulate payment processing
      payConfirm.textContent = 'Processing...';
      payConfirm.disabled = true;
      setTimeout(() => {
        closeModal();
        payConfirm.textContent = 'Confirm · $2,800';
        payConfirm.disabled = false;
        if (typeof enterUnlockedJourney === 'function') enterUnlockedJourney(scope);
      }, 900);
    });
  

    // ============ POST-UNLOCK JOURNEY STATE MACHINE ============
    const UNLOCK_FEE = 2800;
    const TOTAL_VALUE = 28000;
    let chosenRemaining = 25200;
    let chosenPathName = 'Full Partnership';
    let releasedTotal = 0;

    function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }

    function setRail(step) {
      scope.querySelectorAll('.uj-step').forEach(s => {
        const n = parseInt(s.dataset.ujstep, 10);
        s.classList.toggle('is-done', n < step);
        s.classList.toggle('is-active', n === step);
        const dot = s.querySelector('.uj-dot');
        if (n < step) dot.textContent = '✓';
        else dot.textContent = n;
      });
    }
    function showPanel(name) {
      ['unlocked','path','commit','engage'].forEach(p => {
        const el = scope.querySelector('#ujPanel-'+p);
        if (el) el.style.display = (p === name) ? 'block' : 'none';
      });
    }
    function updateMoney() {
      const esc = scope.querySelector('#ujmEscrow');
      const rem = scope.querySelector('#ujmRemaining');
      const rel = scope.querySelector('#ujmReleased');
      const inEscrow = (UNLOCK_FEE + (window._ujCommitted ? chosenRemaining : 0)) - releasedTotal;
      if (esc) esc.textContent = money(inEscrow);
      if (rem) rem.textContent = window._ujCommitted ? money(0) : money(chosenRemaining);
      if (rel) rel.textContent = money(releasedTotal);
    }

    window.enterUnlockedJourney = function(sc) {
      const journey = sc.querySelector('#unlockedJourney');
      const article = sc.querySelector('.listing-content');
      if (!journey) return;
      journey.style.display = 'block';
      // hide the lock gate + bottom CTA since they have paid
      const gate = sc.querySelector('.listing-lock-gate');
      const bottom = sc.querySelector('.listing-unlock-bottom');
      if (gate) gate.style.display = 'none';
      if (bottom) bottom.style.display = 'none';
      setRail(1); showPanel('unlocked'); updateMoney();
      journey.scrollIntoView({ behavior:'smooth', block:'start' });
    };

    // Navigation buttons
    const toPath = scope.querySelector('#ujToPathBtn');
    if (toPath) toPath.addEventListener('click', () => { setRail(2); showPanel('path'); });
    const backToUnlocked = scope.querySelector('#ujBackToUnlocked');
    if (backToUnlocked) backToUnlocked.addEventListener('click', () => { setRail(1); showPanel('unlocked'); });

    // Path selection
    let pathSelected = false;
    scope.querySelectorAll('.uj-path').forEach(label => {
      label.addEventListener('click', () => {
        const remaining = parseInt(label.dataset.remaining, 10);
        const name = label.querySelector('.uj-path-name').textContent;
        chosenRemaining = remaining; chosenPathName = name; pathSelected = true;
        const cont = scope.querySelector('#ujToCommitBtn');
        if (cont) cont.disabled = false;
        updateMoney();
      });
    });
    const toCommit = scope.querySelector('#ujToCommitBtn');
    if (toCommit) toCommit.addEventListener('click', () => {
      if (!pathSelected) return;
      // fill commit panel
      scope.querySelector('#ujCommitPathName').textContent = chosenPathName;
      scope.querySelector('#ujCommitPathLabel').textContent = chosenPathName + ' · remaining';
      scope.querySelector('#ujCommitRemaining').textContent = money(chosenRemaining);
      scope.querySelector('#ujCommitDue').textContent = money(chosenRemaining);
      scope.querySelector('#ujCommitTotal').textContent = money(UNLOCK_FEE + chosenRemaining);
      scope.querySelector('#ujCommitBtnAmt').textContent = money(chosenRemaining);
      setRail(3); showPanel('commit');
    });
    const backToPath = scope.querySelector('#ujBackToPath');
    if (backToPath) backToPath.addEventListener('click', () => { setRail(2); showPanel('path'); });

    // Commit payment
    const commitBtn = scope.querySelector('#ujCommitBtn');
    if (commitBtn) commitBtn.addEventListener('click', () => {
      commitBtn.textContent = 'Processing...'; commitBtn.disabled = true;
      setTimeout(() => {
        window._ujCommitted = true;
        // distribute remaining across 3 milestones
        const per = Math.round(chosenRemaining / 3);
        const amts = [per, per, chosenRemaining - per*2];
        scope.querySelectorAll('.uj-ms').forEach((ms, idx) => {
          const amtEl = ms.querySelector('.uj-ms-amt');
          if (amtEl) amtEl.textContent = money(amts[idx]);
          ms.dataset.amt = amts[idx];
        });
        scope.querySelector('#ujEngageNote').textContent = money(0)+' of '+money(chosenRemaining)+' released · '+money(chosenRemaining)+' protected in escrow';
        setRail(4); showPanel('engage'); updateMoney();
        scope.querySelector('#unlockedJourney').scrollIntoView({behavior:'smooth',block:'start'});
      }, 900);
    });

    // Milestone approvals (sequential unlock)
    scope.querySelectorAll('.uj-ms-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const n = parseInt(btn.dataset.msApprove, 10);
        const ms = scope.querySelector('.uj-ms[data-ms="'+n+'"]');
        const amt = parseInt(ms.dataset.amt || '0', 10);
        ms.classList.add('is-released');
        btn.textContent = 'Released ✓'; btn.disabled = true;
        releasedTotal += amt;
        // unlock next milestone
        const next = scope.querySelector('.uj-ms-approve[data-ms-approve="'+(n+1)+'"]');
        if (next) { next.disabled = false; next.textContent = 'Approve release'; }
        scope.querySelector('#ujEngageNote').textContent = money(releasedTotal)+' of '+money(chosenRemaining)+' released · '+money(chosenRemaining-releasedTotal)+' protected in escrow';
        updateMoney();
      });
    });

  };


  // ===== Page init: purchase =====
  pageInits['purchase'] = function(scope) {
    // Verification gate: if not verified, redirect (runs on every visit)
    if (!VVE.isVerified()) {
      showGateToast(VVE.hasApplied() ? 'Verify your identity to unlock. Redirecting…' : 'Apply and verify to unlock. Redirecting…');
      setTimeout(() => { location.hash = VVE.hasApplied() ? 'verify' : 'apply'; }, 1400);
      return;
    }
    if (pageInitDone['purchase']) return;
    pageInitDone['purchase'] = true;

    const UNLOCK_FEE = 2800;
    const TOTAL = 28000;
    function money(n){ return '$'+Math.round(n).toLocaleString('en-US'); }

    // ===== Payment agreement & guidelines modal (gates every payment) =====
    const payModal = scope.querySelector('#payAgreeModal');
    const payCheck = scope.querySelector('#payAgreeCheck');
    const payContinue = scope.querySelector('#payAgreeContinue');
    const payCancel = scope.querySelector('#payAgreeCancel');
    const payClose = scope.querySelector('#payAgreeClose');
    const payTitle = scope.querySelector('#payAgreeTitle');
    const payBody = scope.querySelector('#payAgreeBody');
    let payOnAgree = null;
    function openPayAgree(context, onAgree) {
      payOnAgree = onAgree;
      if (payCheck) payCheck.checked = false;
      if (payContinue) payContinue.disabled = true;
      if (payTitle) payTitle.textContent = (context === 'commit')
        ? 'Commitment terms, policy & dispute guidelines'
        : 'Payment terms, policy & dispute guidelines';
      if (payBody) payBody.scrollTop = 0;
      if (payModal) payModal.style.display = 'flex';
    }
    function closePayAgree() { if (payModal) payModal.style.display = 'none'; payOnAgree = null; }
    if (payCheck) payCheck.addEventListener('change', () => { if (payContinue) payContinue.disabled = !payCheck.checked; });
    if (payCancel) payCancel.addEventListener('click', closePayAgree);
    if (payClose) payClose.addEventListener('click', closePayAgree);
    if (payModal) payModal.addEventListener('click', (e) => { if (e.target === payModal) closePayAgree(); });
    if (payContinue) payContinue.addEventListener('click', () => {
      if (!payCheck || !payCheck.checked) return;
      const cb = payOnAgree;
      closePayAgree();
      if (typeof cb === 'function') cb();
    });

    const unlockBtn = scope.querySelector('#purUnlockBtn');
    const coUnlock = scope.querySelector('#purCoUnlock');
    const coCommit = scope.querySelector('#purCoCommit');
    const pathBlock = scope.querySelector('#purPathBlock');
    const commitBtn = scope.querySelector('#purCommitBtn');

    let chosenRemaining = 0, chosenName = '';
    let buyerSigned = false, archSigned = false;

    // STEP 1: unlock
    const portal = scope.querySelector('#purPortal');
    if (unlockBtn) unlockBtn.addEventListener('click', () => {
      openPayAgree('unlock', () => {
        unlockBtn.textContent = 'Processing...'; unlockBtn.disabled = true;
        setTimeout(() => {
          if (coUnlock) coUnlock.style.display = 'none';
          if (coCommit) coCommit.style.display = 'block';
          // open the buyer–seller portal first (docs + messaging + calls + 7-day window)
          if (portal) { portal.style.display = 'block'; startPortalCountdown(); portal.scrollIntoView({behavior:'smooth',block:'start'}); }
        }, 900);
      });
    });

    // ===== PORTAL: 7-day countdown =====
    let portalDeadline = null, portalTimer = null, meetingConducted = false;
    function startPortalCountdown() {
      if (portalDeadline) return;
      portalDeadline = Date.now() + 7*24*60*60*1000;
      const el = scope.querySelector('#portalCountdown');
      function tick() {
        const ms = portalDeadline - Date.now();
        if (ms <= 0) { el.textContent = 'Expired'; el.classList.add('urgent'); clearInterval(portalTimer); return; }
        const d = Math.floor(ms/86400000), h = Math.floor(ms%86400000/3600000), m = Math.floor(ms%3600000/60000);
        el.textContent = d+'d '+String(h).padStart(2,'0')+'h '+String(m).padStart(2,'0')+'m';
        if (d < 1) el.classList.add('urgent');
      }
      tick(); portalTimer = setInterval(tick, 30000);
    }
    function setChk(name, done) {
      const chk = scope.querySelector('.pchk[data-chk="'+name+'"]');
      if (!chk) return;
      const box = chk.querySelector('.pchk-box');
      if (done) { chk.classList.add('is-done'); box.classList.add('is-done'); box.textContent = '✓'; }
    }

    // ===== PORTAL: messaging =====
    const pThread = scope.querySelector('#portalThread');
    const pInput = scope.querySelector('#portalComposeInput');
    const pSend = scope.querySelector('#portalComposeSend');
    function pAddMsg(who, text) {
      const div = document.createElement('div');
      div.className = 'portal-msg ' + (who==='You'?'buyer':'architect');
      const t = document.createElement('span'); t.className='pmsg-text'; t.textContent = text;
      const tm = document.createElement('span'); tm.className='pmsg-time'; tm.textContent = 'Just now';
      div.appendChild(t); div.appendChild(tm); pThread.appendChild(div);
      pThread.scrollTop = pThread.scrollHeight;
    }
    function pSendMsg() {
      const v = pInput.value.trim(); if(!v) return;
      pAddMsg('You', v); pInput.value='';
      setTimeout(()=>pAddMsg('Architect',"Sounds good. Let me know what time works and we will get on a call."), 1500);
    }
    if (pSend) pSend.addEventListener('click', pSendMsg);
    if (pInput) pInput.addEventListener('keydown', e=>{ if(e.key==='Enter') pSendMsg(); });

    // ===== PORTAL: scheduler =====
    const schedBtn = scope.querySelector('#portalScheduleBtn');
    const scheduler = scope.querySelector('#portalScheduler');
    const schedDays = scope.querySelector('#pschedDays');
    const schedSlots = scope.querySelector('#pschedSlots');
    const schedConfirm = scope.querySelector('#pschedConfirm');
    const schedCancel = scope.querySelector('#pschedCancel');
    const scheduledCard = scope.querySelector('#portalScheduled');
    let selDay = null, selSlot = null;
    const SLOTS = ['09:00','11:00','13:30','15:00','16:30','18:00'];
    function buildScheduler() {
      schedDays.innerHTML=''; schedSlots.innerHTML='';
      const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      for (let i=1;i<=5;i++){
        const dt=new Date(Date.now()+i*86400000);
        const b=document.createElement('div'); b.className='psched-day';
        b.innerHTML='<span class="psd-dow">'+dow[dt.getDay()]+'</span><span class="psd-date">'+dt.getDate()+'</span>';
        b.addEventListener('click',()=>{ schedDays.querySelectorAll('.psched-day').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); selDay=dt; checkSched(); });
        schedDays.appendChild(b);
      }
      SLOTS.forEach(s=>{
        const b=document.createElement('div'); b.className='psched-slot'; b.textContent=s;
        b.addEventListener('click',()=>{ schedSlots.querySelectorAll('.psched-slot').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); selSlot=s; checkSched(); });
        schedSlots.appendChild(b);
      });
    }
    function checkSched(){ if(schedConfirm) schedConfirm.disabled = !(selDay && selSlot); }
    if (schedBtn) schedBtn.addEventListener('click', ()=>{ if(!schedDays.children.length) buildScheduler(); scheduler.style.display = scheduler.style.display==='none'?'block':'none'; });
    if (schedCancel) schedCancel.addEventListener('click', ()=>{ scheduler.style.display='none'; });
    if (schedConfirm) schedConfirm.addEventListener('click', ()=>{
      if(!(selDay&&selSlot)) return;
      const dow=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      scope.querySelector('#pscWhen').textContent = dow[selDay.getDay()]+', '+mon[selDay.getMonth()]+' '+selDay.getDate()+' · '+selSlot;
      scheduler.style.display='none'; scheduledCard.style.display='flex';
      setChk('schedule', true);
      pAddMsg('Architect',"Great, I have accepted the invite. Talk then. You can join from the card above when it is time.");
    });

    // ===== PORTAL: call interface =====
    const callOverlay = scope.querySelector('#callOverlay');
    const audioBtn = scope.querySelector('#portalAudioBtn');
    const videoBtn = scope.querySelector('#portalVideoBtn');
    const joinBtn = scope.querySelector('#pscJoinBtn');
    const callTimerEl = scope.querySelector('#callTimer');
    const callModeEl = scope.querySelector('#callMode');
    let callInterval=null, callSecs=0;
    function openCall(mode){
      callModeEl.textContent = mode+' call';
      callOverlay.style.display='flex'; callSecs=0;
      if (mode==='Audio') scope.querySelectorAll('.call-tile').forEach(t=>t.classList.add('cam-off'));
      else scope.querySelectorAll('.call-tile').forEach(t=>t.classList.remove('cam-off'));
      callInterval=setInterval(()=>{ callSecs++; const m=Math.floor(callSecs/60),s=callSecs%60; callTimerEl.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); },1000);
    }
    function endCall(){
      callOverlay.style.display='none'; clearInterval(callInterval);
      // meeting now conducted
      if (!meetingConducted) {
        meetingConducted = true;
        setChk('schedule', true); setChk('meeting', true);
        const note = scope.querySelector('#portalProceedNote');
        const pbtn = scope.querySelector('#portalProceedBtn');
        if (note) note.textContent = 'Meeting complete. You can now review and accept terms.';
        if (pbtn) pbtn.disabled = false;
        pAddMsg('Architect',"Good speaking with you. Whenever you are ready, accept the terms and we will get started.");
      }
    }
    if (audioBtn) audioBtn.addEventListener('click', ()=>openCall('Audio'));
    if (videoBtn) videoBtn.addEventListener('click', ()=>openCall('Video'));
    if (joinBtn) joinBtn.addEventListener('click', ()=>openCall('Video'));
    const callEndBtn = scope.querySelector('#callEndBtn');
    if (callEndBtn) callEndBtn.addEventListener('click', endCall);
    const callMuteBtn = scope.querySelector('#callMuteBtn');
    if (callMuteBtn) callMuteBtn.addEventListener('click', ()=>{ callMuteBtn.classList.toggle('is-off'); const b=scope.querySelector('#ctMutedBadge'); if(b) b.style.display = callMuteBtn.classList.contains('is-off')?'block':'none'; });
    const callCamBtn = scope.querySelector('#callCamBtn');
    if (callCamBtn) callCamBtn.addEventListener('click', ()=>{ callCamBtn.classList.toggle('is-off'); });

    // ===== PORTAL: proceed to terms (gated on meeting) =====
    const proceedBtn = scope.querySelector('#portalProceedBtn');
    if (proceedBtn) proceedBtn.addEventListener('click', ()=>{
      if (proceedBtn.disabled) return;
      setChk('terms', false); // terms accepted later at signing
      if (portal) portal.style.display='none';
      if (pathBlock) { pathBlock.style.display='block'; pathBlock.scrollIntoView({behavior:'smooth',block:'start'}); }
    });

    // STEP 2: choose path
    scope.querySelectorAll('#purPathBlock .uj-path').forEach(label => {
      label.addEventListener('click', () => {
        chosenRemaining = parseInt(label.dataset.remaining,10);
        chosenName = label.querySelector('.uj-path-name').textContent;
        if (commitBtn){ commitBtn.disabled = false; commitBtn.textContent = 'Review terms · '+chosenName; }
        const lbl = scope.querySelector('#purCoPathLabel'); if(lbl) lbl.textContent = chosenName+' · remaining';
        const rem = scope.querySelector('#purCoRemaining'); if(rem) rem.textContent = money(chosenRemaining);
        const tot = scope.querySelector('#purCoTotal'); if(tot) tot.textContent = money(UNLOCK_FEE + chosenRemaining);
        const esc = scope.querySelector('#purCoEscrow'); if(esc) esc.textContent = money(UNLOCK_FEE)+' protected · '+money(chosenRemaining)+' on commit';
      });
    });

    // STEP 3: reveal agreement
    const agreement = scope.querySelector('#purAgreement');
    function seedMilestones() {
      const per = Math.round(chosenRemaining/3);
      const amts = [per, per, chosenRemaining - per*2];
      scope.querySelectorAll('.agr-ms-amt-input').forEach((inp,i)=>{ inp.value = amts[i]; });
      scope.querySelector('#agrPathBadge').textContent = chosenName;
      scope.querySelector('#agrTotal').textContent = money(UNLOCK_FEE + chosenRemaining);
      scope.querySelector('#agrRemaining').textContent = money(chosenRemaining);
      validateMs();
    }
    if (commitBtn) commitBtn.addEventListener('click', () => {
      if (!chosenRemaining) return;
      if (agreement) {
        seedMilestones();
        agreement.style.display = 'block';
        commitBtn.style.display = 'none';
        agreement.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });

    // Milestone validation
    function msTotal(){ let t=0; scope.querySelectorAll('.agr-ms-amt-input').forEach(i=>{ t+=parseInt(i.value||'0',10); }); return t; }
    function validateMs() {
      const t = msTotal();
      const el = scope.querySelector('#agrMsTotal');
      const sum = scope.querySelector('#agrMsSum');
      if (sum) sum.textContent = '3 milestones · '+money(t)+' total';
      if (!el) return true;
      if (t === chosenRemaining) { el.textContent = 'Milestones total: '+money(t)+' · matches remaining ✓'; el.classList.remove('mismatch'); return true; }
      else { el.textContent = 'Milestones total: '+money(t)+' · must equal '+money(chosenRemaining); el.classList.add('mismatch'); return false; }
    }

    // Buyer edits milestones -> architect goes back to reviewing, must re-accept
    let buyerEdited = false;
    scope.querySelectorAll('.agr-ms-amt-input, .agr-ms-title-input').forEach(inp => {
      inp.addEventListener('input', () => {
        validateMs();
        if (!buyerEdited) {
          buyerEdited = true;
          const arch = scope.querySelector('#agrArchState');
          if (arch && archSigned) { archSigned = false; arch.textContent = 'Reviewing changes'; arch.className = 'agr-sign-state reviewing'; }
        }
      });
    });

    // Message thread
    const composeInput = scope.querySelector('#agrComposeInput');
    const composeSend = scope.querySelector('#agrComposeSend');
    const thread = scope.querySelector('#agrThread');
    function addMsg(who, text) {
      const div = document.createElement('div');
      div.className = 'agr-msg ' + (who === 'You' ? 'buyer' : 'architect');
      const w = document.createElement('span'); w.className='agr-msg-who'; w.textContent = who;
      const t = document.createElement('span'); t.className='agr-msg-text'; t.textContent = text;
      div.appendChild(w); div.appendChild(t); thread.appendChild(div);
      thread.scrollTop = thread.scrollHeight;
    }
    function sendBuyerMsg() {
      const v = composeInput.value.trim(); if (!v) return;
      addMsg('You', v); composeInput.value = '';
      // simulated architect reply
      setTimeout(() => {
        addMsg('Architect', 'Understood. That works for me, the terms look good on my side.');
      }, 1400);
    }
    if (composeSend) composeSend.addEventListener('click', sendBuyerMsg);
    if (composeInput) composeInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendBuyerMsg(); });

    // Back from agreement
    const agrBack = scope.querySelector('#agrBackBtn');
    if (agrBack) agrBack.addEventListener('click', () => {
      if (agreement) agreement.style.display = 'none';
      if (commitBtn) commitBtn.style.display = '';
      if (pathBlock) pathBlock.scrollIntoView({behavior:'smooth',block:'center'});
    });

    // Sign agreement -> architect reviews -> accepts -> payment
    const signBtn = scope.querySelector('#agrSignBtn');
    if (signBtn) signBtn.addEventListener('click', () => {
      if (!validateMs()) {
        const el = scope.querySelector('#agrMsTotal');
        if (el) el.scrollIntoView({behavior:'smooth',block:'center'});
        return;
      }
      // buyer signs
      buyerSigned = true;
      const bs = scope.querySelector('#agrBuyerState');
      if (bs) { bs.textContent = 'Signed ✓'; bs.className = 'agr-sign-state signed'; }
      signBtn.textContent = 'Waiting for architect…'; signBtn.disabled = true;
      const arch = scope.querySelector('#agrArchState');
      if (arch) { arch.textContent = 'Reviewing'; arch.className = 'agr-sign-state reviewing'; }
      // architect reviews then accepts
      setTimeout(() => {
        archSigned = true;
        if (arch) { arch.textContent = 'Signed ✓'; arch.className = 'agr-sign-state signed'; }
        const status = scope.querySelector('#agrStatus');
        if (status) { status.textContent = 'Both parties signed'; status.className = 'agr-status signed'; }
        addMsg('Architect', 'Signed. Looking forward to working together, I will send a kickoff time shortly.');
        // now payment unlocks
        signBtn.style.display = 'none';
        let payBtn = scope.querySelector('#agrPayBtn');
        if (!payBtn) {
          payBtn = document.createElement('button');
          payBtn.id = 'agrPayBtn'; payBtn.className = 'uj-btn-primary';
          payBtn.innerHTML = 'Pay '+money(chosenRemaining)+' &amp; commit · funds held in escrow';
          scope.querySelector('.agr-sign-actions').appendChild(payBtn);
          payBtn.addEventListener('click', () => {
            openPayAgree('commit', () => {
              payBtn.textContent = 'Processing…'; payBtn.disabled = true;
              setTimeout(() => { window._ujCommitted = true; location.hash = 'listing'; }, 900);
            });
          });
        } else { payBtn.style.display = ''; }
      }, 2200);
    });
  };


  // ===== Page init: browse =====
  pageInits['browse'] = function(scope) {
    if (pageInitDone['browse']) return;
    pageInitDone['browse'] = true;

    const grid = document.getElementById('browseGrid');
    const filters = document.getElementById('browseFilters');
    const sortSel = document.getElementById('browseSort');
    const countEl = document.getElementById('browseCount');
    const emptyEl = document.getElementById('browseEmpty');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.opp-card'));
    let activeFilter = 'all';

    function apply() {
      // filter
      let visible = cards.filter(card => {
        const ind = card.dataset.industry;
        return activeFilter === 'all' || ind === activeFilter;
      });

      // sort
      const mode = sortSel ? sortSel.value : 'trust';
      visible.sort((a, b) => {
        if (mode === 'trust') return (+b.dataset.trust) - (+a.dataset.trust);
        if (mode === 'price-low') return (+a.dataset.price) - (+b.dataset.price);
        if (mode === 'price-high') return (+b.dataset.price) - (+a.dataset.price);
        if (mode === 'newest') return (+a.dataset.listed) - (+b.dataset.listed);
        return 0;
      });

      // hide all, then show + reorder visible
      cards.forEach(c => { c.style.display = 'none'; });
      visible.forEach(c => { c.style.display = 'flex'; grid.appendChild(c); });

      // count + empty state
      if (countEl) countEl.textContent = visible.length + (visible.length === 1 ? ' opportunity' : ' opportunities');
      if (emptyEl) emptyEl.style.display = visible.length === 0 ? 'block' : 'none';
    }

    if (filters) {
      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.bfilter');
        if (!btn) return;
        filters.querySelectorAll('.bfilter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        apply();
      });
    }
    if (sortSel) sortSel.addEventListener('change', apply);

    apply();
  };


  // ===== Page init: list (architect composer) =====
  pageInits['list'] = function(scope) {
    if (pageInitDone['list']) return;
    pageInitDone['list'] = true;

    const TEASER_PREVIEW_CHARS = 90; // blurred teaser of the REAL text shown under the AI summary

    const FREE = [
      { id:'title', label:'Opportunity title', type:'text', ph:'Autonomous Backend Operations System for Mid-Market E-Commerce Brands' },
      { id:'tags', label:'Industry tags (comma separated)', type:'text', ph:'E-Commerce, AI Automation' },
      { id:'hook', label:'One-line hook', type:'textarea', ph:'A documented operational intelligence system that removes the founder from backend e-commerce operations in under 90 days.' },
      { id:'stage', label:'Stage', type:'select', options:['Early Concept','Validated Thesis','Execution-Ready'] },
      { id:'geography', label:'Geography', type:'text', ph:'AU, US, UK' },
      { id:'capital', label:'Capital required', type:'text', ph:'$28,000 – $56,000' },
      { id:'timeline', label:'Time to launch', type:'text', ph:'60–90 days' },
      { id:'monet', label:'Monetisation', type:'text', ph:'Retainer + project' },
      { id:'price', label:'Listed price (USD)', type:'number', ph:'28000' },
    ];
    const DEEP = [
      { id:'thesis', label:'Investment thesis', ph:'Write the full thesis. Why this opportunity exists, the structural reason serious capital should pay attention, and what makes it defensible. No length limit.' },
      { id:'problem', label:'The problem', ph:'Describe the full problem. What is broken, who feels the pain, what it costs them today.' },
      { id:'gap', label:'Market gap', ph:'The complete whitespace analysis. What existing solutions miss and why this is structurally underserved.' },
      { id:'model', label:'Business model & revenue logic', ph:'Full revenue model. Unit economics, pricing logic, margins, retention assumptions.' },
      { id:'competitive', label:'Competitive landscape', ph:'Every relevant competitor and adjacent player, and why none of them is a direct head-to-head.' },
      { id:'risks', label:'Risks & execution challenges', ph:'The honest risk register. What could go wrong and what it takes to execute well.' },
      { id:'gtm', label:'Go-to-market strategy', ph:'The complete GTM. Channels, sequencing, anchor accounts, content engine, first-customer motion.' },
      { id:'financials', label:'Financial projections', ph:'Full projections. Revenue trajectory, cost to first customers, key assumptions, sensitivity.' },
    ];

    const composer = document.getElementById('listComposer');
    const preview = document.getElementById('listPreview');
    if (!composer || !preview) return;

    const state = {};
    const aiSummary = {};   // AI-generated public summary per deep field
    const aiEdited = {};    // whether architect manually edited the AI summary

    function fmtMoney(n){ n=Math.round(n); return '$'+n.toLocaleString('en-US'); }

    /* ============================================================
       AI SUMMARY ENGINE
       ------------------------------------------------------------
       PROTOTYPE: local simulation (works offline, no API key).
       It produces a polished, complete-feeling "conclusion" of the
       architect's full text that conveys quality WITHOUT revealing
       the specifics. The buyer never sees the raw text for free.

       PRODUCTION: replace simulateSummary() with a real Claude call.
       See generateSummaryViaAPI() below (commented) for the wiring.
       ============================================================ */
    function simulateSummary(fieldLabel, text) {
      if (!text || !text.trim()) return '';
      const clean = text.replace(/\s+/g, ' ').trim();
      const sentences = clean.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0);
      const wordCount = clean.split(/\s+/).length;

      // --- Extract real substance from the architect's actual text ---
      // 1. Sentences containing hard data (numbers, money, %, time, multiples)
      const dataRe = /(\$[\d,.]+\s?[KMB]?|\b\d+[\d,.]*\s?%|\b\d+[\d,.]*\s?(x|months?|days?|weeks?|years?|hours?)\b|\b\d{2,}[\d,.]*\b)/i;
      const dataSentences = sentences.filter(s => dataRe.test(s));

      // 2. Mechanism / market sentences (signal verbs investors care about)
      const signalRe = /\b(market|customers?|segment|target|revenue|margin|pricing|charge|cost|save|reduce|grow|demand|competitor|incumbent|because|driver|trend|why now|moat|defensible|retention|churn|acquisition)\b/i;
      const signalSentences = sentences.filter(s => signalRe.test(s) && !dataRe.test(s));

      // Pull up to 4 real data points (verbatim from the architect, lightly trimmed)
      function trimSentence(s, max) {
        max = max || 160;
        if (s.length <= max) return s;
        return s.slice(0, max).replace(/\s+\S*$/, '') + '…';
      }
      const firstSentence = sentences[0] || '';
      const firstIsSubstantive = firstSentence.length > 40 && (dataRe.test(firstSentence) || signalRe.test(firstSentence));

      // Build points, excluding the lead sentence if we are quoting it
      const points = [];
      const usedLead = firstIsSubstantive ? firstSentence : null;
      dataSentences.filter(s => s !== usedLead).slice(0, 3).forEach(s => points.push(trimSentence(s)));
      if (points.length < 3) signalSentences.filter(s => s !== usedLead).slice(0, 3 - points.length).forEach(s => points.push(trimSentence(s)));
      const depthNote =
        wordCount > 220 ? 'The full write-up runs deep' :
        wordCount > 110 ? 'The full write-up is detailed' :
        'The full detail continues';

      const sectionLead = {
        'Investment thesis': 'The core thesis, in the architect\u2019s own words:',
        'The problem': 'The problem being solved:',
        'Market gap': 'The market gap identified:',
        'Business model & revenue logic': 'How the opportunity makes money:',
        'Competitive landscape': 'The competitive position:',
        'Risks & execution challenges': 'The key risks named:',
        'Go-to-market strategy': 'The go-to-market approach:',
        'Financial projections': 'The financial picture:',
      };

      // Build the structured summary object the renderer will use
      return {
        lead: firstIsSubstantive ? trimSentence(firstSentence, 220) : (sectionLead[fieldLabel] || 'Summary:'),
        leadIsQuote: firstIsSubstantive,
        intro: sectionLead[fieldLabel] || 'Key points:',
        points: points,
        closing: depthNote + ', including the specifics and supporting evidence, in the locked section.'
      };
    }

    // Turn the structured summary into plain text (for the editable AI box)
    function summaryToText(s) {
      if (!s) return '';
      if (typeof s === 'string') return s;
      let out = '';
      if (s.leadIsQuote) out += s.lead + '\n\n';
      if (s.points && s.points.length) {
        out += (s.intro || 'Key points:') + '\n';
        out += s.points.map(p => '\u2022 ' + p).join('\n');
        out += '\n\n';
      }
      if (s.closing) out += s.closing;
      return out.trim();
    }

    // Turn structured summary into listing-page HTML (buyer detail page)
    function summaryToHTMLForListing(s) {
      if (!s) return '';
      if (typeof s === 'string') return '<p class="ls-text">' + s + '</p>';
      let html = '';
      if (s.leadIsQuote) html += '<p class="ls-text" style="font-weight:500;">' + s.lead + '</p>';
      if (s.points && s.points.length) {
        html += '<p class="ls-text" style="margin-bottom:.5rem;color:var(--text-muted);">' + (s.intro||'Key points:') + '</p>';
        html += '<ul class="ls-points">' + s.points.map(p=>'<li>'+p+'</li>').join('') + '</ul>';
      }
      if (s.closing) html += '<p class="ls-text" style="color:var(--text-muted);font-size:.92rem;">' + s.closing + '</p>';
      return html;
    }

    // Turn the structured summary into HTML (for the buyer preview)
    function summaryToHTML(s) {
      if (!s) return '';
      if (typeof s === 'string') return '<p class="pv-summary-text">' + s + '</p>';
      let html = '';
      if (s.leadIsQuote) html += '<p class="pv-summary-lead">' + s.lead + '</p>';
      if (s.points && s.points.length) {
        html += '<p class="pv-summary-intro">' + (s.intro || 'Key points:') + '</p>';
        html += '<ul class="pv-summary-points">' + s.points.map(p => '<li>' + p + '</li>').join('') + '</ul>';
      }
      if (s.closing) html += '<p class="pv-summary-closing">' + s.closing + '</p>';
      return html;
    }

    /* PRODUCTION — real Claude API (uncomment and host with a key):
    async function generateSummaryViaAPI(fieldLabel, text) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 220,
          messages: [{
            role: 'user',
            content:
              'You are writing the PUBLIC teaser summary for a confidential business opportunity listing. ' +
              'Summarise the following "' + fieldLabel + '" section so a buyer understands the QUALITY and SHAPE of the thinking, ' +
              'but DO NOT reveal specific numbers, names, tactics, or proprietary detail. ' +
              'Write 2-3 polished sentences. End by noting the full detail unlocks after payment. ' +
              'Do not mention that this is an AI summary.\n\nSECTION TEXT:\n' + text
          }]
        })
      });
      const data = await res.json();
      return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join(' ').trim();
    }
    */

    function regenerateSummary(fid, label) {
      if (aiEdited[fid]) return; // respect architect's manual edits
      aiSummary[fid] = simulateSummary(label, state[fid] || '');
      const box = composer.querySelector(`[data-ai="${fid}"]`);
      if (box) box.value = summaryToText(aiSummary[fid]);
      renderPreviewSection(fid, label);
    }

    // ---- Build composer fields ----
    function freeFieldHTML(f) {
      let input;
      if (f.type === 'textarea') input = `<textarea class="cfield-textarea" data-fid="${f.id}" placeholder="${f.ph||''}"></textarea>`;
      else if (f.type === 'select') input = `<select class="cfield-select" data-fid="${f.id}">`+f.options.map(o=>`<option value="${o}">${o}</option>`).join('')+`</select>`;
      else input = `<input class="cfield-input" type="${f.type}" data-fid="${f.id}" placeholder="${f.ph||''}">`;
      let extra = '';
      if (f.id==='price') extra = `<div class="unlock-calc"><span class="unlock-calc-label">Buyer pays to unlock (10%)</span><span class="unlock-calc-val" id="unlockCalcVal">$0</span></div>`;
      return `<div class="cfield"><label class="cfield-label">${f.label}</label>${input}${extra}</div>`;
    }

    // deep field = two columns: full text (left) + AI summary (right, editable)
    function deepFieldHTML(f) {
      return `
        <div class="deep-field">
          <div class="deep-field-label">${f.label}</div>
          <div class="deep-cols">
            <div class="deep-col">
              <div class="deep-col-head"><span class="deep-col-tag full">Your full text</span><span class="deep-col-sub">Confidential · unlocks after payment · no limit</span></div>
              <textarea class="cfield-textarea deep-textarea" data-fid="${f.id}" placeholder="${f.ph||''}"></textarea>
              <span class="cfield-charcount" data-cc="${f.id}">0 words</span>
            </div>
            <div class="deep-col">
              <div class="deep-col-head"><span class="deep-col-tag ai">Buyer sees (free)</span><button class="deep-regen" data-regen="${f.id}" title="Regenerate from your text">↻ Auto</button></div>
              <textarea class="cfield-textarea deep-textarea deep-ai" data-ai="${f.id}" placeholder="An AI summary of your text appears here automatically. You can edit it."></textarea>
              <span class="deep-ai-note">Auto-written from your text · editable</span>
            </div>
          </div>
        </div>`;
    }

    composer.innerHTML = `
      <div class="composer-tier">
        <div class="composer-tier-head"><span class="cth-badge free">Free</span><span class="cth-title">Always visible to the buyer</span><span class="cth-hint">Builds trust</span></div>
        ${FREE.map(freeFieldHTML).join('')}
      </div>
      <div class="composer-tier">
        <div class="composer-tier-head"><span class="cth-badge teaser">Teaser</span><span class="cth-title">Buyer sees an AI summary free · your full text unlocks after payment</span><span class="cth-hint">Creates curiosity</span></div>
        <p class="deep-explainer">Write the real, complete content on the left. vvEntra automatically writes a public summary on the right that conveys your quality without revealing specifics. The buyer reads the summary free, plus a short blurred glimpse of your real words, then pays to unlock everything. You can edit the summary anytime.</p>
        ${DEEP.map(deepFieldHTML).join('')}
      </div>
      <div class="composer-tier">
        <div class="composer-tier-head"><span class="cth-badge doc">Document</span><span class="cth-title">Shared as files after unlock + NDA</span><span class="cth-hint">Your prepared package</span></div>
        <div class="cfield"><label class="cfield-label">Document package (one file name per line)</label>
          <textarea class="cfield-textarea" data-fid="docs" placeholder="Market sizing model (verified)&#10;Reference architecture&#10;Supplier contract templates&#10;90-day deployment plan&#10;Financial model (XLSX)"></textarea>
        </div>
      </div>
    `;

    // ---- Preview shell ----
    preview.innerHTML = `
      <div class="pv-tags" id="pvTags"></div>
      <div class="pv-title" id="pvTitle"></div>
      <div class="pv-hook" id="pvHook"></div>
      <div class="pv-snapshot">
        <div class="pv-snap-cell"><span class="pv-snap-k">Stage</span><span class="pv-snap-v" id="pvStage"></span></div>
        <div class="pv-snap-cell"><span class="pv-snap-k">Geography</span><span class="pv-snap-v" id="pvGeography"></span></div>
        <div class="pv-snap-cell"><span class="pv-snap-k">Capital</span><span class="pv-snap-v" id="pvCapital"></span></div>
        <div class="pv-snap-cell"><span class="pv-snap-k">Time to launch</span><span class="pv-snap-v" id="pvTimeline"></span></div>
        <div class="pv-snap-cell"><span class="pv-snap-k">Monetisation</span><span class="pv-snap-v" id="pvMonet"></span></div>
        <div class="pv-snap-cell"><span class="pv-snap-k">Unlock fee</span><span class="pv-snap-v" id="pvUnlock"></span></div>
      </div>
      <div id="pvSections"></div>
      <div class="pv-section"><div class="pv-sec-title">Document package</div><div id="pvDocs"></div></div>
    `;
    document.getElementById('pvSections').innerHTML = DEEP.map(f =>
      `<div class="pv-section">
        <div class="pv-sec-title">${f.label}</div>
        <div class="pv-sec-summary" data-pvsum="${f.id}"><span class="pv-empty-hint">Nothing written yet.</span></div>
        <div class="pv-sec-teaser" data-pvtease="${f.id}"></div>
      </div>`).join('');

    // ---- Render one preview section (AI summary + blurred glimpse + prompt) ----
    function renderPreviewSection(fid, label) {
      const sumBox = preview.querySelector(`[data-pvsum="${fid}"]`);
      const teaseBox = preview.querySelector(`[data-pvtease="${fid}"]`);
      if (!sumBox || !teaseBox) return;
      const full = state[fid] || '';
      const summary = aiSummary[fid] || '';

      if (!full) { sumBox.innerHTML = '<span class="pv-empty-hint">Nothing written yet.</span>'; teaseBox.innerHTML=''; return; }

      sumBox.innerHTML = '';
      if (typeof summary === 'string') {
        // architect-edited plain text -> render with line breaks
        const p = document.createElement('div');
        p.className = 'pv-summary-text';
        p.innerHTML = summary.split('\n').filter(Boolean).map(line =>
          line.trim().startsWith('\u2022')
            ? '<div class="pv-sum-bullet">' + line.replace(/^\u2022\s*/,'') + '</div>'
            : '<p>' + line + '</p>'
        ).join('');
        sumBox.appendChild(p);
      } else {
        sumBox.innerHTML = summaryToHTML(summary);
      }

      // short blurred glimpse of the REAL text
      teaseBox.innerHTML = '';
      const glimpse = full.replace(/\s+/g,' ').trim().slice(0, TEASER_PREVIEW_CHARS);
      const wrap = document.createElement('div');
      wrap.className = 'pv-glimpse-wrap';
      const lbl = document.createElement('span');
      lbl.className = 'pv-glimpse-label';
      lbl.textContent = 'From the architect\u2019s full write-up';
      const g = document.createElement('div');
      g.className = 'pv-glimpse';
      g.innerHTML = '<span class="pv-glimpse-vis">'+glimpse+'</span><span class="pv-glimpse-blur"> '+(full.replace(/\s+/g,' ').trim().slice(TEASER_PREVIEW_CHARS, TEASER_PREVIEW_CHARS+220) || 'and continues in full detail behind the unlock')+'</span>';
      const fee = state.price ? fmtMoney(state.price*0.10) : 'the unlock fee';
      const prompt = document.createElement('div');
      prompt.className = 'pv-teaser-prompt';
      prompt.textContent = '🔒 Pay '+fee+' to read the full section';
      wrap.appendChild(lbl); wrap.appendChild(g); wrap.appendChild(prompt);
      teaseBox.appendChild(wrap);
    }

    function setText(id,val){ const el=document.getElementById(id); if(el) el.textContent = val||''; }
    function renderTags(val){ const box=document.getElementById('pvTags'); box.innerHTML=''; (val||'').split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>{const s=document.createElement('span');s.className='pv-tag';s.textContent=t;box.appendChild(s);}); }
    function renderDocs(val){ const box=document.getElementById('pvDocs'); box.innerHTML=''; const lines=(val||'').split('\n').map(l=>l.trim()).filter(Boolean); if(!lines.length){box.innerHTML='<span class="pv-empty-hint">No documents listed yet.</span>';return;} lines.forEach(name=>{const row=document.createElement('div');row.className='pv-doc-row';row.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg><span class="pv-doc-name"></span><span class="pv-doc-lock">NDA</span>';row.querySelector('.pv-doc-name').textContent=name;box.appendChild(row);}); }

    function updateUnlock(){
      const v = state.price ? fmtMoney(state.price*0.10) : '$0';
      const calc=document.getElementById('unlockCalcVal'); if(calc) calc.textContent=v;
      const pv=document.getElementById('pvUnlock'); if(pv) pv.textContent = state.price ? v : '';
      DEEP.forEach(f=>{ if(state[f.id]) renderPreviewSection(f.id, f.label); });
    }

    // ---- Wire free + doc fields ----
    composer.querySelectorAll('[data-fid]').forEach(el=>{
      const fid=el.dataset.fid;
      const h=()=>{ state[fid]=el.value;
        if(fid==='title') setText('pvTitle',el.value);
        else if(fid==='hook') setText('pvHook',el.value);
        else if(fid==='tags') renderTags(el.value);
        else if(fid==='stage') setText('pvStage',el.value);
        else if(fid==='geography') setText('pvGeography',el.value);
        else if(fid==='capital') setText('pvCapital',el.value);
        else if(fid==='timeline') setText('pvTimeline',el.value);
        else if(fid==='monet') setText('pvMonet',el.value);
        else if(fid==='price'){ state.price=parseFloat(el.value)||0; updateUnlock(); }
        else if(fid==='docs') renderDocs(el.value);
        else if(DEEP.find(d=>d.id===fid)){
          // full-text deep field changed -> regen AI summary + word count + preview
          const label = DEEP.find(d=>d.id===fid).label;
          const wc = el.value.trim() ? el.value.trim().split(/\s+/).length : 0;
          const cc = composer.querySelector(`[data-cc="${fid}"]`); if(cc) cc.textContent = wc+' words';
          regenerateSummary(fid, label);
        }
      };
      el.addEventListener('input',h); el.addEventListener('change',h);
    });

    // ---- Wire AI summary textareas (architect edits) ----
    composer.querySelectorAll('[data-ai]').forEach(el=>{
      const fid=el.dataset.ai;
      const label=DEEP.find(d=>d.id===fid).label;
      el.addEventListener('input',()=>{ aiEdited[fid]=true; aiSummary[fid]=el.value; renderPreviewSection(fid,label); });
    });
    // ---- Wire regenerate buttons ----
    composer.querySelectorAll('[data-regen]').forEach(btn=>{
      btn.addEventListener('click',()=>{ const fid=btn.dataset.regen; const label=DEEP.find(d=>d.id===fid).label; aiEdited[fid]=false; regenerateSummary(fid,label); });
    });

    setText('pvStage','Early Concept');
    renderDocs('');

    // ---- Submit flow ----
    const submitCard=document.getElementById('listSubmitCard');
    const successCard=document.getElementById('listSubmitSuccess');
    const readiness=document.getElementById('lsubReadiness');
    const submitBtn=document.getElementById('lsubSubmitBtn');
    const previewBtn=document.getElementById('lsubPreviewBtn');
    const editBtn=document.getElementById('lsubEditBtn');
    const REQUIRED=[{id:'title',label:'Opportunity title'},{id:'hook',label:'One-line hook'},{id:'price',label:'Listed price'},{id:'thesis',label:'Investment thesis (full text)'},{id:'problem',label:'The problem (full text)'}];

    function refreshReadiness(){
      if(!readiness) return; let done=0;
      readiness.innerHTML=REQUIRED.map(r=>{const filled=state[r.id]&&String(state[r.id]).trim().length>0; if(filled)done++;
        const icon=filled?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>':'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
        return `<div class="lready-row ${filled?'done':'miss'}">${icon}${r.label}</div>`;}).join('');
      const allDone=done===REQUIRED.length; if(submitBtn) submitBtn.disabled=!allDone;
      readiness.insertAdjacentHTML('beforeend',`<div class="lready-row ${allDone?'done':'miss'}" style="border-top:1px solid var(--line);padding-top:.6rem;margin-top:.3rem;"><span class="lready-count">${done} of ${REQUIRED.length} required fields complete</span></div>`);
    }
    composer.querySelectorAll('[data-fid]').forEach(el=>{ el.addEventListener('input',refreshReadiness); el.addEventListener('change',refreshReadiness); });
    refreshReadiness();

    if(submitBtn) submitBtn.addEventListener('click',()=>{ if (!requireVerified('submit a listing')) return; submitBtn.textContent='Submitting...'; submitBtn.disabled=true;
      setTimeout(()=>{ composedListing=Object.assign({},state); composedListing.docs=state.docs||''; composedListing.aiSummaryHTML={}; DEEP.forEach(f=>{ composedListing.aiSummaryHTML[f.id] = (typeof aiSummary[f.id]==='string') ? '<p class=\"ls-text\">'+aiSummary[f.id].split('\\n').filter(Boolean).join('</p><p class=\"ls-text\">')+'</p>' : summaryToHTMLForListing(aiSummary[f.id]); });
        if(submitCard) submitCard.style.display='none'; if(successCard) successCard.style.display='block'; successCard.scrollIntoView({behavior:'smooth',block:'center'}); },800);
    });
    if(previewBtn) previewBtn.addEventListener('click',()=>{ location.hash='listing'; });
    if(editBtn) editBtn.addEventListener('click',()=>{ if(successCard) successCard.style.display='none'; if(submitCard) submitCard.style.display='block'; submitBtn.textContent='Submit for review'; refreshReadiness(); });
  };

  

  // ===== Page init: apply =====
  pageInits['apply'] = function(scope) {
    if (pageInitDone['apply']) return;
    pageInitDone['apply'] = true;

    const roleBtns = scope.querySelectorAll('.apply-role-btn');
    const roleFields = scope.querySelectorAll('.apply-role-fields');
    let currentRole = 'buyer';

    function setRole(role) {
      currentRole = role;
      roleBtns.forEach(b => b.classList.toggle('active', b.dataset.applyRole === role));
      roleFields.forEach(f => {
        f.style.display = f.dataset.showRole === role ? 'contents' : 'none';
      });
    }
    roleBtns.forEach(b => b.addEventListener('click', () => setRole(b.dataset.applyRole)));
    setRole('buyer');

    const submitBtn = scope.querySelector('#applySubmitBtn');
    const formCard = scope.querySelector('#applyFormCard');
    const successEl = scope.querySelector('#applySuccess');

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = scope.querySelector('#applyName').value.trim();
        const email = scope.querySelector('#applyEmail').value.trim();
        if (!name || !email) {
          scope.querySelector('#applyName').focus();
          return;
        }
        submitBtn.textContent = 'Submitting…';
        submitBtn.disabled = true;
        // Record the application in the session
        VVE.set({ stage: 'applied', role: currentRole, name: name, email: email, verifyState: 'none' });
        setTimeout(() => {
          if (formCard) formCard.style.display = 'none';
          if (successEl) successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 900);
      });
    }
  };

  // ===== Page init: verify =====
  pageInits['verify'] = function(scope) {
    if (pageInitDone['verify']) {
      // Re-sync role + saved progress on every visit even if already inited
      if (typeof scope._vveSync === 'function') scope._vveSync();
      return;
    }
    pageInitDone['verify'] = true;

    const s0 = VVE.get();
    const role = (s0.role === 'architect') ? 'architect' : 'buyer';
    const isSeller = (role === 'architect');

    // ----- role-aware step order -----
    const steps = isSeller
      ? ['account', 'linkedin', 'bank', 'video', 'done']
      : ['account', 'linkedin', 'done'];
    const totalSteps = steps.length;

    // ----- element refs -----
    const stepsWrap = scope.querySelector('#verifySteps');
    const progressBar = scope.querySelector('#verifyProgressBar');
    const progressLabel = scope.querySelector('#verifyProgressLabel');
    const roleName = scope.querySelector('#verifyRoleName');
    const roleNote = scope.querySelector('#verifyRoleNote');
    const intro = scope.querySelector('#verifyIntro');
    const submitBtn = scope.querySelector('#verifySubmitBtn');
    const submitNote = scope.querySelector('#verifySubmitNote');
    const verifyActions = scope.querySelector('#verifyActions');
    const reviewState = scope.querySelector('#verifyReviewState');
    const doneSub = scope.querySelector('#vstepDoneSub');

    // ----- progress state -----
    const progress = { linkedin: false, bank: false, video: false };

    // ----- role banner + visibility -----
    function applyRole() {
      if (roleName) roleName.textContent = isSeller ? 'Lister / Architect' : 'Buyer / Investor';
      if (roleNote) roleNote.textContent = isSeller
        ? 'Listers complete the full check: LinkedIn, payout account, and a live video verification.'
        : 'Buyers confirm professional identity through LinkedIn.';
      if (intro) intro.textContent = isSeller
        ? 'Listers are the people whose work backs every opportunity. Your verification goes deepest: professional identity, a connected payout account, and a short live video check.'
        : 'Buyers confirm a real professional identity through LinkedIn. This protects every lister you engage with.';
      // hide seller-only steps for buyers
      scope.querySelectorAll('.seller-only').forEach(el => { el.style.display = isSeller ? '' : 'none'; });
      // renumber visible step badges
      let n = 1;
      steps.forEach(key => {
        const stepEl = scope.querySelector('.verify-step[data-vstep="'+key+'"]');
        if (!stepEl) return;
        const num = stepEl.querySelector('.vstep-num');
        if (num && !num.classList.contains('done')) num.textContent = n;
        n++;
      });
      // 'done' sub text
      if (doneSub) doneSub.textContent = isSeller
        ? 'Your account is activated. You can list opportunities, meet buyers, and receive payouts.'
        : 'Your account is activated. You can unlock opportunities and engage with listers.';
    }

    // ----- compute + render progress -----
    function completedCount() {
      let done = 1; // account
      if (progress.linkedin) done++;
      if (isSeller) { if (progress.bank) done++; if (progress.video) done++; }
      return done;
    }
    function allDone() {
      return isSeller
        ? (progress.linkedin && progress.bank && progress.video)
        : progress.linkedin;
    }
    function renderProgress() {
      const done = completedCount();
      const pct = Math.round((done / totalSteps) * 100);
      if (progressBar) progressBar.style.width = pct + '%';
      if (progressLabel) progressLabel.textContent = 'Step ' + Math.min(done + (allDone()?0:1), totalSteps) + ' of ' + totalSteps;
      if (submitBtn) submitBtn.disabled = !allDone();
      if (submitNote) submitNote.textContent = allDone()
        ? 'All checks complete. Submit to finish verification.'
        : 'Complete the steps above to submit.';
    }

    // ----- step state helpers -----
    function markStepDone(key) {
      const stepEl = scope.querySelector('.verify-step[data-vstep="'+key+'"]');
      if (!stepEl) return;
      stepEl.classList.remove('locked', 'active');
      const num = stepEl.querySelector('.vstep-num');
      if (num) { num.className = 'vstep-num done'; num.textContent = '✓'; }
      const st = stepEl.querySelector('[data-state-for="'+key+'"]');
      if (st) { st.className = 'vstep-state done'; st.textContent = 'Complete'; }
    }
    function activateStep(key) {
      const stepEl = scope.querySelector('.verify-step[data-vstep="'+key+'"]');
      if (!stepEl) return;
      stepEl.classList.remove('locked');
      stepEl.classList.add('active');
      const num = stepEl.querySelector('.vstep-num');
      if (num && !num.classList.contains('done')) num.className = 'vstep-num active';
      const st = stepEl.querySelector('[data-state-for="'+key+'"]');
      if (st && !st.classList.contains('done')) { st.className = 'vstep-state active'; st.textContent = 'Required'; }
      const body = stepEl.querySelector('[data-body-for="'+key+'"]');
      if (body) body.style.display = '';
    }

    // advance to the next incomplete step after `key`
    function advanceFrom(key) {
      const order = isSeller ? ['linkedin','bank','video'] : ['linkedin'];
      const idx = order.indexOf(key);
      for (let i = idx + 1; i < order.length; i++) {
        if (!progress[order[i]]) { activateStep(order[i]); return; }
      }
    }

    // ===== STEP: LinkedIn =====
    const liBtn = scope.querySelector('#verifyLinkedinBtn');
    const liUrl = scope.querySelector('#verifyLinkedinUrl');
    const liInputRow = scope.querySelector('[data-li-input]');
    const liChecking = scope.querySelector('[data-li-checking]');
    const liDone = scope.querySelector('[data-li-done]');
    const liNameEl = scope.querySelector('[data-li-name]');
    const liMetaEl = scope.querySelector('[data-li-meta]');

    function completeLinkedin() {
      progress.linkedin = true;
      if (liInputRow) liInputRow.style.display = 'none';
      if (liChecking) liChecking.style.display = 'none';
      if (liDone) liDone.style.display = 'flex';
      const nm = (VVE.get().name || '').trim();
      if (liNameEl) liNameEl.textContent = nm ? (nm + ' · verified') : 'Profile verified';
      markStepDone('linkedin');
      advanceFrom('linkedin');
      renderProgress();
      VVE.set({ vLinkedin: true });
    }

    if (liBtn) liBtn.addEventListener('click', () => {
      const val = (liUrl && liUrl.value.trim()) || '';
      if (!val || val.indexOf('linkedin.com') === -1) {
        if (liUrl) { liUrl.focus(); liUrl.style.borderColor = 'var(--orange)'; }
        showGateToast('Enter your LinkedIn profile URL to continue.');
        return;
      }
      if (liInputRow) liInputRow.style.display = 'none';
      if (liChecking) liChecking.style.display = 'flex';
      setTimeout(completeLinkedin, 1600);
    });

    // ===== STEP: Bank (seller only) =====
    const bankBtn = scope.querySelector('#verifyBankBtn');
    const bankChecking = scope.querySelector('#verifyBankChecking');
    const bankDone = scope.querySelector('#verifyBankDone');

    function completeBank() {
      progress.bank = true;
      if (bankBtn) bankBtn.style.display = 'none';
      if (bankChecking) bankChecking.style.display = 'none';
      if (bankDone) bankDone.style.display = 'flex';
      markStepDone('bank');
      advanceFrom('bank');
      renderProgress();
      VVE.set({ vBank: true });
    }
    if (bankBtn) bankBtn.addEventListener('click', () => {
      if (bankBtn) bankBtn.style.display = 'none';
      if (bankChecking) bankChecking.style.display = 'flex';
      setTimeout(completeBank, 1800);
    });

    // ===== STEP: Video (seller only) =====
    const vvStartBtn = scope.querySelector('#vvStartBtn');
    const vvRetakeBtn = scope.querySelector('#vvRetakeBtn');
    const vvFrame = scope.querySelector('#vvFrame');
    const vvRec = scope.querySelector('#vvRec');
    const vvRecTime = scope.querySelector('#vvRecTime');
    const vvPrompt = scope.querySelector('#vvPrompt');
    const vvChecklist = scope.querySelector('#vvChecklist');
    let vvTimer = null, vvSeq = null;

    const vvPrompts = [
      { key: 'name', text: 'Please state your full name', t: 0 },
      { key: 'id',   text: 'Hold your government ID up to the camera', t: 3 },
      { key: 'age',  text: 'Confirm: "I am 18 years or older"', t: 6 },
      { key: 'live', text: 'Slowly turn your head left, then right', t: 9 }
    ];

    function setVvChk(key, cls) {
      const chk = scope.querySelector('.vv-chk[data-vv="'+key+'"]');
      if (chk) chk.className = 'vv-chk ' + cls;
    }
    function resetVideo() {
      progress.video = false;
      if (vvFrame) vvFrame.classList.remove('live');
      if (vvRec) vvRec.style.display = 'none';
      if (vvPrompt) vvPrompt.style.display = 'none';
      if (vvStartBtn) { vvStartBtn.style.display = ''; vvStartBtn.disabled = false; vvStartBtn.textContent = 'Start 2-minute verification'; }
      if (vvRetakeBtn) vvRetakeBtn.style.display = 'none';
      ['name','id','age','live'].forEach(k => setVvChk(k, ''));
      clearInterval(vvTimer); clearTimeout(vvSeq);
    }
    function runVideo() {
      if (vvFrame) vvFrame.classList.add('live');
      if (vvRec) vvRec.style.display = 'flex';
      if (vvPrompt) vvPrompt.style.display = 'block';
      if (vvStartBtn) vvStartBtn.style.display = 'none';

      let sec = 0;
      if (vvRecTime) vvRecTime.textContent = '0:00';
      vvTimer = setInterval(() => {
        sec++;
        const m = Math.floor(sec/60), ss = String(sec%60).padStart(2,'0');
        if (vvRecTime) vvRecTime.textContent = m + ':' + ss;
      }, 1000);

      // sequential prompts
      let i = 0;
      function next() {
        if (i > 0) setVvChk(vvPrompts[i-1].key, 'done');
        if (i >= vvPrompts.length) {
          // finish
          clearInterval(vvTimer);
          if (vvPrompt) vvPrompt.textContent = 'Verification recorded. Processing…';
          vvSeq = setTimeout(finishVideo, 1500);
          return;
        }
        const p = vvPrompts[i];
        if (vvPrompt) vvPrompt.textContent = p.text;
        setVvChk(p.key, 'active');
        i++;
        vvSeq = setTimeout(next, 2600);
      }
      next();
    }
    function finishVideo() {
      progress.video = true;
      if (vvRec) vvRec.style.display = 'none';
      if (vvPrompt) { vvPrompt.style.display = 'block'; vvPrompt.textContent = '✓ Video verification complete'; }
      if (vvFrame) vvFrame.classList.remove('live');
      if (vvRetakeBtn) vvRetakeBtn.style.display = '';
      markStepDone('video');
      renderProgress();
      VVE.set({ vVideo: true });
    }
    if (vvStartBtn) vvStartBtn.addEventListener('click', runVideo);
    if (vvRetakeBtn) vvRetakeBtn.addEventListener('click', () => { resetVideo(); runVideo(); });

    // ===== SUBMIT =====
    function showVerified() {
      const icon = scope.querySelector('#verifyStatusIcon');
      const title = scope.querySelector('#verifyStatusTitle');
      const sub = scope.querySelector('#verifyStatusSub');
      const badge = scope.querySelector('#verifyStatusBadge');
      if (icon) { icon.className = 'verify-status-icon verified'; icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'; }
      if (title) title.textContent = 'Identity verified';
      if (sub) sub.textContent = isSeller ? 'You can list opportunities, meet buyers, and receive payouts.' : 'You can unlock opportunities and engage with listers.';
      if (badge) { badge.textContent = 'Verified'; badge.className = 'verify-status-badge verified'; }
      if (progressBar) progressBar.style.width = '100%';
      if (progressLabel) progressLabel.textContent = 'Verification complete';
      markStepDone('done');
      if (verifyActions) verifyActions.style.display = 'none';
      if (reviewState) {
        reviewState.style.display = 'block';
        reviewState.innerHTML = '<div class="vrs-icon" style="background:rgba(22,163,74,.1);border-color:rgba(22,163,74,.25);color:var(--green);"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><h3 style="font-family:\'Instrument Serif\',serif;font-weight:400;font-size:1.6rem;margin:.75rem 0 .5rem;">You are verified</h3><p style="color:var(--text-muted);font-size:.92rem;max-width:420px;margin:0 auto 1.5rem;">Your account is fully active. Everything on vvEntra is now open to you.</p><div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;">' + (isSeller ? '<a href="#list" data-route="list" class="btn btn-orange">List an opportunity <span class="arrow">→</span></a><a href="#browse" data-route="browse" class="btn btn-outline">Browse the market</a>' : '<a href="#browse" data-route="browse" class="btn btn-orange">Browse opportunities <span class="arrow">→</span></a>') + '</div>';
      }
    }
    function showUnderReview() {
      const title = scope.querySelector('#verifyStatusTitle');
      const sub = scope.querySelector('#verifyStatusSub');
      const badge = scope.querySelector('#verifyStatusBadge');
      if (title) title.textContent = 'Under review';
      if (sub) sub.textContent = 'Your verification has been submitted. This completes shortly.';
      if (badge) badge.textContent = 'Under review';
      if (verifyActions) verifyActions.style.display = 'none';
      if (reviewState) {
        reviewState.style.display = 'block';
        reviewState.innerHTML = '<div class="vrs-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><h3 style="font-family:\'Instrument Serif\',serif;font-weight:400;font-size:1.6rem;margin:.75rem 0 .5rem;">Under review</h3><p style="color:var(--text-muted);font-size:.92rem;max-width:400px;margin:0 auto 1.5rem;">Your verification has been submitted. We are confirming your details. This usually completes within moments in this preview.</p>';
      }
      clearTimeout(autoApproveTimer);
      autoApproveTimer = setTimeout(() => {
        VVE.set({ stage: 'verified', verifyState: 'verified' });
        showVerified();
        showGateToast('Identity verified. Your account is now active.');
      }, 4000);
    }
    let autoApproveTimer = null;

    if (submitBtn) submitBtn.addEventListener('click', () => {
      if (!allDone()) return;
      if (!VVE.hasApplied()) {
        showGateToast('Please apply for access first. Redirecting…');
        setTimeout(() => { location.hash = 'apply'; }, 1400);
        return;
      }
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;
      VVE.set({ verifyState: 'review' });
      setTimeout(() => { showUnderReview(); if (reviewState) reviewState.scrollIntoView({behavior:'smooth',block:'center'}); }, 900);
    });

    // ===== restore saved progress / state =====
    scope._vveSync = function() {
      const s = VVE.get();
      if (s.verifyState === 'verified') { showVerified(); return; }
      if (s.vLinkedin) completeLinkedin();
      if (isSeller && s.vBank) completeBank();
      if (isSeller && s.vVideo) { progress.video = true; if (vvStartBtn) vvStartBtn.style.display='none'; if (vvRetakeBtn) vvRetakeBtn.style.display=''; if (vvPrompt){vvPrompt.style.display='block';vvPrompt.textContent='✓ Video verification complete';} ['name','id','age','live'].forEach(k=>setVvChk(k,'done')); markStepDone('video'); }
      if (s.verifyState === 'review') { showUnderReview(); return; }
      renderProgress();
    };

    // init
    applyRole();
    activateStep('linkedin');
    renderProgress();
    scope._vveSync();
  };


  // ===== Page init: profile =====
  pageInits['profile'] = function(scope) {
    const lockedEl = scope.querySelector('#profileLocked');
    const activeEl = scope.querySelector('#profileActive');
    const s = VVE.get();

    // gate
    if (s.stage !== 'verified') {
      if (lockedEl) lockedEl.style.display = 'block';
      if (activeEl) activeEl.style.display = 'none';
      return;
    }
    if (lockedEl) lockedEl.style.display = 'none';
    if (activeEl) activeEl.style.display = 'block';

    const isSeller = (s.role === 'architect');

    // default profile scaffold
    function blankProfile() {
      return { headline:'', location:'', about:'', focus:'', expertise:[], experience:[], education:[], cover:0, photo:false, widgets:['quad','rank'] };
    }
    let prof = (s.profile && typeof s.profile === 'object') ? Object.assign(blankProfile(), s.profile) : blankProfile();
    if (!Array.isArray(prof.widgets)) prof.widgets = ['quad','rank'];
    // migrate older widget keys to the new positioning map + ranking
    { const oldKeys=['listed','investing','booming']; if (prof.widgets.some(k=>oldKeys.indexOf(k)!==-1)) prof.widgets = ['quad','rank']; }

    const initials = (s.name || 'You').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'YOU';

    // ---------- market widget definitions ----------
    // Each sector: name, growth %, market activity (0-100), demand growth (0-100), zone
    const SECTORS = [
      { name:'AI Compliance', cat:'AI · Regulatory', g:28, act:78, dem:92, zone:'star', listed:0 },
      { name:'RegTech', cat:'Compliance · Audit', g:26, act:62, dem:88, zone:'star', listed:0 },
      { name:'AI Agents', cat:'AI · Vertical ops', g:24, act:82, dem:90, zone:'star', listed:0 },
      { name:'B2B SaaS', cat:'Vertical · Mid-market', g:22, act:90, dem:80, zone:'star', listed:0 },
      { name:'Workflow AI', cat:'AI · Automation', g:16, act:66, dem:74, zone:'star', listed:0 },
      { name:'Vertical SaaS', cat:'Specialty industries', g:14, act:70, dem:70, zone:'star', listed:0 },
      { name:'Climate Tech', cat:'Industrial · Carbon', g:18, act:44, dem:66, zone:'cash', listed:0 },
      { name:'Healthtech', cat:'Diagnostics · Care', g:12, act:40, dem:55, zone:'cash', listed:0 },
      { name:'Fintech SMB', cat:'Lending · Payments', g:9, act:52, dem:48, zone:'cash', listed:0 },
      { name:'D2C Wellness', cat:'Consumer · Brand', g:6, act:46, dem:38, zone:'cash', listed:0 },
      { name:'Marketplaces', cat:'Network · Platform', g:4, act:50, dem:34, zone:'cash', listed:0 },
      { name:'Edtech', cat:'Reskill · Workforce', g:3, act:30, dem:28, zone:'cash', listed:0 },
      { name:'Crypto / Web3', cat:'Cooling · Out of favor', g:-8, act:34, dem:22, zone:'dog', listed:0 },
      { name:'NFT / Web3', cat:'Declining', g:-12, act:24, dem:14, zone:'dog', listed:0 },
      { name:'Web3 Gaming', cat:'Avoid', g:-18, act:18, dem:10, zone:'dog', listed:0 }
    ];

    // figure out which sectors THIS user lists in, from their focus + expertise
    function userSectorKeys() {
      const hay = ((prof.focus||'') + ' ' + (prof.expertise||[]).join(' ') + ' ' + (prof.headline||'')).toLowerCase();
      const map = {
        'AI Agents':['ai agent','ai','agent','automation','workflow'],
        'Workflow AI':['workflow','automation','ops','operations'],
        'B2B SaaS':['b2b','saas','software','vertical'],
        'RegTech':['regtech','compliance','regulatory'],
        'AI Compliance':['compliance','ai compliance'],
        'Fintech SMB':['fintech','lending','payments','finance'],
        'Healthtech':['health','healthtech','diagnostic','care'],
        'D2C Wellness':['d2c','consumer','wellness','brand','ecommerce','e-commerce'],
        'Climate Tech':['climate','carbon','energy','industrial'],
        'Vertical SaaS':['vertical','specialty'],
        'Marketplaces':['marketplace','platform','network'],
        'Edtech':['edtech','education','reskill']
      };
      const hit = new Set();
      Object.keys(map).forEach(sec => { if (map[sec].some(t => hay.indexOf(t) !== -1)) hit.add(sec); });
      // sensible default so the highlight is never empty for a verified lister
      if (hit.size === 0 && isSeller) { hit.add('AI Agents'); hit.add('Workflow AI'); hit.add('B2B SaaS'); }
      return hit;
    }

    // ----- QUADRANT widget (matches home page) -----
    function widgetQuadHTML() {
      const mine = userSectorKeys();
      // map activity/demand (0-100) into the quad coordinate space
      // x: 80..1160 by demand growth ; y: 480..40 by market activity (inverted)
      const X0=110, X1=1130, Y0=470, Y1=55;
      const px = d => X0 + (d/100) * (X1 - X0);
      const py = a => Y0 - (a/100) * (Y0 - Y1);
      let dots = '';
      SECTORS.forEach(s => {
        const x = Math.round(px(s.dem)), y = Math.round(py(s.act));
        const r = s.zone==='dog' ? 6 : (7 + Math.round(s.act/22));
        const isMine = mine.has(s.name);
        const cls = 'quad-dot ' + (s.zone==='star'?'star':s.zone==='cash'?'cash':'dog') + (isMine?' mine':'');
        if (isMine) dots += '<circle class="quad-dot-pulse mine-pulse" cx="'+x+'" cy="'+y+'" r="'+(r+3)+'"/>';
        else if (s.zone==='star') dots += '<circle class="quad-dot-pulse" cx="'+x+'" cy="'+y+'" r="'+(r+2)+'"/>';
        dots += '<circle class="'+cls+'" cx="'+x+'" cy="'+y+'" r="'+r+'"/>';
        const lx = x + r + 6;
        dots += '<text class="quad-label'+(isMine?' mine':'')+'" x="'+lx+'" y="'+(y+4)+'">'+s.name+' · '+(s.g>0?'+':'')+s.g+'%'+(isMine?'  ◆ you':'')+'</text>';
      });
      return '<svg class="quad-svg" viewBox="0 0 1200 540" preserveAspectRatio="xMidYMid meet">'
        + '<rect class="quad-bg-tl" x="80" y="40" width="540" height="220"/>'
        + '<rect class="quad-bg-tr" x="620" y="40" width="540" height="220"/>'
        + '<rect class="quad-bg-bl" x="80" y="260" width="540" height="220"/>'
        + '<rect class="quad-bg-br" x="620" y="260" width="540" height="220"/>'
        + '<line class="quad-line" x1="620" y1="40" x2="620" y2="480"/>'
        + '<line class="quad-line" x1="80" y1="260" x2="1160" y2="260"/>'
        + '<text class="quad-zone-title" x="630" y="65">Stars</text><text class="quad-zone-sub" x="630" y="80">Hot demand · fast growth</text>'
        + '<text class="quad-zone-title" x="90" y="65">Rising</text><text class="quad-zone-sub" x="90" y="80">Lower activity · momentum</text>'
        + '<text class="quad-zone-title" x="630" y="290">Cash cows</text><text class="quad-zone-sub" x="630" y="305">Reliable demand · slow growth</text>'
        + '<text class="quad-zone-title" x="90" y="290" fill="#DC2626">Out of favor</text><text class="quad-zone-sub" x="90" y="305">Avoid building here</text>'
        + '<line class="quad-axis" x1="80" y1="480" x2="1160" y2="480"/><line class="quad-axis" x1="80" y1="40" x2="80" y2="480"/>'
        + '<path class="quad-axis-arrow" d="M 1160 480 L 1170 480 M 1166 476 L 1170 480 L 1166 484"/><path class="quad-axis-arrow" d="M 80 40 L 80 30 M 76 34 L 80 30 L 84 34"/>'
        + '<text class="quad-axis-label" x="620" y="498" text-anchor="middle">Demand growth →</text>'
        + '<text class="quad-axis-label" x="70" y="260" transform="rotate(-90 70 260)" style="text-anchor:start;">Market activity ↑</text>'
        + dots + '</svg>';
    }

    // ----- DEMAND RANKING widget (rising + cooling, matches home) -----
    function widgetRankHTML() {
      const mine = userSectorKeys();
      const sorted = SECTORS.slice().sort((a,b)=>b.g-a.g);
      const maxAbs = Math.max.apply(null, SECTORS.map(s=>Math.abs(s.g)));
      const rows = sorted.map((s,i) => {
        const up = s.g >= 0;
        const w = Math.round((Math.abs(s.g)/maxAbs)*46);
        const isMine = mine.has(s.name);
        const spark = up ? 'M0,24 L13,21 L26,18 L40,14 L53,10 L66,6 L80,3' : 'M0,6 L13,9 L26,12 L40,15 L53,18 L66,21 L80,24';
        return '<div class="bars-row pwrank-row'+(isMine?' mine':'')+'">'
          + '<span class="rnk">'+String(i+1).padStart(2,'0')+'</span>'
          + '<span class="nm"><span class="sect">'+s.name+(isMine?' <span class="pwrank-you">◆ you list here</span>':'')+'</span><span class="cat">'+s.cat+'</span></span>'
          + '<div class="bar-wrap in" style="--w:'+w+'%;"><div class="bar-fill '+(up?'up':'dn')+'"></div></div>'
          + '<span class="pct '+(up?'up':'dn')+'">'+(up?'+':'−')+Math.abs(s.g).toFixed(1)+'%</span>'
          + '<span class="spark '+(up?'up':'dn')+'"><svg viewBox="0 0 80 28" preserveAspectRatio="none"><path class="line" d="'+spark+'"/></svg></span>'
          + '</div>';
      }).join('');
      return '<div class="pwrank-scroll">'+rows+'</div>';
    }

    function renderWidgets() {
      const grid = scope.querySelector('#profileWidgetsGrid');
      const empty = scope.querySelector('#pwEmpty');
      if (!grid) return;
      const sel = (prof.widgets || []);
      const show = { quad: sel.indexOf('quad')!==-1, rank: sel.indexOf('rank')!==-1 };
      // migrate older saved widget keys to the two new ones
      if (!show.quad && !show.rank) {
        if (sel.length) { show.quad = true; show.rank = true; }
        else { grid.innerHTML = ''; if (empty) empty.style.display='block'; return; }
      }
      if (empty) empty.style.display = 'none';
      let html = '';
      if (show.quad) {
        html += '<div class="pw-card pw-card-full"><div class="pw-card-head"><h3 class="pw-card-title">Sector positioning · where you build</h3><span class="pw-card-tag">Quadrant · live</span></div>'
          + widgetQuadHTML()
          + '<div class="pw-quad-key"><span class="pwk star">● Stars</span><span class="pwk cash">● Cash cows</span><span class="pwk dog">● Out of favor</span><span class="pwk you">◆ Your sectors</span></div></div>';
      }
      if (show.rank) {
        html += '<div class="pw-card pw-card-full"><div class="pw-card-head"><h3 class="pw-card-title">What is in demand · ranked by 7-day change</h3><span class="pw-card-tag">Rising &amp; cooling</span></div>'
          + widgetRankHTML() + '</div>';
      }
      grid.innerHTML = html;
      // animate bars in
      requestAnimationFrame(()=>{ grid.querySelectorAll('.bar-wrap').forEach(b=>b.classList.add('in')); });
    }

    // ---------- RENDER VIEW ----------
    function esc(t){ return (t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function render() {
      // name + initials
      const nameEl = scope.querySelector('#profileName'); if (nameEl) nameEl.textContent = s.name || 'Your name';
      const av = scope.querySelector('#profileAvatarInitials'); if (av) av.textContent = initials;
      // cover
      const cover = scope.querySelector('#profileCover'); if (cover) cover.className = 'profile-cover c' + (prof.cover||0);
      // photo
      const avatar = scope.querySelector('#profileAvatar');
      if (avatar) {
        if (prof.photo) { avatar.innerHTML = '<div style="width:100%;height:100%;background:linear-gradient(135deg,#8a8a8a,#5a5a5a);display:flex;align-items:center;justify-content:center;color:#fff;font-family:\'Instrument Serif\',serif;font-size:2.6rem;">'+initials+'</div>'; }
        else { avatar.innerHTML = '<span>'+initials+'</span>'; }
      }
      // headline / location
      const hl = scope.querySelector('#profileHeadline');
      if (hl) { hl.textContent = prof.headline || 'Add a headline that says what you do'; hl.style.fontStyle = prof.headline ? 'normal':'italic'; hl.style.color = prof.headline ? 'var(--text-muted)':'var(--text-faint)'; }
      const loc = scope.querySelector('#profileLocationText');
      if (loc) loc.textContent = prof.location || 'Add your location';
      // about
      const ab = scope.querySelector('#profileAbout');
      if (ab) { ab.textContent = prof.about || 'Write a short professional summary. What you have built, what you are known for, and what you bring to the table.'; ab.style.fontStyle = prof.about?'normal':'italic'; ab.style.color = prof.about?'var(--text-muted)':'var(--text-faint)'; }
      // focus
      const fc = scope.querySelector('#profileFocus');
      if (fc) { fc.textContent = prof.focus || 'Add the sectors you operate in.'; fc.style.fontStyle = prof.focus?'normal':'italic'; fc.style.color = prof.focus?'var(--text-muted)':'var(--text-faint)'; }
      // expertise
      const ex = scope.querySelector('#profileExpertise');
      if (ex) {
        if (prof.expertise && prof.expertise.length) ex.innerHTML = prof.expertise.map(t=>'<span class="profile-tag">'+esc(t)+'</span>').join('');
        else ex.innerHTML = '<p class="profile-empty">Add your areas of expertise.</p>';
      }
      // experience
      const expEl = scope.querySelector('#profileExperience');
      if (expEl) {
        if (prof.experience && prof.experience.length) expEl.innerHTML = prof.experience.map(e=>(
          '<div class="profile-entry"><span class="profile-entry-bullet"></span><div class="profile-entry-body">'
          + '<p class="profile-entry-title">'+esc(e.title||'Role')+'</p>'
          + (e.company?'<p class="profile-entry-sub">'+esc(e.company)+'</p>':'')
          + (e.dates?'<p class="profile-entry-meta">'+esc(e.dates)+'</p>':'')
          + (e.desc?'<p class="profile-entry-desc">'+esc(e.desc)+'</p>':'')
          + '</div></div>'
        )).join('');
        else expEl.innerHTML = '<p class="profile-empty">No experience added yet.</p>';
      }
      // education
      const eduEl = scope.querySelector('#profileEducation');
      if (eduEl) {
        if (prof.education && prof.education.length) eduEl.innerHTML = prof.education.map(e=>(
          '<div class="profile-entry"><span class="profile-entry-bullet"></span><div class="profile-entry-body">'
          + '<p class="profile-entry-title">'+esc(e.school||'Institution')+'</p>'
          + (e.degree?'<p class="profile-entry-sub">'+esc(e.degree)+'</p>':'')
          + (e.dates?'<p class="profile-entry-meta">'+esc(e.dates)+'</p>':'')
          + '</div></div>'
        )).join('');
        else eduEl.innerHTML = '<p class="profile-empty">No education added yet.</p>';
      }
      // role label + seller-only trust items
      const rl = scope.querySelector('#profileRoleLabel'); if (rl) rl.textContent = isSeller ? 'Lister / Architect' : 'Buyer / Investor';
      scope.querySelectorAll('#profileTrustStrip .seller-only').forEach(el => el.style.display = isSeller ? '' : 'none');
      // track record (tier + totals)
      const e = (typeof ensureEarnings === 'function') ? ensureEarnings() : null;
      if (e) {
        const tier = tierFor(e.total);
        const tb = scope.querySelector('#profileTierBadge'); if (tb) { tb.textContent = tier.name + ' tier'; tb.className = 'tier-badge tier-' + tier.cls; }
        const ttl = scope.querySelector('#profileTrackTotalLbl'); if (ttl) ttl.textContent = isSeller ? 'Total earned' : 'Total deployed';
        const tt = scope.querySelector('#profileTrackTotal'); if (tt) tt.textContent = fmtMoney(e.total);
        const td = scope.querySelector('#profileTrackDeals'); if (td) td.textContent = e.deals;
      }
      // seller-only sections (stats label + featured)
      const featSec = scope.querySelector('#profileFeaturedSection');
      if (featSec) featSec.style.display = isSeller ? '' : 'none';
      // stats strip
      const lbl1 = scope.querySelector('#psLbl1'); const stat1 = scope.querySelector('#psStat1');
      if (isSeller) {
        if (lbl1) lbl1.textContent = 'Opportunities listed';
        if (stat1) stat1.textContent = (prof.listings && prof.listings.length) ? prof.listings.length : (composedListing ? 1 : 0);
      } else {
        if (lbl1) lbl1.textContent = 'Opportunities unlocked';
        if (stat1) stat1.textContent = '0';
      }
      // featured opportunities
      const feat = scope.querySelector('#profileFeatured');
      if (feat && isSeller) {
        const items = [];
        if (composedListing) {
          items.push({ title: composedListing.title || 'Untitled opportunity', price: composedListing.price || '—', sector: composedListing.sector || 'General', status: 'Live' });
        }
        if (!items.length) {
          feat.innerHTML = '<p class="profile-empty">No opportunities listed yet. Once you publish a listing, it appears here for buyers to see.</p>';
        } else {
          feat.innerHTML = items.map(it => (
            '<div class="pf-card" onclick="location.hash=\'listing\'">'
            + '<div class="pf-card-top"><p class="pf-card-title">'+esc(it.title)+'</p><span class="pf-card-price">'+esc(String(it.price))+'</span></div>'
            + '<p class="pf-card-meta"><span class="pf-card-status"><span class="dot"></span>'+esc(it.status)+'</span><span>'+esc(it.sector)+'</span></p>'
            + '</div>'
          )).join('');
        }
      }
      // meter
      renderMeter();
      // market widgets
      renderWidgets();
    }

    function renderMeter() {
      let filled = 1; // verified baseline
      if (prof.photo) filled++;
      if (prof.headline) filled++;
      if (prof.about) filled++;
      if (prof.expertise && prof.expertise.length) filled++;
      if (prof.experience && prof.experience.length) filled++;
      if (prof.education && prof.education.length) filled++;
      const total = 7;
      const pct = Math.round((filled/total)*100);
      const bar = scope.querySelector('#profileMeterBar'); if (bar) bar.style.width = pct + '%';
      const pe = scope.querySelector('#profileMeterPct'); if (pe) pe.textContent = pct + '%';
      const note = scope.querySelector('#profileMeterNote');
      if (note) note.textContent = pct >= 100 ? 'Your profile is complete. This is how a serious operator presents.' : 'A complete profile earns more trust. Add a photo, headline, about, expertise, experience, and education.';
    }

    // ---------- EDIT DRAWER ----------
    const drawer = scope.querySelector('#profileEditDrawer');
    const backdrop = scope.querySelector('#profileEditBackdrop');
    const expListEl = scope.querySelector('#pedExpList');
    const eduListEl = scope.querySelector('#pedEduList');
    let draft;

    function openDrawer() {
      draft = JSON.parse(JSON.stringify(prof));
      scope.querySelector('#pedHeadline').value = draft.headline || '';
      scope.querySelector('#pedLocation').value = draft.location || '';
      scope.querySelector('#pedAbout').value = draft.about || '';
      scope.querySelector('#pedFocus').value = draft.focus || '';
      scope.querySelector('#pedExpertise').value = (draft.expertise||[]).join(', ');
      const pedInit = scope.querySelector('#pedAvatarInitials'); if (pedInit) pedInit.textContent = initials;
      // widget toggles
      if (!Array.isArray(draft.widgets)) draft.widgets = ['quad','rank'];
      scope.querySelectorAll('.ped-wtoggle').forEach(b => b.classList.toggle('on', draft.widgets.indexOf(b.dataset.widget) !== -1));
      // cover selection
      scope.querySelectorAll('.ped-cover-opt').forEach(b => b.classList.toggle('sel', parseInt(b.dataset.cover)===(draft.cover||0)));
      scope.querySelector('#pedPhotoClear').style.display = draft.photo ? '' : 'none';
      renderDraftExp(); renderDraftEdu();
      if (backdrop) backdrop.classList.add('open');
      if (drawer) drawer.classList.add('open');
    }
    function closeDrawer() {
      if (backdrop) backdrop.classList.remove('open');
      if (drawer) drawer.classList.remove('open');
    }

    function renderDraftExp() {
      if (!expListEl) return;
      expListEl.innerHTML = (draft.experience||[]).map((e,i)=>(
        '<div class="ped-entry" data-i="'+i+'"><button class="ped-entry-remove" data-rm-exp="'+i+'">&times;</button>'
        + '<input class="apply-input" data-exp="title" data-i="'+i+'" placeholder="Title (e.g. COO)" value="'+esc(e.title||'')+'">'
        + '<input class="apply-input" data-exp="company" data-i="'+i+'" placeholder="Company" value="'+esc(e.company||'')+'">'
        + '<input class="apply-input" data-exp="dates" data-i="'+i+'" placeholder="Dates (e.g. 2020 – 2024)" value="'+esc(e.dates||'')+'">'
        + '<textarea class="apply-input apply-textarea" data-exp="desc" data-i="'+i+'" placeholder="What you did" style="min-height:60px;">'+esc(e.desc||'')+'</textarea>'
        + '</div>'
      )).join('');
    }
    function renderDraftEdu() {
      if (!eduListEl) return;
      eduListEl.innerHTML = (draft.education||[]).map((e,i)=>(
        '<div class="ped-entry" data-i="'+i+'"><button class="ped-entry-remove" data-rm-edu="'+i+'">&times;</button>'
        + '<input class="apply-input" data-edu="school" data-i="'+i+'" placeholder="Institution" value="'+esc(e.school||'')+'">'
        + '<input class="apply-input" data-edu="degree" data-i="'+i+'" placeholder="Degree / field" value="'+esc(e.degree||'')+'">'
        + '<input class="apply-input" data-edu="dates" data-i="'+i+'" placeholder="Years (e.g. 2014 – 2018)" value="'+esc(e.dates||'')+'">'
        + '</div>'
      )).join('');
    }

    // collect draft inputs from DOM
    function syncDraftFromInputs() {
      draft.headline = scope.querySelector('#pedHeadline').value.trim();
      draft.location = scope.querySelector('#pedLocation').value.trim();
      draft.about = scope.querySelector('#pedAbout').value.trim();
      draft.focus = scope.querySelector('#pedFocus').value.trim();
      draft.expertise = scope.querySelector('#pedExpertise').value.split(',').map(t=>t.trim()).filter(Boolean);
      (expListEl.querySelectorAll('.ped-entry')||[]).forEach(row=>{
        const i = parseInt(row.dataset.i);
        if (!draft.experience[i]) return;
        row.querySelectorAll('[data-exp]').forEach(inp=>{ draft.experience[i][inp.dataset.exp] = inp.value.trim(); });
      });
      (eduListEl.querySelectorAll('.ped-entry')||[]).forEach(row=>{
        const i = parseInt(row.dataset.i);
        if (!draft.education[i]) return;
        row.querySelectorAll('[data-edu]').forEach(inp=>{ draft.education[i][inp.dataset.edu] = inp.value.trim(); });
      });
    }

    // ---------- wire (guard against double-binding) ----------
    if (!scope._profileWired) {
      scope._profileWired = true;

      scope.querySelector('#profileEditBtn').addEventListener('click', openDrawer);
      scope.querySelector('#profileAvatarEdit').addEventListener('click', openDrawer);
      scope.querySelector('#profileCoverEdit').addEventListener('click', openDrawer);
      scope.querySelector('#pedClose').addEventListener('click', closeDrawer);
      scope.querySelector('#pedCancel').addEventListener('click', closeDrawer);
      if (backdrop) backdrop.addEventListener('click', closeDrawer);

      // public view toggle
      const pvBtn = scope.querySelector('#profilePublicViewBtn');
      const exitBtn = scope.querySelector('#profileExitPreview');
      const engageBtn = scope.querySelector('#profileEngageBtn');
      if (pvBtn) pvBtn.addEventListener('click', () => {
        activeEl.classList.add('profile-public-mode');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      if (exitBtn) exitBtn.addEventListener('click', () => {
        activeEl.classList.remove('profile-public-mode');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      if (engageBtn) engageBtn.addEventListener('click', () => {
        showGateToast('In a live deal, this opens a request to engage with the lister.');
      });

      // cover options
      scope.querySelectorAll('.ped-cover-opt').forEach(b=>b.addEventListener('click', ()=>{
        draft.cover = parseInt(b.dataset.cover);
        scope.querySelectorAll('.ped-cover-opt').forEach(x=>x.classList.toggle('sel', x===b));
      }));
      // photo
      scope.querySelector('#pedPhotoBtn').addEventListener('click', ()=>{
        draft.photo = true;
        scope.querySelector('#pedPhotoClear').style.display = '';
        const pv = scope.querySelector('#pedAvatarPreview');
        if (pv) pv.style.background = 'linear-gradient(135deg,#8a8a8a,#5a5a5a)';
      });
      scope.querySelector('#pedPhotoClear').addEventListener('click', ()=>{
        draft.photo = false;
        scope.querySelector('#pedPhotoClear').style.display = 'none';
        const pv = scope.querySelector('#pedAvatarPreview');
        if (pv) pv.style.background = 'linear-gradient(135deg, #E2571B, #B8421A)';
      });
      // add experience / education
      scope.querySelector('#pedAddExp').addEventListener('click', ()=>{ syncDraftFromInputs(); draft.experience.push({title:'',company:'',dates:'',desc:''}); renderDraftExp(); });
      scope.querySelector('#pedAddEdu').addEventListener('click', ()=>{ syncDraftFromInputs(); draft.education.push({school:'',degree:'',dates:''}); renderDraftEdu(); });
      // widget toggles
      scope.querySelectorAll('.ped-wtoggle').forEach(b => b.addEventListener('click', ()=>{
        if (!Array.isArray(draft.widgets)) draft.widgets = [];
        b.classList.toggle('on');
        const key = b.dataset.widget;
        const i = draft.widgets.indexOf(key);
        if (b.classList.contains('on') && i === -1) draft.widgets.push(key);
        else if (!b.classList.contains('on') && i !== -1) draft.widgets.splice(i,1);
      }));
      // customize widgets button -> open drawer
      const pwBtn = scope.querySelector('#pwCustomizeBtn');
      if (pwBtn) pwBtn.addEventListener('click', openDrawer);
      // remove (delegated)
      expListEl.addEventListener('click', (e)=>{ const t=e.target.closest('[data-rm-exp]'); if(!t) return; syncDraftFromInputs(); draft.experience.splice(parseInt(t.dataset.rmExp),1); renderDraftExp(); });
      eduListEl.addEventListener('click', (e)=>{ const t=e.target.closest('[data-rm-edu]'); if(!t) return; syncDraftFromInputs(); draft.education.splice(parseInt(t.dataset.rmEdu),1); renderDraftEdu(); });
      // save
      scope.querySelector('#pedSave').addEventListener('click', ()=>{
        syncDraftFromInputs();
        prof = JSON.parse(JSON.stringify(draft));
        VVE.set({ profile: prof });
        closeDrawer();
        render();
        showGateToast('Profile saved.');
      });
    }

    if (activeEl) activeEl.classList.remove('profile-public-mode');
    render();
  };

  // ===== Page init: earnings =====
  pageInits['earnings'] = function(scope) {
    const lockedEl = scope.querySelector('#earningsLocked');
    const activeEl = scope.querySelector('#earningsActive');
    const s = VVE.get();
    if (s.stage !== 'verified') {
      if (lockedEl) lockedEl.style.display = 'block';
      if (activeEl) activeEl.style.display = 'none';
      return;
    }
    if (lockedEl) lockedEl.style.display = 'none';
    if (activeEl) activeEl.style.display = 'block';

    const isSeller = (s.role === 'architect');
    const e = ensureEarnings();
    const tier = tierFor(e.total);
    const nt = nextTier(e.total);

    // marker + labels
    const marker = scope.querySelector('#earnMarker'); if (marker) marker.textContent = isSeller ? 'Earnings' : 'Capital deployed';
    const intro = scope.querySelector('#earnIntro');
    if (intro) intro.textContent = isSeller
      ? 'Every completed deal, your current escrow, and the tier you have earned. This history is part of your verified reputation.'
      : 'Every opportunity you have engaged, the capital you have deployed, and the tier you have earned as a serious buyer.';

    // tier card
    const badge = scope.querySelector('#etcBadge');
    if (badge) { badge.textContent = tier.name + ' tier'; badge.className = 'etc-badge tier-' + tier.cls; }
    const note = scope.querySelector('#etcNote'); if (note) note.textContent = tier.note;
    const pBar = scope.querySelector('#etcProgressBar');
    const pText = scope.querySelector('#etcProgressText');
    const pNext = scope.querySelector('#etcNextName');
    const pSub = scope.querySelector('#etcProgressSub');
    if (nt) {
      const prevMin = tier.min;
      const pct = Math.max(4, Math.min(100, Math.round(((e.total - prevMin) / (nt.min - prevMin)) * 100)));
      if (pBar) pBar.style.width = pct + '%';
      if (pNext) pNext.textContent = nt.name;
      if (pSub) pSub.textContent = fmtMoney(nt.min - e.total) + ' more in deals to reach ' + nt.name + ' tier.';
    } else {
      if (pBar) pBar.style.width = '100%';
      if (pText) pText.textContent = 'Top tier reached';
      if (pNext) pNext.textContent = '★';
      if (pSub) pSub.textContent = 'You hold the highest tier on the platform.';
    }

    // summary cards
    const setT = (id, v) => { const el = scope.querySelector(id); if (el) el.textContent = v; };
    setT('#ecTotal', fmtMoney(e.total));
    setT('#ecTotalLbl', isSeller ? 'Total earned' : 'Total deployed');
    setT('#ecEscrow', fmtMoney(e.escrow));
    setT('#ecAvail', fmtMoney(e.available));
    setT('#ecDeals', e.deals);

    // history
    const histTitle = scope.querySelector('#earnHistTitle'); if (histTitle) histTitle.textContent = isSeller ? 'Earnings history' : 'Engagement history';
    const hist = scope.querySelector('#earnHistory');
    if (hist) {
      hist.innerHTML = (e.history || []).map(h => {
        const st = (h.status || '').toLowerCase();
        return '<div class="earn-row"><div class="er-main"><span class="er-title">'+h.title+'</span><span class="er-meta">'+h.id+' · '+h.counterparty+' · '+h.date+'</span></div>'
          + '<span class="er-status '+st+'">'+h.status+'</span>'
          + '<span class="er-amount">'+fmtMoney(h.amount)+'</span></div>';
      }).join('');
    }
  };

  // ===== Page init: settings =====
  pageInits['settings'] = function(scope) {
    const lockedEl = scope.querySelector('#settingsLocked');
    const activeEl = scope.querySelector('#settingsActive');
    const s = VVE.get();
    if (s.stage !== 'verified') {
      if (lockedEl) lockedEl.style.display = 'block';
      if (activeEl) activeEl.style.display = 'none';
      return;
    }
    if (lockedEl) lockedEl.style.display = 'none';
    if (activeEl) activeEl.style.display = 'block';

    const setT = (id, v) => { const el = scope.querySelector(id); if (el) el.textContent = v; };
    setT('#setName', s.name || '—');
    setT('#setEmail', s.email || '—');
    setT('#setRole', (s.role === 'architect') ? 'Lister / Architect' : 'Buyer / Investor');

    if (!scope._settingsWired) {
      scope._settingsWired = true;
      // toggles (persist into settings object)
      scope.querySelectorAll('.set-toggle').forEach(btn => {
        const key = btn.dataset.toggle;
        const saved = (s.settings && typeof s.settings[key] === 'boolean') ? s.settings[key] : btn.classList.contains('on');
        btn.classList.toggle('on', saved);
        btn.addEventListener('click', () => {
          btn.classList.toggle('on');
          const cur = VVE.get().settings || {};
          cur[key] = btn.classList.contains('on');
          VVE.set({ settings: cur });
        });
      });
      const lo = scope.querySelector('#setLogoutBtn');
      if (lo) lo.addEventListener('click', () => { VVE.reset(); showGateToast('You have been logged out.'); setTimeout(()=>{ location.hash='home'; }, 600); });
      const rs = scope.querySelector('#setResetBtn');
      if (rs) rs.addEventListener('click', () => { VVE.reset(); showGateToast('Demo account reset. You are now a guest.'); setTimeout(()=>{ location.hash='home'; }, 800); });
    } else {
      // re-sync toggle states from saved settings
      scope.querySelectorAll('.set-toggle').forEach(btn => {
        const key = btn.dataset.toggle;
        if (s.settings && typeof s.settings[key] === 'boolean') btn.classList.toggle('on', s.settings[key]);
      });
    }
  };
  // ===== Page init: terms =====
  pageInits['terms'] = function(scope) {
    // Static page, no JS needed
  };

  
  document.addEventListener('DOMContentLoaded', () => {
    const { route, anchor } = parseRoute();
    showPage(route, anchor);
    observeReveals();
  });
  
  // If DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    const { route, anchor } = parseRoute();
    showPage(route, anchor);
    observeReveals();
  }
  
})();
