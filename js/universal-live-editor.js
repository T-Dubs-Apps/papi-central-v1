// universal-live-editor.js
// Universal live app editor with AI chat, voice-to-text, and text-to-voice
// NOTE: GitHub and deploy integration requires user tokens and backend proxy for security

const repoUrl = document.getElementById('repoUrl');
const filePath = document.getElementById('filePath');
const fileContent = document.getElementById('fileContent');
const loadBtn = document.getElementById('loadBtn');
const saveBtn = document.getElementById('saveBtn');
const deployBtn = document.getElementById('deployBtn');
const statusDiv = document.getElementById('status');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatBox = document.getElementById('chatBox');
const voiceBtn = document.getElementById('voiceBtn');
const ttsBtn = document.getElementById('ttsBtn');

// --- GitHub Integration (requires backend proxy for security) ---
async function fetchFile() {
  statusDiv.textContent = 'Loading file...';
  // Placeholder: In production, use a backend proxy to fetch file content securely
  statusDiv.textContent = 'Demo: File loading requires backend integration.';
}

async function saveFile() {
  statusDiv.textContent = 'Saving and committing file...';
  // Placeholder: In production, use a backend proxy to commit changes securely
  statusDiv.textContent = 'Demo: Save & commit requires backend integration.';
}

async function triggerDeploy() {
  statusDiv.textContent = 'Triggering deployment...';
  // Placeholder: In production, call Netlify/Vercel/custom webhook
  statusDiv.textContent = 'Demo: Deploy trigger requires backend integration.';
}

loadBtn.onclick = fetchFile;
saveBtn.onclick = saveFile;
deployBtn.onclick = triggerDeploy;

// --- AI Chat Integration (uses OpenAI API via PAPI.loadKey) ---
async function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  chatBox.innerHTML += `<div class='mb-2'><b>You:</b> ${msg}</div>`;
  chatInput.value = '';
  // Store user requests in localStorage for learning
  let history = JSON.parse(localStorage.getItem('ai_request_history') || '[]');
  history.push(msg);
  if (history.length > 50) history = history.slice(-50); // keep last 50
  localStorage.setItem('ai_request_history', JSON.stringify(history));
  // Generate a relevant suggestion (demo: echo or simple pattern)
  let suggestion = '';
  if (/create|build|add|make|generate/i.test(msg)) {
    suggestion =
      'Would you like me to generate a starter template or code for this request?';
  } else if (/edit|update|change|modify/i.test(msg)) {
    suggestion = 'Would you like to see a recommended edit for your file?';
  } else {
    suggestion = 'Would you like a suggestion or example for your request?';
  }
  chatBox.innerHTML += `<div class='mb-2'><b>AI:</b> <i>Thinking...</i></div>`;
  setTimeout(() => {
    chatBox.innerHTML += `<div class='mb-2'><b>AI Suggestion:</b> ${suggestion} <button id='buildFromSuggestion' class='ml-2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs'>Build from Suggestion</button></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    // Add event listener for build button
    const buildBtn = document.getElementById('buildFromSuggestion');
    if (buildBtn) {
      buildBtn.onclick = () => {
        chatBox.innerHTML += `<div class='mb-2'><b>AI:</b> Building from suggestion... (Demo: implement backend call here)</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        // In production, trigger code generation or action here
      };
    }
  }, 1000);
}
chatSend.onclick = sendChat;

// --- Voice to Text (Web Speech API) ---
let recognition;
voiceBtn.onclick = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice recognition not supported in this browser.');
    return;
  }
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    chatInput.value = event.results[0][0].transcript;
  };
  recognition.start();
};

// --- Text to Voice (Speech Synthesis) ---
ttsBtn.onclick = () => {
  const text = chatInput.value || 'Hello, how can I help you?';
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.speak(utter);
};
