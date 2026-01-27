import os, json, time, requests
base_dir = r"C:\Users\troyw\Desktop\projects folder\papi-central"
key_path = os.path.join(base_dir, 'REPO_API_KEY.secret')
print('Reading key from', key_path)
with open(key_path,'r') as f:
    key = f.read().strip()
url = 'http://127.0.0.1:3000/admin/activate'
body = {'email':'mr.troy.walker.62.@gmail.com','app':'sitesnap_pro_desktop'}
print('POST', url, 'body', body)
try:
    r = requests.post(url, json=body, headers={'x-repo-admin-key':key}, timeout=10)
    print('HTTP', r.status_code)
    print('Response text:', r.text)
    r.raise_for_status()
    resp = r.json()
except Exception as e:
    print('Request failed:', repr(e))
    raise

token = resp.get('token') or resp.get('toke')
entry = {
    'email': body['email'], 'app': body['app'], 'token': token,
    'payload': resp.get('payload',{}), 'issued_at': int(time.time()), 'saved_at': int(time.time())
}
issued_path = os.path.join(base_dir,'issued_tokens.json')
print('Saving to', issued_path)
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
print('Saved entry')
print(entry)
