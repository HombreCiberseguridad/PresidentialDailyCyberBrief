# 🛡️ Presidential Daily Cybersecurity Briefing

A professional, interactive cybersecurity intelligence briefing website designed for MSP technical staff and security operations teams.

## 📋 Overview

This website presents the Presidential Daily Cybersecurity Briefing with a focus on:
- **Executive Summary** - Critical threats and vulnerabilities
- **Cyber News & Threats** - Categorized intelligence feed with filtering
- **Deep Dive Analysis** - In-depth threat analysis with remediation guidance
- **Critical Vulnerabilities** - CVE database with CVSS scores and exploitation status
- **Action Items** - Prioritized remediation tasks
- **Recent Headlines** - Linked news feed
- **Biggest Hacks** - Recent major security incidents
- **Source Statistics** - Information source tracking

## ✨ Features

### Dark/Light Mode Toggle
- Persistent theme preference stored in localStorage
- Smooth transitions between themes
- Professional color schemes for both modes
- Keyboard shortcut: `Ctrl+D` or `Cmd+D`

### Interactive Cyber News Feed
- **Category Filtering**: Threat, Campaign, Hardening, M365 Threats, General
- **Expandable Content**: Click "Expand" to view detailed threat analysis
- **Source Links**: Direct access to original articles
- **Animated Transitions**: Smooth slide-in effects

### Responsive Design
- Desktop (3-column layout): Navigation sidebar + Main content + News sidebar
- Tablet (1-column layout): Stackable sections
- Mobile-optimized for small screens
- Fully responsive typography and spacing

### Data Management
- All briefing data stored in `data.js`
- Easy to update with new threats, vulnerabilities, and news
- JSON structure for programmatic access
- Real-time date formatting

## 📁 File Structure

```
├── index.html          # Main HTML structure
├── style.css           # Complete dark/light theme styling
├── script.js           # Interactive functionality and theme management
├── data.js             # Briefing data and intelligence
└── README.md           # This file
```

## 🚀 Getting Started

### Local Development
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required
4. All content loads instantly

### Deployment (GitHub Pages)
The website is automatically deployed via GitHub Pages.

**Live URL**: https://HombreCiberseguridad.github.io/PresidentialDailyCyberBrief/

## 📊 Content Structure

### Executive Summary
- 5 critical bullet points
- Immediate threat highlights
- Key actions required

### Cyber News Items (8 total)
Each item contains:
- Title
- Category badge (color-coded)
- Summary blurb
- Expandable detailed content
- Source attribution
- Link to original article

### Vulnerabilities Table
Displays 5 critical CVEs with:
- CVE identifier
- Affected product
- Severity level (CRITICAL/HIGH)
- CVSS score
- Active exploitation status
- Brief description

### Action Items (4 priority levels)
- **URGENT**: CVE-2026-9901 SolarWinds Orion patching
- **URGENT**: CVE-2026-4432 Apache Struts emergency patch
- **HIGH**: Microsoft 365 conditional access review
- **HIGH**: CI/CD pipeline PyUtils scanning

## 🎨 Color Scheme

### Categories
- **Threat**: Orange (#ff6b35)
- **Campaign**: Red (#d32f2f)
- **Hardening**: Green (#4caf50)
- **M365 Threats**: Blue (#0078d4)
- **General**: Purple (#9c27b0)

### Severity
- **CRITICAL**: Red (#ff3d3d)
- **HIGH**: Orange (#ff9500)
- **MEDIUM**: Amber (#ffc107)
- **LOW**: Green (#4caf50)

## 🔐 Classification

**FOR OFFICIAL USE ONLY**

Distribution: MSP Technical Staff, Security Operations, Technical Leadership

## 📞 Support

Briefing Date: April 30, 2026
Last Updated: See footer timestamp
Classification: FOR OFFICIAL USE ONLY

## 🔄 Updating Content

### To update cyber news:
Edit `data.js` and modify the `cyber_news` array:
```javascript
{
  "title": "News Title",
  "category": "Threat|Campaign|Hardening|365_Threats|General",
  "blurb": "Short summary...",
  "expand_content": "Detailed analysis...",
  "source": "Source Name",
  "link": "https://source.url"
}
```

### To update vulnerabilities:
Modify the `vulnerabilities` array:
```javascript
{
  "cve": "CVE-XXXX-XXXXX",
  "product": "Product Name",
  "severity": "CRITICAL|HIGH",
  "cvss": 9.8,
  "active_exploitation": true|false,
  "smb_relevant": true|false,
  "description": "Description..."
}
```

## 📈 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: CSS Custom Properties, Grid, Flexbox, Animations
- **Vanilla JavaScript**: No frameworks, native DOM API
- **LocalStorage**: Theme persistence

## 📱 Accessibility

- Semantic HTML structure
- Sufficient color contrast
- Keyboard navigation support
- Responsive text sizing
- Print-friendly styles

---

**Presidential Daily Cybersecurity Briefing**  
Classification: FOR OFFICIAL USE ONLY  
Distribution: MSP Technical Staff  
Date: April 30, 2026