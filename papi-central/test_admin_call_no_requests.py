import json
import urllib.request
import os

base_dir = None
if '__file__' in globals():
    base_dir = os.path.dirname(os.path.abspath(__file__))
else:
    base_dir = r"C:\Users\troyw\Desktop\projects folder\papi-central"

key_path = os.path.join(base_dir, 'REPO_API_KEY.secret')
with open(key_path, 'r') as f:
    key = f.read().strip()

url = 'http://localhost:3000/admin/activate'
body = {'email': 'test-user@example.com', 'app': 'sitesnap_pro_desktop'}
data = json.dumps(body).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')
req.add_header('x-repo-admin-key', key)

try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        resp_data = resp.read().decode('utf-8')
        print('Response:', resp_data)
except Exception as e:
    print('Request failed:', e)
