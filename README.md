# PAPI Central

PAPI Central is a modular, browser-based AI suite with a 3D spaceship interface, supporting multiple standalone HTML/JS apps and Python backends. It is designed for productivity, automation, and advanced AI workflows.

## Features
- 3D spaceship UI with app launcher
- Modular app system (HTML/JS frontends, Python backends)
- Key and license management (localStorage)
- Automated app upgrades and repair tools
- Python AI bridge (The Cortex)
- Secure, client-side storage for keys and licenses

## Getting Started
1. Clone or download this repository.
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Start the Python backend:
   ```
   python cortex_server.py
   ```
4. Serve the frontend (static):
   ```
   python -m http.server 8000
   # or
   npx serve
   ```
5. Open `index.html` in your browser.

## Folder Structure
- `apps/` – All app HTML/JS files
- `js/` – Shared JavaScript files
- `python/` – Python backends and utilities
- `docs/` – Documentation and guides
- `assets/` – Images, icons, and static files
- `system/` – System configs and manifests

## Environment Variables
See `.env.example` for required environment variables.

## Contributing
Pull requests and suggestions are welcome! Please document new apps and features in the appropriate README files.

## License
Proprietary. All rights reserved.

---
For more, see the docs/ folder and individual app READMEs.
