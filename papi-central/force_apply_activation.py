#!/usr/bin/env python3
"""
Force-apply activation hook into specified backend files.

This script targets a small set of files that the conservative injector skipped.
It looks for Flask imports or app variables and inserts the activation snippet near the top.

Use with caution — backups (.bak) are created for each edited file.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    ROOT / 'apps' / 'PAPI' / 'papi.py',
    ROOT / 'apps' / 'PAPI 5.0' / 'papi_ultra.py',
    ROOT / 'apps' / 'Sentinel Pro' / 'Sentinel_Pro.py',
]

MARKER = '# >>> PAPI CENTRAL ACTIVATION HOOK >>>'

SNIPPET = """
{marker}
from activation_client import check_token_with_central
from flask import request, jsonify

@app.before_request
def _papi_enforce_activation():
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


def apply_to_file(path: Path):
    if not path.exists():
        print('Missing:', path)
        return False
    text = path.read_text(encoding='utf-8')
    if MARKER in text:
        print('Already patched:', path)
        return False

    # If file mentions Flask anywhere, insert after imports; otherwise insert at top
    insert_pos = 0
    m = re.search(r'(from\s+flask\s+import[\s\S]*?\n|import\s+flask\s*\n)', text, flags=re.IGNORECASE)
    if m:
        insert_pos = m.end()
    else:
        # look for other imports to keep things tidy
        m2 = re.search(r'(^import\s.+\n|^from\s.+\n)+', text, flags=re.MULTILINE)
        if m2:
            insert_pos = m2.end()

    bak = path.with_suffix(path.suffix + '.bak')
    try:
        bak.write_text(text, encoding='utf-8')
    except Exception as e:
        print('Failed to write backup for', path, e)

    new_text = text[:insert_pos] + '\n' + SNIPPET + '\n' + text[insert_pos:]
    # ensure activation_client import exists
    if 'from activation_client import' not in new_text:
        new_text = 'from activation_client import check_token_with_central\n' + new_text

    path.write_text(new_text, encoding='utf-8')
    print('Patched:', path)
    return True


def main():
    total = 0
    for t in TARGETS:
        if apply_to_file(t):
            total += 1
    print('Done. Patched', total, 'files.')


if __name__ == '__main__':
    main()
