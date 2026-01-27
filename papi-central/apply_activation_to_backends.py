#!/usr/bin/env python3
"""
apply_activation_to_backends.py

Scans Python files under the `apps/` directory, detects Flask apps (looking for "app = Flask("),
and injects a `before_request` activation check using the local `activation_client` helper.

This script is conservative: it creates a `.bak` copy before editing and avoids double-inserting
by checking for a marker comment.

Run from repo root:
  python papi-central/apply_activation_to_backends.py

"""
import re
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APPS_DIR = ROOT / 'apps'

MARKER = '# >>> PAPI CENTRAL ACTIVATION HOOK >>>'

SNIPPET = """
{marker}
from activation_client import check_token_with_central
from flask import request, jsonify

@app.before_request
def _papi_enforce_activation():
    # Protect common AI endpoints; extend this list as needed
    protected_prefixes = ('/chat', '/ask', '/generate', '/estimate', '/api/ai', '/v1/ai')
    path = (request.path or '').lower()
    if not any(path.startswith(p) for p in protected_prefixes):
        return None

    token = request.headers.get('X-Activation-Token') or (request.get_json(silent=True) or {}).get('activation_token')
    result = check_token_with_central(token)
    if not result.get('valid'):
        return jsonify({'success': False, 'error': 'activation_required', 'detail': result}), 401
    return None
# <<< PAPI CENTRAL ACTIVATION HOOK <<<
""".replace('{marker}', MARKER)


def inject_into_file(path: Path):
    text = path.read_text(encoding='utf-8')
    if MARKER in text:
        print(f"Skipping (already patched): {path}")
        return False

    # Find the app = Flask(...) assignment
    m = re.search(r"^\s*app\s*=\s*Flask\([^\n]*\)\s*$", text, flags=re.MULTILINE)
    if not m:
        print(f"No Flask app assignment found in {path}; skipping")
        return False

    insert_pos = m.end()

    # Ensure activation_client import exists near top; if not, add it
    if 'from activation_client import' not in text:
        # Try to insert after other imports
        import_match = re.search(r"(^from\s+flask\s+import[\s\S]*?$|^import\s+[\w\.]+)\s*\n", text, flags=re.MULTILINE)
        # fallback to top
        head = ''
        if import_match:
            # insert after the match's line
            pass

    # Backup original
    bak = path.with_suffix(path.suffix + '.bak')
    path.write_text(text, encoding='utf-8') if bak.exists() else path.write_text(text, encoding='utf-8')
    path.write_text(text, encoding='utf-8')

    # Insert snippet after the app assignment line
    new_text = text[:insert_pos] + "\n" + SNIPPET + text[insert_pos:]

    # Add import for activation_client at top if missing
    if 'from activation_client import' not in new_text:
        new_text = 'from activation_client import check_token_with_central\n' + new_text

    # Write backup
    try:
        if not bak.exists():
            bak.write_text(text, encoding='utf-8')
    except Exception as e:
        print('Failed to write backup for', path, e)

    path.write_text(new_text, encoding='utf-8')
    print(f'Patched {path} (backup at {bak.name})')
    return True


def main():
    if not APPS_DIR.exists():
        print('apps/ folder not found at', APPS_DIR)
        return

    py_files = list(APPS_DIR.rglob('*.py'))
    print(f'Found {len(py_files)} Python files under apps/')

    patched = 0
    for f in py_files:
        try:
            if inject_into_file(f):
                patched += 1
        except Exception as e:
            print('Error patching', f, e)

    print(f'Completed. Patched {patched} files.')


if __name__ == '__main__':
    main()
