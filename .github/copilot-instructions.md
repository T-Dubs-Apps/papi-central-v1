# PAPI Central - AI Coding Agent Instructions

## Project Overview
**PAPI Central** (Personal Automated Protection Interface) is a multi-app AI suite with a 3D spaceship interface. It's a hybrid client-side/server-side platform combining multiple AI-powered tools into one unified experience. Main entry point: [index.html](index.html)

## Core Architecture

### Multi-App Structure
Each app is a standalone HTML file that can run independently or be launched from the main hub:
- **Main Hub**: [index.html](index.html) - 3D spaceship AI interface with alien pilot
- **Store**: [PAPI Central.htm](PAPI Central.htm) - Payment/license marketplace
- **LAUNCH-*.html**: Redirect files that route users between apps
- **Feature Apps**: Individual tools (aegis-guard.html, automation-hub.html, cortex-desktop-bridge.html, etc.)
- **Python Backend**: [The_Cortex.py](The_Cortex.py) + [cortex_server.py](cortex_server.py) for desktop AI features

### Key Management System (Critical!)
API keys are centralized through [papi-key-loader.js](papi-key-loader.js):
```javascript
// Every app loads keys via this universal module
const apiKey = PAPI.loadKey('app-name.html');
```
- **Key Controller** ([key-controller.html](key-controller.html)): UI for managing API keys
- **4-key rotation**: OpenAI keys auto-rotate for load balancing
- **localStorage-based**: All keys stored client-side, never committed to code
- Apps should NEVER hardcode API keys - always use `PAPI.loadKey()`

### License System
License activation is localStorage-based with specific key patterns:
- `master_admin` = 'TROY_WALKER_2026' (admin override)
- `beta_license` = 'active' (beta testers)
- `{app}_license` = 'active' (e.g., `papi_license`, `aegis_license`)
- Check premium status: `PAPI.isPremium()` or `localStorage.getItem('papi_license') === 'active'`

## Development Workflow

### Local Development
```bash
# Simple HTTP server (no build step)
python -m http.server 8000
# or
npx serve
```
Then open: `http://localhost:8000/index.html`

### Deployment
- **Target**: Netlify, Vercel, GitHub Pages (static hosting)
- **Config**: [netlify.toml](netlify.toml) redirects everything to index.html
- **Payment Server**: [server.js](server.js) for Stripe (optional, demo mode exists)

### Tech Stack
- **No framework** - Vanilla JS, Tailwind CSS via CDN
- **No build step** - Everything runs in browser
- **localStorage** - Primary data persistence
- **Stripe** - Payment processing (demo mode for testing)
- **Multi-AI**: OpenAI, Claude, Gemini support

## Critical Patterns

### AlienAI Object (Main Interface)
Located in [index.html](index.html) around line 2094:
```javascript
const AlienAI = {
    conversationHistory: [],
    messageCount: 0,
    maxFreeMessages: 30,
    config: { provider: 'openai' },
    // Methods handle AI interactions, history, limits
}
```
- Manages conversation state and message limits
- Supports demo mode (no API keys needed)
- Free tier: 30 messages, then upgrade prompt

### Spaceship Animations
The 3D spaceship in [index.html](index.html) has complex state management:
- **Idle mode**: After 89s inactivity, ship shrinks (`.idle` class)
- **Drag system**: Ship is draggable with boundary detection
- **Animations**: Takeoff, delivery, alien appearance controlled via `SpaceshipController` object
- **Commands**: Type commands like "show alien", "test purchase", "launch ship" to trigger animations

### Beta Tester System
[beta-admin.html](beta-admin.html) is password-protected (TROY_WALKER_2026):
- Generates unique beta license links
- Time-limited licenses (default 30 days)
- One license per email/phone
- Links format: `beta-activate.html?key=BETA-{hash}&app={appname}`

## File Structure Conventions

### Naming Patterns
- `LAUNCH-{App-Name}.html` - Launcher/redirect pages
- `{app-name}.html` - Main app files (kebab-case)
- `{FEATURE}_README.md` - Feature documentation (uppercase)
- `.github/` - GitHub/CI configuration (this file)

### Documentation Files
Read these for context on specific features:
- [BETA_SYSTEM_README.md](BETA_SYSTEM_README.md) - Beta testing workflow
- [KEY_CONTROLLER_GUIDE.md](KEY_CONTROLLER_GUIDE.md) - API key management
- [PAYMENT_SYSTEM_README.md](PAYMENT_SYSTEM_README.md) - Stripe integration
- [SPACESHIP_QUICKSTART.md](SPACESHIP_QUICKSTART.md) - Animation system
- [API_KEY_SETUP_GUIDE.md](API_KEY_SETUP_GUIDE.md) - Security best practices

## Common Tasks

### Adding a New App
1. Create `{app-name}.html` with full HTML structure
2. Include `<script src="papi-key-loader.js"></script>` in head
3. Load API keys: `const key = PAPI.loadKey()`
4. Add license check if premium: `if (!PAPI.isPremium())`
5. Create corresponding `LAUNCH-{App-Name}.html` for navigation
6. Update apps dropdown in [index.html](index.html) (search for "Apps Dropdown Menu")

### Modifying API Integration
- **Never hardcode keys** - Use PAPI.loadKey() only
- Check [papi-key-loader.js](papi-key-loader.js) for available methods
- Multi-provider support: Pass provider param: `PAPI.loadKey(null, 'claude')`
- Test with demo mode first: `localStorage.setItem('ai_provider', 'demo')`

### Updating Spaceship Animations
All logic in [index.html](index.html) within `SpaceshipController` object:
- `showAlien()` - Display alien in dome
- `hideAlien()` - Hide alien
- `triggerTakeoff()` - Launch sequence
- CSS animations use `.spaceship-container` class states

### Testing License/Payment Flow
```javascript
// Activate test licenses (browser console)
localStorage.setItem('papi_license', 'active');
localStorage.setItem('master_admin', 'TROY_WALKER_2026'); // Full admin access

// Clear licenses
localStorage.clear();
```

## Security Notes

⚠️ **Never commit**:
- API keys (always use PAPI.loadKey())
- Stripe secret keys (use `.env` file, see [server.js](server.js))
- Master admin passwords (stored in localStorage only)

✅ **Always**:
- Store sensitive values in localStorage
- Validate license status before premium features
- Use masked input fields for API keys (see [key-controller.html](key-controller.html))

## Dependencies
Minimal external dependencies (see [package.json](package.json)):
```json
{
  "express": "^5.2.1",      // Server for payments
  "stripe": "^20.1.0",      // Payment processing
  "cors": "^2.8.5",         // CORS for API calls
  "dotenv": "^17.2.3"       // Environment variables
}
```
All UI dependencies loaded via CDN (Tailwind, Font Awesome).

## Python Integration

### The Cortex (Desktop AI Assistant)
[The_Cortex.py](The_Cortex.py) is a standalone Python-based AI assistant:
- **Purpose**: Desktop CLI AI with conversation memory and learning
- **Features**: Multi-provider support (OpenAI/Claude/Gemini), code generation, project recommendations
- **Memory**: Stores conversation history in `cortex_memory.json`
- **Demo Mode**: Works without API keys for basic responses and templates
- **Usage**: `python The_Cortex.py` then type commands like `ask how do I build a todo app?`
- Can be integrated with web apps via Flask/FastAPI bridge for desktop-web hybrid features

### Cortex Desktop Bridge (NEW - Saleable Product!)
[cortex-desktop-bridge.html](cortex-desktop-bridge.html) + [cortex_server.py](cortex_server.py) creates a **desktop-to-web AI bridge**:
- **Price**: $29.99/month premium product
- **Features**: Beautiful web terminal interface, real-time Python AI connection, conversation memory sync
- **Setup**: `pip install -r requirements.txt` then `python cortex_server.py`
- **Files**: 
  - Frontend: cortex-desktop-bridge.html, LAUNCH-Cortex-Desktop.html
  - Backend: cortex_server.py (Flask API)
  - Docs: CORTEX_DESKTOP_README.md, CORTEX_SETUP_GUIDE.md
  - Marketing: CORTEX_PRODUCT_CARD.html (for store integration)
- **License Key**: `cortex_desktop_license` = 'active'

### Legacy Files
- `papi_fix.py` - Temporary repair script used during PAPI construction (not actively used)

## Debugging Tips

### API Key Issues
1. Check Key Controller: Open [key-controller.html](key-controller.html)
2. Verify localStorage: `console.log(PAPI.getStats())`
3. Test key rotation: Watch console for which key is being used

### License Problems
```javascript
// Check all licenses
Object.keys(localStorage).filter(k => k.includes('license'))
```

### Spaceship Not Animating
- Check console for errors
- Verify `SpaceshipController.init()` was called
- Test commands in console: `SpaceshipController.showAlien()`
