import json, os, time, requests

base_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else r"C:\Users\troyw\Desktop\projects folder\papi-central"
issued_path = os.path.join(base_dir, 'issued_tokens.json')
if not os.path.exists(issued_path):
    print('No issued_tokens.json found at', issued_path)
    raise SystemExit(1)

with open(issued_path,'r') as f:
    data = json.load(f)
if not data:
    print('No tokens inside', issued_path)
    raise SystemExit(1)

last = data[-1]
token = last.get('token')
if not token:
    print('No token field in last entry:', last)
    raise SystemExit(1)

# candidate backend hosts/ports to try
hosts = [
    ('127.0.0.1',5000),
    ('127.0.0.1',8000),
    ('127.0.0.1',3001),
    ('localhost',5000)
]

payload = {'message':'activation_test_ping'}
headers = {'Content-Type':'application/json','X-Activation-Token': token}

for host,port in hosts:
    url = f'http://{host}:{port}/chat'
    try:
        print('Trying', url)
        resp = requests.post(url, json=payload, headers=headers, timeout=5)
        print('Status', resp.status_code)
        try:
            print('Body:', resp.text)
        except Exception:
            pass
        break
    except Exception as e:
        print('Failed', url, '->', e)
        time.sleep(0.2)
else:
    print('No reachable backend on tried hosts')
