import os
import sys
import json
import requests

def load_repo_key(path=None):
    path = path or os.path.join(os.path.dirname(__file__), 'REPO_API_KEY.secret')
    if not os.path.exists(path):
        print('REPO_API_KEY.secret not found at', path)
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return f.read().strip()

def admin_activate(email, app='default', central_url='http://localhost:3000'):
    key = load_repo_key()
    if not key:
        print('Repo key missing')
        return False
    url = f"{central_url.rstrip('/')}/admin/activate"
    headers = {'Content-Type': 'application/json', 'x-repo-admin-key': key}
    body = {'email': email, 'app': app}
    r = requests.post(url, headers=headers, json=body)
    if r.status_code == 200:
        try:
            print('Activated:', r.json())
        except Exception:
            print('Activated; server returned:', r.text)
        return True
    else:
        print('Failed:', r.status_code, r.text)
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python admin_activate.py user@example.com [appId] [central_url]')
        sys.exit(2)
    email = sys.argv[1]
    app = sys.argv[2] if len(sys.argv) > 2 else 'default'
    central = sys.argv[3] if len(sys.argv) > 3 else 'http://localhost:3000'
    ok = admin_activate(email, app, central)
    sys.exit(0 if ok else 1)
