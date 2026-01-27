import json, os, requests, sys
base = r"C:\Users\troyw\Desktop\projects folder\papi-central"
issued = os.path.join(base, 'issued_tokens.json')
if not os.path.exists(issued):
    print('No issued_tokens.json')
    sys.exit(1)
with open(issued,'r') as f:
    a = json.load(f)
if not a:
    print('Empty')
    sys.exit(1)
token = a[-1]['token']
url = 'http://127.0.0.1:10000/chat'
# include force header for local test mode; preserves original activation header
headers = {'X-Activation-Token': token, 'Content-Type':'application/json', 'X-Force-Test-Mode': '1'}
body = {'text':'hello from test'}
try:
    r = requests.post(url, json=body, headers=headers, timeout=10)
    print('Status:', r.status_code)
    try:
        print('Body:', r.json())
    except Exception:
        print('Body text:', r.text)
except Exception as e:
    print('Request failed:', e)
    raise
