# 🧠 CORTEX DESKTOP - Premium Desktop-to-Web AI Bridge

## 🎯 What Is It?

**Cortex Desktop** bridges your Python AI assistant (The_Cortex.py) to a beautiful web interface, creating a powerful desktop AI system with conversation memory and learning capabilities.

---

## ✨ Features

### Free Version
- ✅ Desktop CLI AI assistant with memory
- ✅ Web terminal interface
- ✅ Demo mode code generation (Todo App, Calculator, Dashboard)
- ✅ Project recommendations
- ✅ Conversation history saved locally
- ✅ Basic learning from interactions

### Pro Version ($29.99/mo)
- 🚀 Desktop-to-web real-time sync
- 🧠 Advanced learning algorithms
- 💾 Unlimited conversation memory
- 🔄 Multi-device sync
- 🎨 Custom code templates
- ⚡ Priority API processing
- 📊 Advanced analytics
- 🔐 Encrypted cloud backup

---

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
pip install flask flask-cors requests
```

### Step 2: Start the Server
```bash
python cortex_server.py
```

### Step 3: Open the Interface
Open `cortex-desktop-bridge.html` in your browser

### Step 4: Start Chatting!
Type commands like:
- `ask How do I build a todo app?`
- `stats`
- `ask Recommend a project for me`

---

## 📁 Files Included

1. **The_Cortex.py** - Python AI brain with memory
2. **cortex_server.py** - Flask API server
3. **cortex-desktop-bridge.html** - Web interface
4. **LAUNCH-Cortex-Desktop.html** - Quick launcher
5. **cortex_memory.json** - Auto-generated memory storage

---

## 🎮 How To Use

### CLI Mode (Free)
```bash
python The_Cortex.py
Cortex> ask How do I build a REST API?
Cortex> stats
Cortex> exit
```

### Web Mode (Pro)
1. Start server: `python cortex_server.py`
2. Open interface in browser
3. Type questions in the terminal
4. Get instant AI responses with code generation!

---

## 🔧 API Configuration

### Configure OpenAI
```bash
Cortex> config openai sk-YOUR_KEY_HERE
```

### Configure Claude
```bash
Cortex> config claude sk-ant-YOUR_KEY_HERE
```

### Configure Gemini
```bash
Cortex> config gemini AIza-YOUR_KEY_HERE
```

Or use the web interface Settings panel!

---

## 💡 What Can It Do?

### Code Generation
```
ask Build me a todo app with localStorage
```
Returns: Full HTML/JS/CSS code ready to use

### Project Planning
```
ask I want to build a weather dashboard
```
Returns: Step-by-step project plan with tech stack

### Learning Assistant
```
ask Explain how async/await works
```
Returns: Clear explanations tailored to your level

### Problem Solving
```
ask How do I fix CORS errors?
```
Returns: Practical solutions with code examples

---

## 🎯 Use Cases

### For Beginners
- Learn coding with interactive tutorials
- Get code templates for common projects
- Build portfolio projects with guidance

### For Professionals
- Rapid prototyping with code generation
- Architecture planning and design
- Code review and optimization suggestions

### For Teams
- Shared conversation history
- Project planning templates
- Knowledge base building

---

## 🔐 Security & Privacy

✅ **Your data stays local** - Conversations saved in `cortex_memory.json`  
✅ **No tracking** - Zero analytics or data collection  
✅ **API keys secure** - Stored locally, never transmitted except to official APIs  
✅ **Open source** - Fully auditable Python code  

### Pro Benefits:
🔒 **Encrypted cloud backup** - AES-256 encryption  
🔄 **Multi-device sync** - E2E encrypted  
🛡️ **Privacy first** - We never read your conversations  

---

## 📊 API Endpoints

### POST /ask
Ask The Cortex a question
```json
{
  "question": "How do I build a REST API?",
  "context": {}
}
```

### GET /stats
Get usage statistics
```json
{
  "conversations": 45,
  "projects": 3,
  "expertise": "intermediate",
  "provider": "openai"
}
```

### POST /configure
Configure AI provider
```json
{
  "provider": "openai",
  "api_key": "sk-..."
}
```

### GET /history
Get conversation history (last 50 messages)

### POST /generate-code
Generate code for specific project types
```json
{
  "type": "todo" // or "calculator", "dashboard"
}
```

---

## 🎨 Customization

### Add Custom Templates
Edit `The_Cortex.py` and add methods:

```python
def _generate_your_template(self) -> str:
    return """
    Your custom code template here
    """
```

### Custom Learning Paths
Modify `_learn_from_interaction()` to track specific patterns

### Personalized Responses
Update `user_profile` structure to track more user data

---

## 🚀 Upgrade to Pro

### What You Get:
- ✨ Unlimited conversations (free tier: 100/day)
- 🧠 Advanced AI models (GPT-4, Claude Opus)
- 💾 Unlimited memory storage
- 🔄 Multi-device sync
- 📱 Mobile app access
- 🎯 Priority support
- 🔧 Custom integrations

### Pricing:
**$29.99/month** or **$299/year** (2 months free)

Click "Upgrade" in the interface or visit:
`PAPI Central.htm?product=cortex_desktop`

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Use different port
python cortex_server.py --port 5001
```

### "Module Not Found" Error
```bash
pip install -r requirements.txt
```

### Memory File Corrupt
```bash
# Backup old memory
mv cortex_memory.json cortex_memory.json.backup

# Restart - new memory file created
python cortex_server.py
```

### API Key Not Working
- Check key format (OpenAI: sk-, Claude: sk-ant-, Gemini: AIza)
- Verify key is active in provider dashboard
- Test with demo mode first

---

## 📖 Examples

### Example 1: Generate a Todo App
```
You> ask Build me a todo app with localStorage
Cortex> ✓ TODO APP TEMPLATE
[Full HTML/JS code returned]
```

### Example 2: Learn a Concept
```
You> ask What is closure in JavaScript?
Cortex> [Detailed explanation with examples]
```

### Example 3: Project Planning
```
You> ask I want to build a social media app
Cortex> 🚀 PROJECT PLAN
Phase 1: Requirements...
[Full project breakdown]
```

---

## 🤝 Integration with PAPI Central

Cortex Desktop integrates seamlessly with:
- **Key Controller** - Manage API keys centrally
- **PAPI Central Store** - One-click license activation
- **Other PAPI Apps** - Shared license system

Your `cortex_desktop_license` works across all PAPI apps!

---

## 📝 Changelog

### v1.0.0 (January 2026)
- 🎉 Initial release
- ✅ Flask API server
- ✅ Web terminal interface
- ✅ Demo mode with templates
- ✅ Multi-provider support
- ✅ Conversation memory
- ✅ Learning from interactions

---

## 💬 Support

**Documentation**: This file  
**Issues**: Report bugs via PAPI Central feedback  
**Feature Requests**: Email troy@papicentral.com  
**Pro Support**: Priority support via dashboard  

---

## 🎓 Learning Resources

### Tutorials
- Getting Started Guide (this file)
- Video walkthrough (coming soon)
- Example projects repository

### Community
- Discord server (Pro members)
- GitHub discussions
- Monthly webinars (Pro members)

---

## 📜 License

**Free Version**: MIT License - use anywhere!  
**Pro Version**: Commercial license included with subscription  

---

**Built with 💜 by Troy Walker**  
**Part of the PAPI Central AI Suite**
