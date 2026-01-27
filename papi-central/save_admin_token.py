import os
import json
import time
import requests

base_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else r"C:\Users\troyw\Desktop\projects folder\papi-central"
key_path = os.path.join(base_dir, 'REPO_API_KEY.secret')
with open(key_path, 'r') as f:
    key = f.read().strip()

url = 'http://localhost:3000/admin/activate'
body = {'email': 'mr.troy.walker.62.@gmail.com', 'app': 'sitesnap_pro_desktop'}
resp = requests.post(url, json=body, headers={'x-repo-admin-key': key}, timeout=10)
resp.raise_for_status()
resp_json = resp.json()

token = resp_json.get('token') or resp_json.get('toke') or resp_json.get('activation_token')
payload = resp_json.get('payload', {})

entry = {
    'email': body['email'],
    'app': body['app'],
    'token': token,
    'payload': payload,
    'issued_at': int(time.time()),
    'saved_at': int(time.time())
}

issued_path = os.path.join(base_dir, 'issued_tokens.json')
if os.path.exists(issued_path):
    try:
        with open(issued_path, 'r') as f:
            data = json.load(f)
    except Exception:
        data = []
else:
    data = []

data.append(entry)
with open(issued_path, 'w') as f:
    json.dump(data, f, indent=2)

print('Saved token to', issued_path)
