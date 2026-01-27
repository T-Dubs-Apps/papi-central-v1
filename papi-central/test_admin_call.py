import requests, json, os
key_path = os.path.join(os.path.dirname(__file__), 'REPO_API_KEY.secret')
key = None
if os.path.exists(key_path):
    with open(key_path, 'r', encoding='utf-8') as f:
        key = f.read().strip()
url = 'http://localhost:3000/admin/activate'
resp = requests.post(url, headers={'x-repo-admin-key': key}, json={'email':'test-user@example.com','app':'sitesnap_pro_desktop'})
print('status', resp.status_code)
print(resp.text)
