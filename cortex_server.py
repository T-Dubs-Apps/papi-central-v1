"""
PAPI Cortex Desktop Server
Flask API bridge between The_Cortex.py and web interface

Run: python cortex_server.py
Access: http://localhost:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from The_Cortex import TheCortex
import os

app = Flask(__name__)
CORS(app)  # Allow web interface to connect

# Initialize The Cortex
cortex = TheCortex()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'online', 'cortex': 'ready'})

@app.route('/ask', methods=['POST'])
def ask():
    """Ask The Cortex a question"""
    try:
        data = request.json
        question = data.get('question', '')
        context = data.get('context', None)
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        # Get response from Cortex
        response = cortex.ask(question, context)
        stats = cortex.get_stats()
        
        return jsonify({
            'response': response,
            'stats': stats,
            'timestamp': cortex.conversation_history[-1]['timestamp']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def stats():
    """Get Cortex statistics"""
    return jsonify(cortex.get_stats())

@app.route('/configure', methods=['POST'])
def configure():
    """Configure API provider"""
    try:
        data = request.json
        provider = data.get('provider')
        api_key = data.get('api_key')
        
        if not provider or not api_key:
            return jsonify({'error': 'Provider and API key required'}), 400
        
        cortex.configure_api(provider, api_key)
        
        return jsonify({
            'success': True,
            'provider': provider,
            'message': f'Configured {provider} API'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def history():
    """Get conversation history"""
    return jsonify({
        'history': cortex.conversation_history[-50:],  # Last 50 messages
        'total': len(cortex.conversation_history)
    })

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    """Get or update user profile"""
    if request.method == 'GET':
        return jsonify(cortex.user_profile)
    else:
        try:
            data = request.json
            cortex.user_profile.update(data)
            cortex.save_memory()
            return jsonify({
                'success': True,
                'profile': cortex.user_profile
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/generate-code', methods=['POST'])
def generate_code():
    """Generate code for specific project type"""
    try:
        data = request.json
        project_type = data.get('type', 'todo')
        
        if project_type == 'todo':
            response = cortex._generate_todo_app()
        elif project_type == 'calculator':
            response = cortex._generate_calculator()
        elif project_type == 'dashboard':
            response = cortex._generate_dashboard()
        else:
            response = cortex.ask(f"Generate code for a {project_type} app")
        
        return jsonify({
            'code': response,
            'type': project_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clear-memory', methods=['POST'])
def clear_memory():
    """Clear conversation history (keep profile)"""
    try:
        cortex.conversation_history = []
        cortex.save_memory()
        return jsonify({
            'success': True,
            'message': 'Conversation history cleared'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🧠 PAPI CORTEX DESKTOP SERVER")
    print("=" * 60)
    print()
    print("Status: Starting...")
    print("Port: 5000")
    print("Interface: http://localhost:5000")
    print()
    print("📡 Web Bridge: Open cortex-desktop-bridge.html")
    print()
    print("Endpoints:")
    print("  GET  /health - Server status")
    print("  POST /ask - Ask a question")
    print("  GET  /stats - Get statistics")
    print("  POST /configure - Configure API")
    print("  GET  /history - Get conversation history")
    print("  POST /generate-code - Generate project code")
    print()
    print("Press CTRL+C to stop")
    print("=" * 60)
    print()
    
    app.run(debug=True, port=5000)
