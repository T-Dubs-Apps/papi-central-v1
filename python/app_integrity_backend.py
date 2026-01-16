"""
App Integrity & Repair Backend for PAPI Central
Flask API for scanning, repairing, key management, and deployment hooks
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
import json

app = Flask(__name__)
CORS(app)

# --- Scan apps for integrity/usability/etc. ---
@app.route('/scan-apps', methods=['GET'])
def scan_apps():
    # Demo: Scan for .html apps and simulate issues
    app_files = [f for f in os.listdir('.') if f.endswith('.html')]
    issues = []
    for app_file in app_files:
        # Simulate checks
        if 'ai-assistant' in app_file:
            issues.append({'app': app_file, 'issue': 'Low creativity score', 'fix': 'Enhance prompt variety'})
        if 'file-arranger' in app_file:
            issues.append({'app': app_file, 'issue': 'Usability: unclear instructions', 'fix': 'Add onboarding tooltip'})
        if 'universal-live-editor' in app_file:
            issues.append({'app': app_file, 'issue': 'API key not auto-configured', 'fix': 'Integrate key-controller'})
    return jsonify({'issues': issues, 'apps': app_files})

# --- Repair/enhance apps ---
@app.route('/repair-app', methods=['POST'])
def repair_app():
    data = request.json
    app_name = data.get('app')
    fix = data.get('fix')
    # Demo: Simulate repair
    # In real app, apply code changes or enhancements
    return jsonify({'success': True, 'app': app_name, 'fix': fix, 'message': f'Repair applied: {fix}'})

# --- Key management ---
@app.route('/configure-key', methods=['POST'])
def configure_key():
    data = request.json
    app_name = data.get('app')
    api_key = data.get('api_key')
    # Store key in local file (demo)
    keys = {}
    if os.path.exists('api_keys.json'):
        with open('api_keys.json', 'r') as f:
            keys = json.load(f)
    keys[app_name] = api_key
    with open('api_keys.json', 'w') as f:
        json.dump(keys, f)
    return jsonify({'success': True, 'app': app_name, 'api_key': api_key})

# --- Deployment hook ---
@app.route('/trigger-deploy', methods=['POST'])
def trigger_deploy():
    data = request.json
    app_name = data.get('app')
    # Demo: Simulate deployment trigger
    # In real app, call GitHub/Render/Vercel API
    return jsonify({'success': True, 'app': app_name, 'message': 'Deployment triggered'})

if __name__ == '__main__':
    print('App Integrity & Repair Backend running on port 5050')
    app.run(debug=True, port=5050)
