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
};

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

function severityClass(severity = '') {
  const key = severity.toLowerCase();
  if (key.includes('critical')) return 'severity-critical';
  if (key.includes('high')) return 'severity-high';
  return 'severity-medium';
}

function renderSummary(items = []) {
  els.executiveSummary.innerHTML = items.map(item => `
    <article class="summary-item">
      <h4>${item.title}</h4>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderFilters(items = []) {
  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
  els.newsFilters.innerHTML = categories.map(cat => `
    <button class="pill ${cat === state.filter ? 'active' : ''}" data-filter="${cat}">${cat}</button>
  `).join('');
  els.newsFilters.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      renderFilters(state.data.cyber_news || []);
      renderNews(state.data.cyber_news || []);
    });
  });
}

function renderNews(items = []) {
  const filtered = state.filter === 'All' ? items : items.filter(item => item.category === state.filter);
  if (!filtered.length) {
    els.newsGrid.innerHTML = '<div class="empty-state">No stories match this filter.</div>';
    return;
  }
  els.newsGrid.innerHTML = filtered.map(item => `
    <article class="news-card">
      <div class="news-card-header">
        <h4>${item.title}</h4>
        <span class="tag">${item.category}</span>
      </div>
      <p>${item.summary || ''}</p>
      <p>${item.expanded || ''}</p>
      <div class="sources">${(item.sources || []).map(src => `<a class="source-link" href="${src.url}" target="_blank" rel="noreferrer">${src.name}</a>`).join('')}</div>
    </article>
  `).join('');
}

function renderDeepDive(deepDive = {}) {
  const refs = (deepDive.referenced_by || []).map(ref => `<li>${ref}</li>`).join('');
  const actions = (deepDive.actions || []).map(action => `<li>${action}</li>`).join('');
  els.deepDiveCard.innerHTML = `
    <div class="tag">${deepDive.label || 'Most Referenced Story'}</div>
    <h4>${deepDive.title || ''}</h4>
    <p>${deepDive.body || ''}</p>
    ${actions ? `<h5>Recommended Actions</h5><ul>${actions}</ul>` : ''}
    ${refs ? `<h5>Referenced by</h5><ul>${refs}</ul>` : ''}
  `;
}

function renderVulns(vulns = [], footnote = '') {
  els.vulnTableBody.innerHTML = vulns.map(v => `
    <tr>
      <td>${v.cve}</td>
      <td>${v.product}</td>
      <td>${v.cvss}</td>
      <td><span class="severity-pill ${severityClass(v.severity)}">${v.severity}</span></td>
      <td class="${v.exploited ? 'exploited-yes' : 'exploited-no'}">${v.exploited ? 'YES' : 'NO'}</td>
      <td>${v.description}</td>
    </tr>
  `).join('');
  els.vulnFootnote.textContent = footnote || '';
}

function populateArchiveSelect(archive = []) {
  els.archiveSelect.innerHTML = ['<option value="latest">Latest</option>', ...archive.map(entry => `<option value="${entry.path}">${entry.date}</option>`)].join('');
  els.archiveSelect.addEventListener('change', async (e) => {
    await loadBrief(e.target.value);
  });
}

function renderBrief(data) {
  state.data = data;
  state.filter = 'All';
  els.briefDate.textContent = data.date || 'Unknown date';
  els.briefTitle.textContent = data.title || 'President's Daily Cybersecurity Briefing';
  els.briefSubtitle.textContent = data.subtitle || '';
  renderSummary(data.executive_summary || []);
  renderFilters(data.cyber_news || []);
  renderNews(data.cyber_news || []);
  renderDeepDive(data.deep_dive || {});
  renderVulns(data.vulnerabilities?.items || [], data.vulnerabilities?.footnote || '');
}

async function loadBrief(path = 'latest/data.json') {
  const data = await fetchJson(path);
  renderBrief(data);
  const matching = state.archive.find(item => item.path === path);
  if (matching) els.archiveSelect.value = path;
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
    els.briefTitle.textContent = 'Failed to load briefing';
    els.briefSubtitle.textContent = err.message;
  }
}

init();
