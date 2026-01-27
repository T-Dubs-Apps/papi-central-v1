import os, json, time
from urllib import request, error
import ssl

base_dir = r"C:\Users\troyw\Desktop\projects folder\papi-central"
key_path = os.path.join(base_dir, 'REPO_API_KEY.secret')
with open(key_path, 'r') as f:
    key = f.read().strip()

url = 'http://127.0.0.1:3000/admin/activate'
body = json.dumps({'email':'mr.troy.walker.62.@gmail.com','app':'sitesnap_pro_desktop'}).encode('utf-8')
req = request.Request(url, data=body, method='POST')
req.add_header('Content-Type', 'application/json')
req.add_header('x-repo-admin-key', key)

ctx = ssl.create_default_context()
try:
    with request.urlopen(req, timeout=10, context=ctx) as resp:
        text = resp.read().decode('utf-8')
        print('Response:', text)
        resp_json = json.loads(text)
except error.HTTPError as e:
    print('HTTP error:', e.code, e.read().decode('utf-8'))
    raise
except Exception as e:
    print('Request failed:', e)
    raise

token = resp_json.get('token') or resp_json.get('toke') or resp_json.get('activation_token')
entry = {
    'email': 'mr.troy.walker.62.@gmail.com',
    'app': 'sitesnap_pro_desktop',
    'token': token,
    'payload': resp_json.get('payload', {}),
    'issued_at': resp_json.get('payload', {}).get('issued_at') or int(time.time()),
    'saved_at': int(time.time())
}
issued_path = os.path.join(base_dir, 'issued_tokens.json')
if os.path.exists(issued_path):
    try:
        with open(issued_path,'r') as f:
            data = json.load(f)
    except Exception:
        data = []
else:
    data = []

data.append(entry)
with open(issued_path,'w') as f:
    json.dump(data, f, indent=2)
print('Saved token to', issued_path)
