
# PAPI Central – AI Coding Agent Instructions

## Project Overview
PAPI Central is a modular browser-based AI suite with a 3D spaceship UI, supporting multiple standalone HTML/JS apps and Python AI backends. Apps are self-contained HTML files, launched from the main hub, and communicate with Python servers for advanced features.

## Architecture & Key Patterns
- **Multi-App System:**
  - Apps: `{app-name}.html` in `apps/` (e.g., ai-assistant-pro.html)
  - Launchers: `LAUNCH-{App-Name}.html` (e.g., LAUNCH-AI-Assistant-Pro.html)
  - Main hub: `apps/index.html` (spaceship UI, AlienAI logic)
- **Key Management:**
  - All API keys loaded via `js/papi-key-loader.js` using `PAPI.loadKey(app, provider)`
  - Keys stored in localStorage, managed via `apps/key-controller.html`
  - OpenAI keys auto-rotate (4-key system); assign per-app or globally
- **Licensing:**
  - Licenses in localStorage: `{app}_license = 'active'`
  - Admin: `master_admin = 'TROY_WALKER_2026'`
  - Check with `PAPI.isPremium()`
- **Spaceship UI:**
  - `apps/index.html`: 3D spaceship, `SpaceshipController`, AlienAI logic (see ~line 2094)
  - Animations: `SpaceshipController.showAlien()`, `SpaceshipController.init()`
- **Python Bridge:**
  - `python/The_Cortex.py`: CLI AI assistant with memory, demo mode, multi-provider support
  - `python/cortex_server.py`: Flask API for web integration
  - `apps/cortex-desktop-bridge.html`: Web terminal frontend

## Developer Workflow
- **Local Development:**
  - Serve: `python -m http.server 8000` or `npx serve` (no build step)
  - Access: `http://localhost:8000/apps/index.html`
- **Deployment:**
  - Static hosting (Netlify, Vercel, GitHub Pages)
  - `netlify.toml`: Redirects all to index.html
  - Payments: `server.js` (Stripe, demo mode supported)
- **Python Backend:**
  - Install: `pip install -r requirements.txt`
  - Run web API: `python python/cortex_server.py`
  - Run CLI: `python python/The_Cortex.py`

## Project Conventions
- **No frameworks:** Vanilla JS, Tailwind via CDN only
- **localStorage:** All persistent state (keys, licenses, user data) is client-side
- **App Naming:**
  - Main: `{app-name}.html` (kebab-case)
  - Launcher: `LAUNCH-{App-Name}.html`
  - Docs: `{FEATURE}_README.md` (uppercase)
- **API Key Security:**
  - Use `apps/key-controller.html` for key entry/assignment
  - Never commit keys/secrets; use localStorage and `.env`/`cortex_memory.json` for Python
- **Adding Apps:**
  1. Create `{app-name}.html` in `apps/` with `<script src="../js/papi-key-loader.js"></script>`
  2. Use `PAPI.loadKey()` for API access
  3. Add license check: `if (!PAPI.isPremium())`
  4. Add launcher and update dropdown in `apps/index.html`

## Key Files & Docs
- `apps/index.html`: Main UI, spaceship, AlienAI logic
- `js/papi-key-loader.js`: Key management, rotation logic
- `apps/key-controller.html`: Key entry/assignment UI
- `python/The_Cortex.py`, `python/cortex_server.py`: Python AI backend
- `apps/cortex-desktop-bridge.html`: Web terminal for desktop AI
- `docs/API_KEY_SETUP_GUIDE.md`: Key security best practices
- `docs/KEY_CONTROLLER_GUIDE.md`: Key assignment/rotation
- `docs/CORTEX_DESKTOP_README.md`: Python bridge usage
- `docs/SPACESHIP_QUICKSTART.md`: Animation system

## Debugging & Testing
- **API Keys:** Use `apps/key-controller.html` to add/test keys. Check rotation in console. Demo: `localStorage.setItem('ai_provider', 'demo')`
- **Licenses:** Check: `Object.keys(localStorage).filter(k => k.includes('license'))` in console
- **Spaceship Animations:** Test: `SpaceshipController.showAlien()` in console; ensure `SpaceshipController.init()` is called
- **Python Bridge:** Test endpoints in `python/cortex_server.py`: `/ask`, `/stats`, `/configure`

## Security
- Never commit API keys, Stripe secrets, or admin passwords
- Always use masked input for key entry
- Store all sensitive data in localStorage (browser) or `.env`/`cortex_memory.json` (Python, gitignored)

---
For more, see: `docs/API_KEY_SETUP_GUIDE.md`, `docs/KEY_CONTROLLER_GUIDE.md`, `docs/CORTEX_DESKTOP_README.md`, `docs/SPACESHIP_QUICKSTART.md`
