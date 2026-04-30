// Presidential Daily Cybersecurity Briefing - JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    populateContent();
    setupEventListeners();
    setupNavigation();
});

// ============= THEME MANAGEMENT =============
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    updateThemeButton(savedTheme);
    
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.classList.toggle('light-mode', newTheme === 'light');
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const button = document.getElementById('theme-toggle');
    button.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============= CONTENT POPULATION =============
function populateContent() {
    const data = briefingData;
    
    // Set dates
    const dateString = new Date(data.briefing_metadata.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('briefing-date').textContent = dateString;
    document.getElementById('footer-date').textContent = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Populate Executive Summary
    populateExecutiveSummary(data.executive_summary);
    
    // Populate Cyber News
    populateCyberNews(data.cyber_news);
    
    // Populate Deep Dive
    populateDeepDive(data.deep_dive);
    
    // Populate Vulnerabilities
    populateVulnerabilities(data.vulnerabilities);
    
    // Populate Right Sidebar
    populateHeadlines(data.recent_headlines);
    populateBiggestHacks(data.biggest_hacks);
    populateSources(data.source_counts);
}

function populateExecutiveSummary(summaries) {
    const container = document.getElementById('summary-list');
    container.innerHTML = '';
    
    summaries.forEach(summary => {
        const item = document.createElement('div');
        item.className = 'summary-item';
        item.textContent = summary;
        container.appendChild(item);
    });
}

function populateCyberNews(news) {
    const container = document.getElementById('cyber-news-list');
    container.innerHTML = '';
    
    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.setAttribute('data-category', item.category);
        newsItem.innerHTML = `
            <div class="news-header">
                <h3 class="news-title">${item.title}</h3>
                <span class="category-badge ${item.category}">${formatCategory(item.category)}</span>
            </div>
            <p class="news-blurb">${item.blurb}</p>
            <div class="expanded-content" id="expand-${index}">
                <p>${item.expand_content}</p>
            </div>
            <div class="news-footer">
                <span class="source-info">Source: <strong>${item.source}</strong></span>
                <div class="news-actions">
                    <button class="expand-btn" onclick="toggleExpand('expand-${index}')">
                        ${item.expand_content ? 'Expand ▼' : 'More Info'}
                    </button>
                    <a href="${item.link}" target="_blank" class="read-original-btn">Read Original</a>
                </div>
            </div>
        `;
        container.appendChild(newsItem);
    });
}

function populateDeepDive(deepDive) {
    const container = document.getElementById('deep-dive-content');
    container.innerHTML = `
        <h3>${deepDive.title}</h3>
        <div class="severity-badge ${deepDive.severity}">${deepDive.severity}</div>
        <div class="deep-dive-content">
            <p>${deepDive.content}</p>
            <div class="deep-dive-sources">
                <strong>Sources:</strong> ${deepDive.sources.join(', ')}
            </div>
        </div>
    `;
}

function populateVulnerabilities(vulns) {
    const tbody = document.getElementById('vuln-tbody');
    tbody.innerHTML = '';
    
    vulns.forEach(vuln => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${vuln.cve}</strong></td>
            <td>${vuln.product}</td>
            <td><span class="severity-${vuln.severity.toLowerCase()}">${vuln.severity}</span></td>
            <td><span class="cvss-badge">${vuln.cvss}</span></td>
            <td><span class="active-${vuln.active_exploitation ? 'yes' : 'no'}">${vuln.active_exploitation ? '🔴 YES' : '🟢 NO'}</span></td>
            <td>${vuln.description}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateHeadlines(headlines) {
    const container = document.getElementById('headlines-list');
    container.innerHTML = '';
    
    headlines.slice(0, 10).forEach(headline => {
        const item = document.createElement('div');
        item.className = 'headline-item';
        item.innerHTML = `<a href="${headline.link}" target="_blank">${headline.title}</a>`;
        container.appendChild(item);
    });
}

function populateBiggestHacks(hacks) {
    const container = document.getElementById('hacks-list');
    container.innerHTML = '';
    
    hacks.forEach(hack => {
        const item = document.createElement('div');
        item.className = 'hack-item';
        item.innerHTML = `
            <a href="${hack.link}" target="_blank">${hack.title}</a>
            <div class="hack-severity ${hack.severity}">${hack.severity}</div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">${hack.brief}</p>
        `;
        container.appendChild(item);
    });
}

function populateSources(sources) {
    const container = document.getElementById('sources-list');
    container.innerHTML = '';
    
    Object.entries(sources)
        .sort((a, b) => b[1] - a[1])
        .forEach(([source, count]) => {
            const item = document.createElement('div');
            item.className = 'source-item';
            item.innerHTML = `
                <div class="source-count">
                    <span>${source}</span>
                    <span>${count}</span>
                </div>
            `;
            container.appendChild(item);
        });
}

// ============= EVENT LISTENERS =============
function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterNews(this.getAttribute('data-filter'));
        });
    });
}

function filterNews(category) {
    const newsItems = document.querySelectorAll('[data-category]');
    newsItems.forEach(item => {
        if (category === 'All' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'slideIn 0.3s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleExpand(id) {
    const element = document.getElementById(id);
    element.classList.toggle('visible');
    
    const btn = event.target;
    if (btn.classList.contains('expand-btn')) {
        btn.textContent = element.classList.contains('visible') ? 'Collapse ▲' : 'Expand ▼';
    }
}

// ============= NAVIGATION =============
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const href = this.getAttribute('href');
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ============= UTILITY FUNCTIONS =============
function formatCategory(category) {
    const categoryMap = {
        'Threat': 'THREAT',
        'Campaign': 'CAMPAIGN',
        'Hardening': 'HARDENING',
        '365_Threats': 'M365 THREATS',
        'General': 'GENERAL',
        'Tools': 'TOOLS',
        'Laws': 'LAWS'
    };
    return categoryMap[category] || category;
}

// ============= KEYBOARD SHORTCUTS =============
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
});

// ============= PRINT FUNCTIONALITY =============
function printBriefing() {
    window.print();
}

// Log initialization
console.log('%cPresidential Daily Cybersecurity Briefing', 'font-size: 16px; font-weight: bold; color: #00d4ff;');
console.log('Briefing Data Loaded:', briefingData);
console.log('For dark/light mode toggle: Ctrl+D');