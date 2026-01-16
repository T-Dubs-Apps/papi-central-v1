from flask import Flask, request, jsonify
import secrets
import string
import time

app = Flask(__name__)

# In-memory key store (replace with DB for production)
api_keys = {}

# Generate a cryptographically strong API key
def generate_api_key(length=64):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

@app.route('/generate-key', methods=['POST'])
def generate_key():
    user = request.json.get('user')
    if not user:
        return jsonify({'success': False, 'error': 'User required'}), 400
    key = generate_api_key()
    api_keys[key] = {
        'user': user,
        'created': int(time.time()),
        'active': True
    }
    return jsonify({'success': True, 'api_key': key})

@app.route('/validate-key', methods=['POST'])
def validate_key():
    key = request.json.get('api_key')
    if not key:
        return jsonify({'success': False, 'error': 'API key required'}), 400
    info = api_keys.get(key)
    if info and info['active']:
        return jsonify({'success': True, 'user': info['user'], 'created': info['created']})
    return jsonify({'success': False, 'error': 'Invalid or inactive API key'}), 401

@app.route('/revoke-key', methods=['POST'])
def revoke_key():
    key = request.json.get('api_key')
    if not key:
        return jsonify({'success': False, 'error': 'API key required'}), 400
    if key in api_keys:
        api_keys[key]['active'] = False
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'API key not found'}), 404

@app.route('/list-keys', methods=['GET'])
def list_keys():
    return jsonify({'keys': list(api_keys.keys())})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5055, debug=True)
