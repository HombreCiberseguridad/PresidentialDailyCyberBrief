const state = {
  archive: [],
  data: null,
  filter: 'All',
};

const els = {
  briefDate:      document.getElementById('brief-date'),
  archiveSelect:  document.getElementById('archive-select'),
  executiveSummary: document.getElementById('executive-summary'),
  newsFilters:    document.getElementById('news-filters'),
  newsGrid:       document.getElementById('news-grid'),
  deepDiveCard:   document.getElementById('deep-dive-card'),
  vulnTableBody:  document.getElementById('vuln-table-body'),
  vulnFootnote:   document.getElementById('vuln-footnote'),
  biggestHacksList: document.getElementById('biggest-hacks-list'),
  headlinesList:  document.getElementById('headlines-list'),
};

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ' + path + ': ' + res.status);
  return res.json();
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function sevClass(s) {
  const k = String(s).toLowerCase();
  if (k.includes('critical')) return 'severity-critical';
  if (k.includes('high'))     return 'severity-high';
  return 'severity-medium';
}

function tagClass(cat) {
  const map = {
    campaign: 'Campaign', threat: 'Threat', hardening: 'Hardening',
    tools: 'Tools', laws: 'Laws', general: 'General',
    '365_threats': '365_Threats',
  };
  return map[String(cat).toLowerCase()] || cat;
}

function sourcesHtml(sources) {
  return (sources || []).map(s =>
    '<a class="source-link" href="' + esc(s.url) + '" target="_blank" rel="noreferrer">' + esc(s.name) + '</a>'
  ).join('');
}

// ── Executive Summary ──────────────────────────────────────────
function renderSummary(items) {
  els.executiveSummary.innerHTML = (items || []).map(item => {
    const text    = typeof item === 'string' ? item : (item.text || '');
    const sources = typeof item === 'object' ? (item.sources || []) : [];
    const srcs    = sources.length ? '<div class="sources summary-sources">' + sourcesHtml(sources) + '</div>' : '';
    return '<article class="summary-item"><p>' + esc(text) + '</p>' + srcs + '</article>';
  }).join('');
}

// ── Category filter pills ──────────────────────────────────────
function renderFilters(items) {
  const cats = ['All', ...new Set((items || []).map(i => i.category).filter(Boolean))];
  els.newsFilters.innerHTML = cats.map(cat =>
    '<button class="pill' + (cat === state.filter ? ' active' : '') +
    '" data-filter="' + esc(cat) + '">' + esc(cat) + '</button>'
  ).join('');
  els.newsFilters.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      renderFilters(state.data.cyber_news || []);
      renderNews(state.data.cyber_news || []);
    });
  });
}

// ── Cyber News cards with collapse/expand ─────────────────────
function renderNews(items) {
  const filtered = state.filter === 'All'
    ? items
    : (items || []).filter(i => i.category === state.filter);

  if (!filtered.length) {
    els.newsGrid.innerHTML = '<div class="empty-state">No stories match this filter.</div>';
    return;
  }

  els.newsGrid.innerHTML = filtered.map((item, idx) => {
    const tc = tagClass(item.category);
    const expandId = 'exp-' + idx;
    const hasExpanded = item.expanded && item.expanded.trim().length > 0;
    const expandBtn = hasExpanded
      ? '<button class="expand-btn" data-target="' + expandId + '">Expand ▸</button>'
      : '';
    const expandDiv = hasExpanded
      ? '<div class="news-expanded" id="' + expandId + '">' + esc(item.expanded) + '</div>'
      : '';

    return (
      '<article class="news-card">' +
        '<div class="news-card-header">' +
          '<h4>' + esc(item.title) + '</h4>' +
          '<span class="tag ' + tc + '">' + esc(item.category) + '</span>' +
        '</div>' +
        '<p class="news-summary">' + esc(item.summary) + '</p>' +
        expandBtn +
        expandDiv +
        '<div class="sources">' + sourcesHtml(item.sources) + '</div>' +
      '</article>'
    );
  }).join('');

  // Wire expand buttons
  els.newsGrid.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const open = target.classList.toggle('open');
      btn.textContent = open ? 'Collapse ▴' : 'Expand ▸';
    });
  });
}

// ── Deep Dive ─────────────────────────────────────────────────
function renderDeepDive(dd) {
  if (!dd || !dd.title) { els.deepDiveCard.innerHTML = '<p class="empty-state">No deep dive today.</p>'; return; }
  els.deepDiveCard.innerHTML =
    '<div class="tag">Most Referenced Story</div>' +
    '<h4 style="margin-top:0.5rem">' + esc(dd.title) + '</h4>' +
    '<p style="margin-top:0.75rem">' + esc(dd.content || dd.body || '') + '</p>' +
    '<div class="sources" style="margin-top:0.75rem">' + sourcesHtml(dd.sources) + '</div>';
}

// ── Vulnerabilities ───────────────────────────────────────────
function renderVulns(vulns, footnote) {
  // Handle both {items, footnote} shape and plain array
  let items = vulns;
  let note  = footnote || '';
  if (vulns && !Array.isArray(vulns) && vulns.items) {
    items = vulns.items;
    note  = vulns.footnote || '';
  }
  els.vulnTableBody.innerHTML = (items || []).map(v =>
    '<tr>' +
      '<td>' + esc(v.cve) + '</td>' +
      '<td>' + esc(v.product) + '</td>' +
      '<td>' + esc(v.cvss != null ? v.cvss : '—') + '</td>' +
      '<td><span class="severity-pill ' + sevClass(v.severity) + '">' + esc(v.severity) + '</span></td>' +
      '<td class="' + (v.exploited || v.active_exploitation ? 'exploited-yes' : 'exploited-no') + '">' +
        (v.exploited || v.active_exploitation ? 'YES' : 'NO') +
      '</td>' +
      '<td>' + esc(v.description) + '</td>' +
    '</tr>'
  ).join('');
  els.vulnFootnote.textContent = note;
}

// ── Biggest Hacks (right sidebar) ─────────────────────────────
function renderBiggestHacks(hacks) {
  if (!els.biggestHacksList) return;
  if (!hacks || !hacks.length) {
    els.biggestHacksList.innerHTML = '<div class="empty-state">None today.</div>';
    return;
  }
  els.biggestHacksList.innerHTML = hacks.map(h => {
    const sc = sevClass(h.severity);
    const url = h.link || (h.sources && h.sources[0] && h.sources[0].url) || '#';
    return (
      '<article class="hack-card">' +
        '<div class="hack-header">' +
          '<span class="severity-pill ' + sc + '">' + esc(h.severity || 'Unknown') + '</span>' +
          '<span class="hack-date">' + esc(h.date || '') + '</span>' +
        '</div>' +
        '<h4><a href="' + esc(url) + '" target="_blank" rel="noreferrer" style="color:inherit;text-decoration:none">' +
          esc(h.title) +
        '</a></h4>' +
        '<p>' + esc(h.summary || '') + '</p>' +
      '</article>'
    );
  }).join('');
}

// ── Recent Headlines (right sidebar) ──────────────────────────
function renderHeadlines(headlines) {
  if (!els.headlinesList) return;

  // Accept both `recent_headlines` and `headlines` key names; accept link or url
  const items = headlines || [];
  if (!items.length) {
    els.headlinesList.innerHTML = '<div class="empty-state">No headlines.</div>';
    return;
  }
  els.headlinesList.innerHTML = items.map(h => {
    const url = h.link || h.url || '#';
    const src = h.source ? '<span class="headline-source">' + esc(h.source) + '</span>' : '';
    return (
      '<a href="' + esc(url) + '" target="_blank" rel="noreferrer" class="headline-link">' +
        esc(h.title || '') + src +
      '</a>'
    );
  }).join('');
}

// ── Archive dropdown ──────────────────────────────────────────
function populateArchiveSelect(archive) {
  if (!els.archiveSelect) return;
  els.archiveSelect.innerHTML =
    '<option value="latest">Latest</option>' +
    (archive || []).map(e =>
      '<option value="' + esc(e.path) + '">' + esc(e.date) + '</option>'
    ).join('');
  els.archiveSelect.addEventListener('change', async e => {
    await loadBrief(e.target.value);
  });
}

// ── Master render ─────────────────────────────────────────────
function renderBrief(data) {
  state.data   = data;
  state.filter = 'All';

  els.briefDate.textContent = data.date || 'Unknown date';

  renderSummary(data.executive_summary || []);
  renderFilters(data.cyber_news || []);
  renderNews(data.cyber_news || []);
  renderDeepDive(data.deep_dive || {});
  renderVulns(data.vulnerabilities || []);
  renderBiggestHacks(data.biggest_hacks || []);
  // Accept either key name the workflow might use
  renderHeadlines(data.recent_headlines || data.headlines || []);
}

// ── Load a brief by path ──────────────────────────────────────
async function loadBrief(path) {
  const p = (!path || path === 'latest') ? 'latest/data.json' : path;
  const data = await fetchJson(p);
  renderBrief(data);
  const match = (state.archive || []).find(e => e.path === p);
  els.archiveSelect.value = match ? p : 'latest';
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
  try {
    const idx = await fetchJson('archive/index.json');
    state.archive = idx.entries || [];
    populateArchiveSelect(state.archive);
    await loadBrief('latest/data.json');
  } catch (err) {
    console.error(err);
    els.briefDate.textContent = 'Failed to load briefing: ' + err.message;
  }
}

init();
