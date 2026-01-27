from flask import Flask, request, jsonify
import os
import hmac
import hashlib
import json
import base64
import time

app = Flask(__name__)

KEY_PATH = os.path.join(os.path.dirname(__file__), 'REPO_API_KEY.secret')

def load_key():
    if not os.path.exists(KEY_PATH):
        return None
    with open(KEY_PATH, 'r', encoding='utf-8') as f:
        return f.read().strip()

def sign_payload(payload: dict, key: str) -> str:
    data = json.dumps(payload, separators=(',', ':'), sort_keys=True).encode('utf-8')
    b64 = base64.urlsafe_b64encode(data).decode('utf-8')
    sig = hmac.new(key.encode('utf-8'), b64.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{b64}.{sig}"

def verify_token(token: str, key: str):
    try:
        b64, sig = token.rsplit('.', 1)
        expected = hmac.new(key.encode('utf-8'), b64.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, sig):
            return None
        data = base64.urlsafe_b64decode(b64.encode('utf-8'))
        return json.loads(data)
    except Exception:
        return None


@app.route('/admin/activate', methods=['POST'])
def admin_activate():
    key = load_key()
    if not key:
        return jsonify({'error': 'repo key missing'}), 500
    header = request.headers.get('x-repo-admin-key')
    if not header or header != key:
        return jsonify({'error': 'unauthorized'}), 401
    data = request.get_json() or {}
    email = data.get('email')
    appid = data.get('app')
    payload = {'email': email, 'app': appid, 'issued_at': int(time.time())}
    token = sign_payload(payload, key)
    return jsonify({'token': token, 'payload': payload})


@app.route('/check-token', methods=['POST'])
def check_token():
    key = load_key()
    if not key:
        return jsonify({'valid': False, 'error': 'repo key missing'}), 500
    j = request.get_json() or {}
    token = j.get('token') or request.headers.get('X-Activation-Token')
    if not token:
        return jsonify({'valid': False, 'error': 'no token provided'}), 400
    payload = verify_token(token, key)
    if not payload:
        return jsonify({'valid': False, 'error': 'invalid token'}), 401
    return jsonify({'valid': True, 'payload': payload})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print('Starting central stub on port', port)
    app.run(host='127.0.0.1', port=port)
