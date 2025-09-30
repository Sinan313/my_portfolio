# C-Tech Solutions / Personal Website Codebase Guide

## Project Architecture
- **Frontend-only web applications** - Pure HTML/CSS/JavaScript and React JSX components
- **Main projects**: C-Tech Solutions (education platform) and Personal Portfolio
- **No backend/database** - Client-side only with demo data and localStorage
- **Static assets**: Images hosted via Unsplash CDN and local files

## Key Files & Structure
- `C tech Solutions/`: Main education platform (HTML/CSS/JS)
- `Portfolio/`: Personal portfolio section
- `index.html`, `personal_website (1).html`, `orgin.html`: Various static pages
- `mylms.jsx`: React LMS component (educational platform)
- `script.js`, `stylel.css`: Global scripts and styles
- `C tech Solutions/script.js`: Platform-specific JavaScript with user management

## Development Commands
```bash
# No build system - open HTML files directly in browser
python -m http.server 8000  # Optional: Local server for testing
# OR
npx serve .  # If Node.js available for static serving
```

## Code Style Guidelines
- **HTML**: Semantic HTML5, proper SEO meta tags, accessibility attributes
- **CSS**: CSS custom properties for theming, mobile-first responsive design
- **JavaScript**: ES6+ features, camelCase naming, template literals for DOM manipulation
- **State management**: Global variables for app state, localStorage for persistence
- **Event handling**: Inline onclick attributes and addEventListener patterns
- **Function naming**: Descriptive names (showPageWithHistory, toggleMobileMenu)
- **Comments**: Minimal - focus on descriptive function/variable names over comments
