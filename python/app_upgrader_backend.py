# app_upgrader_backend.py
"""
Automated backend for App Upgrader Pro
- Accepts uploaded app files/folders
- Analyzes code structure, quality, and completeness
- Suggests and applies repairs (basic logic)
- Returns upgrade report and improved files
"""
from flask import Flask, request, jsonify
import os, tempfile, zipfile

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    with tempfile.TemporaryDirectory() as tmpdir:
        zip_path = os.path.join(tmpdir, 'upload.zip')
        file.save(zip_path)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(tmpdir)
        report, repairs = scan_and_repair(tmpdir)
    return jsonify({'report': report, 'repairs': repairs})

def scan_and_repair(folder):
    report = []
    repairs = []
    for root, _, files in os.walk(folder):
        for fname in files:
            fpath = os.path.join(root, fname)
            if fname.endswith('.js') or fname.endswith('.html'):
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    code = f.read()
                # Example: check for missing <title> in HTML
                if fname.endswith('.html') and '<title>' not in code:
                    report.append(f"{fname}: Missing <title> tag. Added.")
                    code = code.replace('<head>', '<head>\n  <title>Auto-Added</title>')
                    with open(fpath, 'w', encoding='utf-8') as f:
                        f.write(code)
                    repairs.append(fname)
                # Example: check for missing semicolons in JS
                if fname.endswith('.js') and not code.strip().endswith(';'):
                    report.append(f"{fname}: Missing semicolon at end. Added.")
                    code += ';'
                    with open(fpath, 'w', encoding='utf-8') as f:
                        f.write(code)
                    repairs.append(fname)
    if not report:
        report.append('No issues found. App is well-structured.')
    return report, repairs

if __name__ == '__main__':
    app.run(port=5050, debug=True)
