const state = {
  archive: [],
  data: null,
  filter: 'All',
};

const els = {
  briefDate: document.getElementById('brief-date'),
  briefTitle: document.getElementById('brief-title'),
  briefSubtitle: document.getElementById('brief-subtitle'),
  archiveSelect: document.getElementById('archive-select'),
  executiveSummary: document.getElementById('executive-summary'),
  newsFilters: document.getElementById('news-filters'),
  newsGrid: document.getElementById('news-grid'),
  deepDiveCard: document.getElementById('deep-dive-card'),
  vulnTableBody: document.getElementById('vuln-table-body'),
  vulnFootnote: document.getElementById('vuln-footnote'),
  biggestHacksList: document.getElementById('biggest-hacks-list'),
  headlinesList: document.getElementById('headlines-list'),
};

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

function severityClass(severity = '') {
  const key = String(severity).toLowerCase();
  if (key.includes('critical')) return 'severity-critical';
  if (key.includes('high')) return 'severity-high';
  return 'severity-medium';
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderSummary(items = []) {
  // Support either ["bullet", ...] or [{text, sources}, ...]
  els.executiveSummary.innerHTML = (items || []).map(item => {
    const text = typeof item === 'string' ? item : (item?.text || '');
    const sources = (typeof item === 'object' && item?.sources) ? item.sources : [];
    const sourcesHtml = sources.length
      ? `<div class="sources">${sources.map(s => `<a class="source-link" href="${s.url}" target="_blank" rel="noreferrer">${escapeHtml(s.name)}</a>`).join('')}</div>`
      : '';
    return `
      <article class="summary-item">
        <p>${escapeHtml(text)}</p>
        ${sourcesHtml}
      </article>
    `;
  }).join('');
}

function renderFilters(items = []) {
  const categories = ['All', ...new Set((items || []).map(item => item.category).filter(Boolean))];
  els.newsFilters.innerHTML = categories.map(cat => `
    <button class="pill ${cat === state.filter ? 'active' : ''}" data-filter="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
  `).join('');

  els.newsFilters.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      renderFilters(state.data?.cyber_news || []);
      renderNews(state.data?.cyber_news || []);
    });
  });
}

function renderNews(items = []) {
  const filtered = state.filter === 'All' ? items : items.filter(item => item.category === state.filter);
  if (!filtered.length) {
    els.newsGrid.innerHTML = '<div class="empty-state">No stories match this filter.</div>';
    return;
  }
  els.newsGrid.innerHTML = filtered.map(item => {
    const sources = (item.sources || []).map(src =>
      `<a class="source-link" href="${src.url}" target="_blank" rel="noreferrer">${escapeHtml(src.name)}</a>`
    ).join('');
    return `
      <article class="news-card">
        <div class="news-card-header">
          <h4>${escapeHtml(item.title || '')}</h4>
          <span class="tag">${escapeHtml(item.category || '')}</span>
        </div>
        <p>${escapeHtml(item.summary || '')}</p>
        ${item.expanded ? `<p>${escapeHtml(item.expanded)}</p>` : ''}
        <div class="sources">${sources}</div>
      </article>
    `;
  }).join('');
}

function renderDeepDive(deepDive = {}) {
  // Schema: {title, content, sources}
  const sources = (deepDive.sources || []).map(src =>
    `<a class="source-link" href="${src.url}" target="_blank" rel="noreferrer">${escapeHtml(src.name)}</a>`
  ).join('');

  els.deepDiveCard.innerHTML = `
    <div class="tag">Most Referenced Story</div>
    <h4>${escapeHtml(deepDive.title || '')}</h4>
    <p>${escapeHtml(deepDive.content || '')}</p>
    <div class="sources">${sources}</div>
  `;
}

function renderVulns(vulns = [], footnote = '') {
  // Schema currently: vulnerabilities is a list of items
  els.vulnTableBody.innerHTML = (vulns || []).map(v => `
    <tr>
      <td>${escapeHtml(v.cve || '')}</td>
      <td>${escapeHtml(v.product || '')}</td>
      <td>${escapeHtml(v.cvss ?? '')}</td>
      <td><span class="severity-pill ${severityClass(v.severity)}">${escapeHtml(v.severity || '')}</span></td>
      <td class="${v.exploited ? 'exploited-yes' : 'exploited-no'}">${v.exploited ? 'YES' : 'NO'}</td>
      <td>${escapeHtml(v.description || '')}</td>
    </tr>
  `).join('');
  els.vulnFootnote.textContent = footnote || '';
}

function renderBiggestHacks(hacks = []) {
  if (!els.biggestHacksList) return;
  if (!hacks.length) {
    els.biggestHacksList.innerHTML = '<div class="empty-state">No major incidents today.</div>';
    return;
  }

  els.biggestHacksList.innerHTML = hacks.map(h => {
    const sev = h.severity || 'Medium';
    const sevClass = severityClass(sev);
    const sources = (h.sources || []).map(s =>
      `<a class="source-link" href="${s.url}" target="_blank" rel="noreferrer">${escapeHtml(s.name)}</a>`
    ).join('');

    return `
      <article class="hack-card">
        <div class="hack-header">
          <span class="severity-pill ${sevClass}">${escapeHtml(sev)}</span>
          <span class="hack-date">${escapeHtml(h.date || '')}</span>
        </div>
        <h4>${escapeHtml(h.title || '')}</h4>
        <p>${escapeHtml(h.summary || '')}</p>
        <div class="sources">${sources}</div>
      </article>
    `;
  }).join('');
}

function renderHeadlines(headlines = []) {
  if (!els.headlinesList) return;
  if (!headlines.length) {
    els.headlinesList.innerHTML = '<div class="empty-state">No headlines available.</div>';
    return;
  }

  els.headlinesList.innerHTML = headlines.map(h => {
    const url = h.link || h.url || '';
    const source = h.source ? ` <span class="muted">(${escapeHtml(h.source)})</span>` : '';
    return `
      <a href="${url}" target="_blank" rel="noreferrer" class="headline-link">
        <span class="headline-title">${escapeHtml(h.title || '')}</span>${source}
      </a>
    `;
  }).join('');
}

function populateArchiveSelect(archive = []) {
  if (!els.archiveSelect) return;
  els.archiveSelect.innerHTML = ['<option value="latest">Latest</option>', ...archive.map(entry => `<option value="${entry.path}">${entry.date}</option>`)].join('');
  els.archiveSelect.addEventListener('change', async (e) => {
    await loadBrief(e.target.value);
  });
}

function renderBrief(data) {
  state.data = data;
  state.filter = 'All';

  els.briefDate.textContent = data.date || 'Unknown date';
  els.briefTitle.textContent = data.title || "President's Daily Cybersecurity Briefing";
  els.briefSubtitle.textContent = data.subtitle || '';

  renderSummary(data.executive_summary || []);
  renderFilters(data.cyber_news || []);
  renderNews(data.cyber_news || []);
  renderDeepDive(data.deep_dive || {});
  renderVulns(data.vulnerabilities || [], data.vulnerabilities?.footnote || '');
  renderBiggestHacks(data.biggest_hacks || []);
  renderHeadlines(data.headlines || []);
}

async function loadBrief(path = 'latest/data.json') {
  const normalized = path === 'latest' ? 'latest/data.json' : path;
  const data = await fetchJson(normalized);
  renderBrief(data);

  const matching = state.archive.find(item => item.path === normalized);
  if (matching) els.archiveSelect.value = normalized;
  else els.archiveSelect.value = 'latest';
}

async function init() {
  try {
    const archiveIndex = await fetchJson('archive/index.json');
    state.archive = archiveIndex.entries || [];
    populateArchiveSelect(state.archive);
    await loadBrief('latest/data.json');
  } catch (err) {
    console.error(err);
    if (els.briefTitle) els.briefTitle.textContent = 'Failed to load briefing';
    if (els.briefSubtitle) els.briefSubtitle.textContent = err.message;
  }
}

init();
