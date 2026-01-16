"""
PAPI CORTEX - Private AI Brain System
Advanced Multi-Provider AI with Learning Capabilities
Troy Walker's Personal AI Assistant
"""

import os
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional

class TheCortex:
    """
    The Cortex - Private AI Brain
    Multi-provider support with conversation memory and learning
    """
    
    def __init__(self):
        self.conversation_history = []
        self.user_profile = {
            "projects": [],
            "preferences": {},
            "expertise": "beginner",
            "goals": []
        }
        self.api_keys = {}
        self.active_provider = "demo"
        self.load_memory()
        
    def load_memory(self):
        """Load conversation history and user profile from memory"""
        try:
            if os.path.exists('cortex_memory.json'):
                with open('cortex_memory.json', 'r') as f:
                    data = json.load(f)
                    self.conversation_history = data.get('history', [])
                    self.user_profile = data.get('profile', self.user_profile)
            print("✓ Memory loaded successfully")
        except Exception as e:
            print(f"⚠ Memory load failed: {e}")
            
    def save_memory(self):
        """Save current state to memory"""
        try:
            data = {
                'history': self.conversation_history[-100:],  # Keep last 100
                'profile': self.user_profile,
                'last_updated': datetime.now().isoformat()
            }
            with open('cortex_memory.json', 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"⚠ Memory save failed: {e}")
            
    def configure_api(self, provider: str, api_key: str):
        """Configure API provider"""
        self.api_keys[provider] = api_key
        self.active_provider = provider
        print(f"✓ Configured {provider.upper()} API")
        
    def ask(self, question: str, context: Optional[Dict] = None) -> str:
        """
        Ask The Cortex a question
        """
        # Add to conversation history
        self.conversation_history.append({
            'role': 'user',
            'content': question,
            'timestamp': datetime.now().isoformat()
        })
        
        # Process with active provider
        if self.active_provider == "demo":
            response = self._demo_mode(question, context)
        else:
            response = self._call_api(question, context)
            
        # Add response to history
        self.conversation_history.append({
            'role': 'assistant',
            'content': response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Learn from interaction
        self._learn_from_interaction(question, response)
        
        # Save memory
        self.save_memory()
        
        return response
        
    def _demo_mode(self, question: str, context: Optional[Dict]) -> str:
        """Demo mode responses without API"""
        q = question.lower()
        
        # Code generation
        if 'build' in q or 'create' in q or 'make' in q:
            if 'todo' in q or 'task' in q:
                return self._generate_todo_app()
            elif 'calculator' in q:
                return self._generate_calculator()
            elif 'dashboard' in q:
                return self._generate_dashboard()
            else:
                return "I can help you build: Todo App, Calculator, or Dashboard. Which would you like? (Or configure your API keys for unlimited custom generation!)"
                
        # Learning
        if 'how' in q or 'explain' in q or 'what is' in q:
            return "I'm in demo mode. Configure your API keys in settings for full explanations and learning features!"
            
        # Project suggestions
        if 'suggest' in q or 'recommend' in q:
            return self._recommend_project()
            
        return "I'm The Cortex AI. Configure your API keys to unlock my full power!"
        
    def _call_api(self, question: str, context: Optional[Dict]) -> str:
        """Call configured AI API"""
        try:
            if self.active_provider == "openai":
                return self._call_openai(question)
            elif self.active_provider == "claude":
                return self._call_claude(question)
            elif self.active_provider == "gemini":
                return self._call_gemini(question)
        except Exception as e:
            return f"API Error: {str(e)}"
            
    def _call_openai(self, question: str) -> str:
        """Call OpenAI API"""
        import requests
        
        api_key = self.api_keys.get('openai')
        if not api_key:
            return "OpenAI API key not configured"
            
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': 'gpt-4',
            'messages': [
                {'role': 'system', 'content': 'You are The Cortex, an expert AI assistant helping Troy Walker build amazing apps.'},
                *self.conversation_history[-5:],
                {'role': 'user', 'content': question}
            ],
            'temperature': 0.7,
            'max_tokens': 1000
        }
        
        response = requests.post('https://api.openai.com/v1/chat/completions', 
                                headers=headers, json=data)
        response.raise_for_status()
        
        return response.json()['choices'][0]['message']['content']
        
    def _learn_from_interaction(self, question: str, response: str):
        """Learn from user interactions"""
        q = question.lower()
        
        # Detect project type
        if 'build' in q or 'create' in q:
            if 'app' in q:
                if 'app' not in self.user_profile['projects']:
                    self.user_profile['projects'].append('app_development')
                    
        # Detect expertise level
        if 'how to' in q or 'what is' in q:
            self.user_profile['expertise'] = 'learning'
        elif 'optimize' in q or 'refactor' in q:
            self.user_profile['expertise'] = 'advanced'
            
    def _generate_todo_app(self) -> str:
        """Generate a todo app template"""
        return """
✓ TODO APP TEMPLATE

HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; }
        .todo-item { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        .completed { text-decoration: line-through; opacity: 0.6; }
    </style>
</head>
<body>
    <h1>My Tasks</h1>
    <input id="taskInput" placeholder="Add new task..." />
    <button onclick="addTask()">Add</button>
    <div id="taskList"></div>
    
    <script>
        let tasks = [];
        
        function addTask() {
            const input = document.getElementById('taskInput');
            if (input.value.trim()) {
                tasks.push({ text: input.value, done: false });
                input.value = '';
                renderTasks();
            }
        }
        
        function toggleTask(index) {
            tasks[index].done = !tasks[index].done;
            renderTasks();
        }
        
        function renderTasks() {
            const list = document.getElementById('taskList');
            list.innerHTML = tasks.map((task, i) => 
                `<div class="todo-item ${task.done ? 'completed' : ''}" onclick="toggleTask(${i})">
                    ${task.text}
                </div>`
            ).join('');
        }
    </script>
</body>
</html>
```

Ready to deploy! Copy this code to a .html file and open it in your browser.
"""
        
    def _generate_calculator(self) -> str:
        """Generate calculator template"""
        return "Calculator template - configure API for full code generation!"
        
    def _generate_dashboard(self) -> str:
        """Generate dashboard template"""
        return "Dashboard template - configure API for full code generation!"
        
    def _recommend_project(self) -> str:
        """Recommend a project based on user profile"""
        expertise = self.user_profile['expertise']
        
        if expertise == 'beginner':
            return """
🚀 PROJECT RECOMMENDATION

Based on your profile, I recommend starting with:

1. **Personal Portfolio Website**
   - Practice HTML/CSS/JS
   - Showcase your work
   - Deploy on GitHub Pages

2. **Todo List App**
   - Learn CRUD operations
   - Practice DOM manipulation
   - Add localStorage

3. **Weather Dashboard**
   - API integration practice
   - Real-time data display
   - Responsive design

Would you like me to help you build any of these?
"""
        else:
            return "Advanced project recommendations - configure API for personalized suggestions!"
            
    def get_stats(self) -> Dict:
        """Get Cortex statistics"""
        return {
            'conversations': len(self.conversation_history),
            'projects': len(self.user_profile['projects']),
            'expertise': self.user_profile['expertise'],
            'provider': self.active_provider
        }


def main():
    """Main entry point"""
    print("=" * 50)
    print("THE CORTEX - Private AI Brain")
    print("=" * 50)
    print()
    
    cortex = TheCortex()
    
    print("Status:")
    stats = cortex.get_stats()
    print(f"  Provider: {stats['provider']}")
    print(f"  Expertise: {stats['expertise']}")
    print(f"  Conversations: {stats['conversations']}")
    print()
    
    print("Commands:")
    print("  ask <question> - Ask The Cortex")
    print("  config <provider> <key> - Configure API")
    print("  stats - Show statistics")
    print("  exit - Quit")
    print()
    
    while True:
        try:
            cmd = input("Cortex> ").strip()
            
            if not cmd:
                continue
                
            if cmd == 'exit':
                print("Goodbye!")
                break
                
            elif cmd == 'stats':
                stats = cortex.get_stats()
                for key, value in stats.items():
                    print(f"  {key}: {value}")
                    
            elif cmd.startswith('config '):
                parts = cmd.split(' ', 2)
                if len(parts) >= 3:
                    cortex.configure_api(parts[1], parts[2])
                else:
                    print("Usage: config <provider> <api_key>")
                    
            elif cmd.startswith('ask '):
                question = cmd[4:]
                response = cortex.ask(question)
                print()
                print(response)
                print()
                
            else:
                response = cortex.ask(cmd)
                print()
                print(response)
                print()
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
