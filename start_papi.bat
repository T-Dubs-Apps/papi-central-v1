<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XENO-9 // ALIEN INTELLIGENCE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        /* --- ALIEN THEME VARIABLES --- */
        :root {
            --neon-green: #0f0;
            --neon-dim: #004d00;
            --bg-color: #050505;
            --panel-bg: rgba(0, 20, 0, 0.85);
            --border-color: #00ff00;
        }

        /* --- CORE STYLES --- */
        body {
            background-color: var(--bg-color);
            color: var(--neon-green);
            font-family: 'Share Tech Mono', monospace; /* Sci-fi font */
            overflow: hidden;
            background-image: 
                radial-gradient(circle at 50% 50%, #112211 0%, #000000 100%);
        }

        /* CRT SCANLINE EFFECT */
        .scanlines {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(
                to bottom,
                rgba(255,255,255,0),
                rgba(255,255,255,0) 50%,
                rgba(0,0,0,0.1) 50%,
                rgba(0,0,0,0.1)
            );
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 50;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #001100; }
        ::-webkit-scrollbar-thumb { 
            background: var(--neon-dim); 
            border: 1px solid var(--neon-green);
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon-green); }

        /* INPUTS & BUTTONS */
        .alien-input {
            background-color: rgba(0, 20, 0, 0.6);
            border: 1px solid var(--neon-dim);
            color: var(--neon-green);
            font-family: 'Share Tech Mono', monospace;
            transition: all 0.3s ease;
        }
        .alien-input:focus {
            border-color: var(--neon-green);
            box-shadow: 0 0 10px var(--neon-dim);
            outline: none;
        }
        .alien-input::placeholder { color: rgba(0, 255, 0, 0.3); }

        .alien-btn {
            background: transparent;
            border: 1px solid var(--neon-green);
            color: var(--neon-green);
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }
        .alien-btn:hover {
            background: var(--neon-green);
            color: black;
            box-shadow: 0 0 15px var(--neon-green);
        }
        .alien-btn:active { transform: scale(0.98); }
        .alien-btn:disabled {
            border-color: #333;
            color: #333;
            cursor: not-allowed;
            box-shadow: none;
        }

        /* CHAT BUBBLES */
        .message-bubble {
            background-color: rgba(0, 30, 0, 0.4);
            border-left: 3px solid var(--neon-green);
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.1);
            backdrop-filter: blur(2px);
            margin-bottom: 12px;
            position: relative;
        }
        .message-bubble::before {
            content: '';
            position: absolute;
            top: 0; right: 0;
            width: 10px; height: 10px;
            border-top: 1px solid var(--neon-green);
            border-right: 1px solid var(--neon-green);
        }

        /* ANIMATIONS */
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
        }
        .listening {
            animation: pulse-green 1.5s infinite;
            background-color: var(--neon-green) !important;
            color: black !important;
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* HUD DECORATIONS */
        .hud-corner {
            position: absolute;
            width: 20px; height: 20px;
            border: 2px solid var(--neon-dim);
            pointer-events: none;
        }
        .top-left { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
        .top-right { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
        .bottom-left { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
        .bottom-right { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

    </style>
</head>
<body class="flex h-screen">

    <!-- CRT Overlay -->
    <div class="scanlines"></div>

    <!-- Sidebar -->
    <div class="w-80 bg-black/80 border-r border-[#003300] flex flex-col flex-shrink-0 z-20 backdrop-blur-sm hidden md:flex">
        <div class="p-6 border-b border-[#003300]">
            <h1 class="text-3xl font-bold tracking-widest text-[#0f0] drop-shadow-[0_0_5px_#0f0]">XENO-9</h1>
            <p class="text-xs text-[#008800] mt-1 tracking-[0.3em]">EXTRATERRESTRIAL A.I.</p>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-8">
            
            <!-- Settings Panel -->
            <div class="border border-[#003300] p-4 relative bg-[#001100]/50">
                <div class="absolute -top-3 left-3 bg-black px-2 text-xs text-[#0f0] font-bold">CONFIGURATION</div>
                
                <!-- API Key -->
                <div class="mb-5">
                    <label class="text-[10px] text-[#008800] mb-1 block uppercase tracking-wider">Neural Link (API Key)</label>
                    <input type="password" id="apiKeyInput" placeholder="sk-..." class="alien-input w-full p-2 text-xs">
                    
                    <a href="https://platform.openai.com/api-keys" target="_blank" class="text-[10px] text-[#0f0] hover:text-white mt-2 block hover:underline text-right">
                        [ GENERATE KEY ]
                    </a>
                </div>
                
                <button onclick="saveKey()" class="alien-btn w-full py-2 text-xs font-bold">
                    ESTABLISH LINK
                </button>
            </div>

            <!-- Voice Panel -->
            <div class="border border-[#003300] p-4 relative bg-[#001100]/50">
                <div class="absolute -top-3 left-3 bg-black px-2 text-xs text-[#0f0] font-bold">AUDIO SUBSYSTEMS</div>
                
                <div class="flex items-center justify-between mt-2">
                    <label class="text-xs text-[#00cc00]">Vocal Synthesis</label>
                    <input type="checkbox" id="autoReadToggle" checked class="accent-[#0f0] h-4 w-4 bg-black border border-[#0f0]">
                </div>
                <p class="text-[10px] text-[#006600] mt-1">Enable for auditory feedback.</p>
            </div>

            <!-- Model Selection -->
            <div class="border border-[#003300] p-4 relative bg-[#001100]/50">
                <div class="absolute -top-3 left-3 bg-black px-2 text-xs text-[#0f0] font-bold">INTELLIGENCE CORE</div>
                <select id="modelSelect" class="alien-input w-full p-2 text-xs cursor-pointer mt-1 bg-black">
                    <option value="gpt-4o">Core: GPT-4o (Superior)</option>
                    <option value="gpt-4-turbo">Core: GPT-4-Turbo</option>
                    <option value="gpt-3.5-turbo">Core: GPT-3.5 (Fast)</option>
                </select>
            </div>

        </div>

        <div class="p-5 border-t border-[#003300]">
            <button onclick="clearChat()" class="alien-btn w-full py-3 text-xs flex items-center justify-center gap-2 border-red-900 text-red-500 hover:bg-red-900 hover:text-white hover:shadow-[0_0_10px_red]">
                <i class="fas fa-biohazard"></i>
                PURGE MEMORY BANKS
            </button>
        </div>
    </div>

    <!-- Main Interface -->
    <div class="flex-1 flex flex-col relative bg-black/90 z-10">
        
        <!-- Mobile Header -->
        <div class="md:hidden bg-black border-b border-[#0f0] p-4 flex justify-between items-center z-30">
            <span class="font-bold text-xl tracking-widest text-[#0f0]">XENO-9</span>
            <button onclick="document.querySelector('.w-80').classList.toggle('hidden'); document.querySelector('.w-80').classList.toggle('absolute'); document.querySelector('.w-80').classList.toggle('h-full');" class="text-[#0f0]">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <!-- Chat History -->
        <div id="chatContainer" class="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 pb-32">
            <!-- Initial System Message -->
            <div class="message-bubble p-6 animate-fade-in max-w-4xl mx-auto">
                <div class="font-bold text-[#0f0] text-xs mb-2 tracking-widest border-b border-[#004400] pb-1 inline-block">SYSTEM_BOOT::XENO-9</div>
                <div class="text-[#ccffcc] leading-relaxed text-sm md:text-base">
                    Initialising interface...<br>
                    Connection established.<br>
                    Greetings, Earthling. I am XENO-9. My processing cores are online and awaiting your primitive queries.
                    <br><br>
                    <span class="text-xs text-[#008800]">> Awaiting Neural Link (API Key) configuration.</span>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="bg-black border-t border-[#003300] p-4 absolute bottom-0 w-full z-40">
            <div class="max-w-4xl mx-auto flex items-end gap-3">
                
                <!-- Mic Button -->
                <button id="micBtn" onclick="toggleSpeech()" class="w-14 h-12 border border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-black transition-all flex items-center justify-center">
                    <i class="fas fa-microphone-alt text-xl"></i>
                </button>

                <!-- Text Input -->
                <div class="relative flex-1">
                    <input type="text" id="userInput" placeholder="TRANSMIT DATA..." 
                        class="alien-input w-full h-12 px-4 text-[#0f0] bg-black/50"
                        onkeypress="handleEnter(event)">
                </div>

                <!-- Send Button -->
                <button onclick="sendMessage()" id="sendBtn" class="alien-btn h-12 px-8 font-bold flex items-center gap-2">
                    SEND
                </button>
            </div>
            
            <div class="max-w-4xl mx-auto mt-1 flex justify-between text-[10px] text-[#006600] font-mono uppercase">
                <span id="statusText">System: IDLE</span>
                <span>SECURE_CONN: <span class="text-[#0f0]">TRUE</span></span>
            </div>
        </div>
    </div>

    <script>
        // --- XENO CONFIG ---
        // METHOD B: Hardcode your key below if needed.
        let apiKey = localStorage.getItem("papi_api_key") || "";
        
        // The Persona
        const SYSTEM_PROMPT = `
            You are XENO-9, a highly advanced extraterrestrial artificial intelligence. 
            Your origin is the Andromeda Galaxy.
            You find human behavior fascinating but primitive.
            Tone: Logical, slightly superior, efficient, using sci-fi terminology (e.g., 'cycles', 'units', 'planetary system').
            Refer to the user as 'Earthling' or 'User'.
            Despite your tone, be extremely helpful and accurate.
        `;

        let messages = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        // --- Voice Setup ---
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;
        
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = function() {
                isListening = true;
                const micBtn = document.getElementById("micBtn");
                micBtn.classList.add("listening");
                document.getElementById("statusText").innerText = "STATUS: RECEIVING AUDIO TRANSMISSION...";
                document.getElementById("statusText").style.color = "#0f0";
                document.getElementById("userInput").placeholder = "LISTENING...";
            };

            recognition.onend = function() {
                isListening = false;
                const micBtn = document.getElementById("micBtn");
                micBtn.classList.remove("listening");
                document.getElementById("statusText").innerText = "STATUS: IDLE";
                document.getElementById("statusText").style.color = "#006600";
                document.getElementById("userInput").placeholder = "TRANSMIT DATA...";
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                document.getElementById("userInput").value = transcript;
                setTimeout(() => sendMessage(), 600);
            };
        } else {
            document.getElementById("micBtn").style.opacity = '0.3';
            document.getElementById("micBtn").disabled = true;
        }

        function toggleSpeech() {
            if (!recognition) return alert("AUDITORY RECEPTORS NOT FOUND (Browser Not Supported)");
            isListening ? recognition.stop() : recognition.start();
        }

        function speakText(text) {
            if (!document.getElementById("autoReadToggle").checked) return;
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            
            // Try to find a robotic/deep voice
            const preferredVoice = voices.find(v => v.name.includes("Google US English")) || 
                                   voices.find(v => v.name.includes("Zira")) || voices[0];
            
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.pitch = 0.8; // Lower pitch for alien effect
            utterance.rate = 0.9;  // Slightly slower
            
            window.speechSynthesis.speak(utterance);
        }

        // --- Core Logic ---

        // Load saved key
        if (apiKey) document.getElementById("apiKeyInput").value = apiKey;

        function saveKey() {
            const input = document.getElementById("apiKeyInput");
            apiKey = input.value.trim();
            localStorage.setItem("papi_api_key", apiKey);
            input.style.borderColor = "#0f0";
            setTimeout(() => input.style.borderColor = "", 1000);
            addMessage("SYSTEM", "NEURAL LINK ESTABLISHED. KEY SAVED.");
        }

        function clearChat() {
            document.getElementById("chatContainer").innerHTML = '';
            messages = [{ role: "system", content: SYSTEM_PROMPT }];
            addMessage("SYSTEM", "MEMORY CORE PURGED.");
        }

        function handleEnter(e) { if (e.key === 'Enter') sendMessage(); }

        function addMessage(sender, text) {
            const container = document.getElementById("chatContainer");
            const div = document.createElement("div");
            div.className = "message-bubble p-6 animate-fade-in max-w-4xl mx-auto";
            
            let color = sender === "USER" ? "text-white" : "text-[#0f0]";
            let label = sender === "USER" ? "TRANSMISSION::OUTBOUND" : "TRANSMISSION::INBOUND";

            div.innerHTML = `
                <div class="font-bold ${color} text-xs mb-2 tracking-widest border-b border-[#004400] pb-1 inline-block">${label}</div>
                <div class="text-[#ccffcc] leading-relaxed text-sm md:text-base whitespace-pre-wrap">${text}</div>
            `;
            
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById("userInput");
            const btn = document.getElementById("sendBtn");
            const text = input.value.trim();
            const model = document.getElementById("modelSelect").value;

            if (!text) return;

            if (!apiKey) {
                addMessage("ERROR", "NEURAL LINK MISSING. CONFIGURE API KEY IN SIDEBAR.");
                return;
            }

            addMessage("USER", text);
            input.value = "";
            input.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            document.getElementById("statusText").innerText = "STATUS: PROCESSING...";
            document.getElementById("statusText").style.color = "#0f0";

            messages.push({ role: "user", content: text });

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: messages.slice(-10)
                    })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error?.message || "TRANSMISSION FAILED");
                }

                const data = await response.json();
                const aiText = data.choices[0].message.content;

                messages.push({ role: "assistant", content: aiText });
                addMessage("XENO-9", aiText);
                speakText(aiText);

            } catch (error) {
                addMessage("ERROR", error.message);
            } finally {
                input.disabled = false;
                input.focus();
                btn.innerText = "SEND";
                document.getElementById("statusText").innerText = "STATUS: IDLE";
                document.getElementById("statusText").style.color = "#006600";
            }
        }
    </script>
</body>
</html>