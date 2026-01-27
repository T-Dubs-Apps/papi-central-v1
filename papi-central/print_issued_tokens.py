import json, os
base_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else r"C:\Users\troyw\Desktop\projects folder\papi-central"
path = os.path.join(base_dir, 'issued_tokens.json')
if not os.path.exists(path):
    print('No issued_tokens.json found at', path)
else:
    with open(path,'r') as f:
        data = json.load(f)
    print(json.dumps(data, indent=2))
