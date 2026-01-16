# 🚀 CORTEX DESKTOP - Complete Setup Guide

## 📋 Quick Start (3 Minutes)

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Start the Server
```bash
python cortex_server.py
```

You should see:
```
🧠 PAPI CORTEX DESKTOP SERVER
Status: Starting...
Port: 5000
Interface: http://localhost:5000
```

### Step 3: Open Web Interface
Open `cortex-desktop-bridge.html` in your browser

### Step 4: Test the System
Click "Start Cortex Server" button, then try these quick commands:
- `stats`
- `ask Build me a todo app`
- `ask Recommend a project`

---

## 💻 Installation Options

### Option 1: Quick Install (Recommended)
```bash
# Clone or download PAPI Central
cd "PAPI Central"

# Install Python dependencies
pip install -r requirements.txt

# Start server
python cortex_server.py

# Open cortex-desktop-bridge.html
```

### Option 2: Manual Install
```bash
# Install each package individually
pip install flask
pip install flask-cors
pip install requests
pip install python-dotenv

# Verify installation
python -c "import flask; print('Flask installed!')"

# Start server
python cortex_server.py
```

### Option 3: Virtual Environment (Best Practice)
```bash
# Create virtual environment
python -m venv cortex_env

# Activate it
# Windows:
cortex_env\Scripts\activate
# Mac/Linux:
source cortex_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python cortex_server.py
```

---

## 🔧 Configuration

### Configure API Keys

#### Method 1: Via CLI
```bash
python The_Cortex.py
Cortex> config openai sk-YOUR_KEY_HERE
Cortex> exit
```

#### Method 2: Via Web Interface
1. Start server: `python cortex_server.py`
2. Open web interface
3. Type: `config openai sk-YOUR_KEY_HERE`

#### Method 3: Via Python (Programmatic)
```python
from The_Cortex import TheCortex

cortex = TheCortex()
cortex.configure_api('openai', 'sk-YOUR_KEY_HERE')
cortex.save_memory()
```

### Configure Port
```bash
# Default port 5000
python cortex_server.py

# Custom port
python cortex_server.py --port 8080
```

Or edit `cortex_server.py` line 128:
```python
app.run(debug=True, port=5000)  # Change to your port
```

---

## 🎯 Usage Examples

### Example 1: Build a Todo App
```
Cortex> ask Build me a todo app with localStorage
```

**Output**: Complete HTML/CSS/JS code ready to use!

### Example 2: Learn JavaScript
```
Cortex> ask Explain async/await in JavaScript
```

**Output**: Clear explanation with examples

### Example 3: Project Planning
```
Cortex> ask I want to build a weather dashboard
```

**Output**: Step-by-step project plan with tech stack

### Example 4: Debug Help
```
Cortex> ask How do I fix CORS errors in my API?
```

**Output**: Practical solutions with code examples

---

## 🛠️ Advanced Features

### API Integration
```python
# In your Python code
from The_Cortex import TheCortex

cortex = TheCortex()
cortex.configure_api('openai', 'sk-...')

response = cortex.ask("How do I build a REST API?")
print(response)

stats = cortex.get_stats()
print(f"Total conversations: {stats['conversations']}")
```

### Custom Code Templates
Add to `The_Cortex.py`:
```python
def _generate_contact_form(self) -> str:
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Contact Form</title>
    </head>
    <body>
        <form id="contactForm">
            <input name="name" placeholder="Name" required>
            <input name="email" type="email" placeholder="Email" required>
            <textarea name="message" placeholder="Message" required></textarea>
            <button type="submit">Send</button>
        </form>
        
        <script>
            document.getElementById('contactForm').onsubmit = function(e) {
                e.preventDefault();
                const data = new FormData(e.target);
                alert('Sending: ' + JSON.stringify(Object.fromEntries(data)));
            }
        </script>
    </body>
    </html>
    """
```

Then use:
```
Cortex> ask Generate a contact form
```

### Conversation History Access
```python
# Get all conversations
cortex = TheCortex()
print(f"Total messages: {len(cortex.conversation_history)}")

# Get last 10
last_10 = cortex.conversation_history[-10:]
for msg in last_10:
    print(f"{msg['role']}: {msg['content']}")
```

### User Profile Customization
```python
cortex = TheCortex()

# Update profile
cortex.user_profile['expertise'] = 'advanced'
cortex.user_profile['goals'] = ['Build SaaS', 'Learn ML']
cortex.user_profile['preferences'] = {
    'framework': 'React',
    'language': 'TypeScript'
}

cortex.save_memory()
```

---

## 🌐 Web API Reference

### POST /ask
```javascript
fetch('http://localhost:5000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'How do I build a REST API?' })
})
.then(res => res.json())
.then(data => console.log(data.response));
```

### GET /stats
```javascript
fetch('http://localhost:5000/stats')
    .then(res => res.json())
    .then(stats => console.log(stats));
```

### POST /configure
```javascript
fetch('http://localhost:5000/configure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        provider: 'openai',
        api_key: 'sk-...'
    })
});
```

### GET /history
```javascript
fetch('http://localhost:5000/history')
    .then(res => res.json())
    .then(data => console.log(data.history));
```

---

## 🔐 Security Best Practices

### API Key Storage
✅ **DO**: Store keys in `cortex_memory.json` (gitignored)
❌ **DON'T**: Hardcode keys in Python files

### .gitignore Setup
Add to `.gitignore`:
```
cortex_memory.json
cortex_env/
__pycache__/
*.pyc
.env
```

### Environment Variables (Optional)
Create `.env`:
```
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

Load in Python:
```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
```

---

## 🐛 Troubleshooting

### Problem: "Module not found: flask"
**Solution**:
```bash
pip install flask flask-cors requests
```

### Problem: "Port 5000 already in use"
**Solution**:
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill it (Windows)
taskkill /PID <process_id> /F

# Or use different port
python cortex_server.py --port 8080
```

### Problem: "CORS error in browser"
**Solution**: Make sure `flask-cors` is installed:
```bash
pip install flask-cors
```

### Problem: Memory file corrupt
**Solution**:
```bash
# Backup existing
mv cortex_memory.json cortex_memory_backup.json

# Start fresh
python cortex_server.py
```

### Problem: API not responding
**Solution**:
```python
# Test API key directly
import requests

headers = {'Authorization': 'Bearer sk-YOUR_KEY'}
response = requests.get('https://api.openai.com/v1/models', headers=headers)
print(response.status_code)  # Should be 200
```

---

## 📊 Performance Tips

### Optimize Memory Usage
```python
# Limit conversation history
cortex.conversation_history = cortex.conversation_history[-100:]  # Keep last 100
cortex.save_memory()
```

### Speed Up Responses
- Use demo mode for common requests
- Cache frequent responses
- Enable gzip compression in Flask

### Reduce API Costs
- Use demo mode when possible
- Batch similar questions
- Monitor usage with `/stats` endpoint

---

## 🎓 Learning Resources

### Tutorials
1. **Getting Started**: This guide
2. **Video Walkthrough**: [Coming soon]
3. **API Documentation**: See CORTEX_DESKTOP_README.md
4. **Example Projects**: Check `/examples` folder

### Community
- GitHub Discussions
- Discord Server (Pro members)
- Monthly Webinars (Pro members)

---

## 📦 Deployment

### Deploy Flask Server

#### Option 1: Local Network Access
```python
# Change in cortex_server.py
app.run(host='0.0.0.0', port=5000)
```

Now accessible from other devices: `http://YOUR_IP:5000`

#### Option 2: Heroku Deployment
```bash
# Install Heroku CLI
heroku login

# Create Procfile
echo "web: python cortex_server.py" > Procfile

# Deploy
heroku create your-cortex-app
git push heroku main
```

#### Option 3: Docker Container
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "cortex_server.py"]
```

Build and run:
```bash
docker build -t cortex-desktop .
docker run -p 5000:5000 cortex-desktop
```

---

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
pip install --upgrade flask flask-cors requests
```

### Check Version
```bash
python The_Cortex.py --version
```

### Backup Data
```bash
# Backup conversation history
cp cortex_memory.json cortex_memory_backup_$(date +%Y%m%d).json
```

---

## 💡 Pro Tips

1. **Use Virtual Environments** - Keeps dependencies isolated
2. **Monitor API Usage** - Check `/stats` regularly
3. **Save Important Conversations** - Export via `/history` endpoint
4. **Customize Templates** - Add your own code generators
5. **Learn from History** - Review past conversations to improve

---

## 📞 Support

**Free Support**:
- Documentation (this file)
- GitHub Issues
- Community Discord

**Pro Support** ($29.99/mo includes):
- Priority email support
- 1-on-1 setup assistance
- Custom integration help
- Monthly check-ins

---

**Ready to build something amazing?** 🚀

Start the server and let The Cortex help you code faster!

```bash
python cortex_server.py
```
