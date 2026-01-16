# --- AI-powered web search endpoint ---

from fastapi import Body
import requests
from dotenv import load_dotenv

# --- API KEY SETUP ---
# 1. Copy .env.example to .env and fill in your keys
# 2. Or set SERPAPI_KEY and OPENAI_KEY as environment variables
load_dotenv()
SERPAPI_KEY = os.getenv('SERPAPI_KEY')
OPENAI_KEY = os.getenv('OPENAI_KEY')
if not SERPAPI_KEY or not OPENAI_KEY:
    raise RuntimeError('Please set SERPAPI_KEY and OPENAI_KEY in a .env file or as environment variables.')

@app.post("/web-search")
async def web_search(query: str = Body(..., embed=True)):
    """
    Perform a factual web search and synthesize an answer using OpenAI.
    """
    # 1. Search the web using SerpAPI
    serp_url = f'https://serpapi.com/search.json?q={requests.utils.quote(query)}&api_key={SERPAPI_KEY}&num=5'
    serp_res = requests.get(serp_url)
    serp_data = serp_res.json()
    snippets = []
    sources = []
    if 'organic_results' in serp_data:
        for r in serp_data['organic_results'][:5]:
            if 'snippet' in r:
                snippets.append(r['snippet'])
            sources.append({
                'title': r.get('title', r.get('displayed_link', 'Source')),
                'url': r.get('link', r.get('url', '#'))
            })
    context = '\n'.join(snippets)
    # 2. Synthesize answer with OpenAI
    prompt = f"""
    Use the following web search context to answer the user's question factually and concisely. Cite facts only if present in the context. If not found, say 'No factual answer found.'
    
    Context:
    {context}
    
    Question: {query}
    Answer:
    """
    openai_res = requests.post(
        'https://api.openai.com/v1/completions',
        headers={"Authorization": f"Bearer {OPENAI_KEY}"},
        json={
            "model": "text-davinci-003",
            "prompt": prompt,
            "max_tokens": 128,
            "temperature": 0.2
        }
    )
    answer = openai_res.json().get('choices', [{}])[0].get('text', '').strip()
    return {"answer": answer, "sources": sources}
# smart_ai_backend.py
"""
FastAPI backend for Smart AI: processes requests, learns from input/output, supports voice and code generation.
Integrates with PAPI Central and can run standalone.
"""

from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Any, Dict, Optional
import uuid
import json
import os

app = FastAPI(title="Smart AI Backend")

# Persistent user memory (JSON file)
MEMORY_FILE = "smart_ai_user_memory.json"
def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_memory(memory):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, ensure_ascii=False, indent=2)


MEMORY = load_memory()

# Semantic search setup
from sentence_transformers import SentenceTransformer, util
import numpy as np
EMBED_MODEL = SentenceTransformer('all-MiniLM-L6-v2')

# Helper: get embedding for a string
def get_embedding(text):
    return EMBED_MODEL.encode(text, convert_to_numpy=True).tolist()

# On startup, ensure all memory entries have embeddings
for m in MEMORY:
    if 'embedding' not in m:
        m['embedding'] = get_embedding(m['input'])
save_memory(MEMORY)


import difflib

class AIRequest(BaseModel):
    user_id: Optional[str]
    input: str
    context: Optional[Dict[str, Any]] = None
    mode: Optional[str] = "text"  # text, voice, code, etc.

class MemoryUpdateRequest(BaseModel):
    memory_id: str
    output: Optional[str] = None
    suggestion: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    suggestion: str
    output: str
    memory_id: str
    mode: str


@app.post("/process", response_model=AIResponse)
async def process_request(req: AIRequest):
    # Search memory for similar input
    best_match = None
    best_score = 0.0
    for m in MEMORY:
        score = difflib.SequenceMatcher(None, req.input, m["input"]).ratio()
        if score > best_score and score > 0.6:  # threshold for similarity
            best_score = score
            best_match = m
    if best_match:
        suggestion = f"(Learned) {best_match['suggestion']}"
        output = f"(Learned) {best_match['output']}"
    else:
        suggestion = f"Suggestion for: {req.input[:40]}..."
        output = f"Processed: {req.input}"
    memory_id = str(uuid.uuid4())
    entry = {
        "id": memory_id,
        "user_id": req.user_id,
        "input": req.input,
        "output": output,
        "suggestion": suggestion,
        "context": req.context,
        "mode": req.mode,
        "embedding": get_embedding(req.input)
    }
    MEMORY.append(entry)
    save_memory(MEMORY)
    return AIResponse(suggestion=suggestion, output=output, memory_id=memory_id, mode=req.mode)


# Retrieve memory by ID
@app.get("/memory/{memory_id}")
async def get_memory(memory_id: str):
    for m in MEMORY:
        if m["id"] == memory_id:
            return m
    return JSONResponse(status_code=404, content={"error": "Not found"})


# List all memory (optionally filter by user_id)
# List all memory (optionally filter by user_id)

# List all memory (optionally filter by user_id)
@app.get("/memory")
async def list_memory(user_id: Optional[str] = None):
    if user_id:
        return [m for m in MEMORY if m.get("user_id") == user_id]
    return MEMORY

# Search memory by input text (fuzzy + semantic match)
@app.get("/memory/search")
async def search_memory(q: str, user_id: Optional[str] = None, semantic: bool = True):
    results = []
    if semantic:
        q_emb = get_embedding(q)
        scored = []
        for m in MEMORY:
            if user_id and m.get("user_id") != user_id:
                continue
            if 'embedding' in m:
                sim = float(util.cos_sim(np.array(q_emb), np.array(m['embedding'])))
                scored.append((sim, m))
        scored.sort(reverse=True, key=lambda x: x[0])
        results = [m for sim, m in scored if sim > 0.5][:10]
    else:
        for m in MEMORY:
            if user_id and m.get("user_id") != user_id:
                continue
            if q.lower() in m["input"].lower() or difflib.SequenceMatcher(None, q, m["input"]).ratio() > 0.6:
                results.append(m)
    return results

# Update memory entry by memory_id
@app.post("/memory/update")
async def update_memory(req: MemoryUpdateRequest):
    updated = False
    for m in MEMORY:
        if m["id"] == req.memory_id:
            if req.output is not None:
                m["output"] = req.output
            if req.suggestion is not None:
                m["suggestion"] = req.suggestion
            if req.context is not None:
                m["context"] = req.context
            updated = True
            break
    if updated:
        save_memory(MEMORY)
        return {"status": "updated"}
    return JSONResponse(status_code=404, content={"error": "Not found"})

# Placeholder for voice-to-text
@app.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    # TODO: Integrate with speech recognition
    return {"text": "[transcribed text]"}

# Placeholder for text-to-voice
@app.post("/text-to-voice")
async def text_to_voice(text: str):
    # TODO: Integrate with TTS engine
    return {"audio_url": "/static/fake_audio.mp3"}

# Placeholder for code generation
@app.post("/generate-code")
async def generate_code(prompt: str):
    # TODO: Integrate with code LLM
    return {"code": "# generated code for: " + prompt}


# Plugin/tool execution endpoint
import subprocess
import shlex

@app.post("/run-tool")
async def run_tool(tool: str, args: Optional[str] = None):
    """
    Run a whitelisted tool or script with optional arguments.
    Example: tool='echo', args='hello world'
    """
    # Whitelist allowed tools/scripts for security
    ALLOWED_TOOLS = {
        'echo': 'echo',
        'list': 'dir' if os.name == 'nt' else 'ls',
        # Add more tools/scripts as needed
    }
    if tool not in ALLOWED_TOOLS:
        return JSONResponse(status_code=403, content={"error": "Tool not allowed"})
    cmd = [ALLOWED_TOOLS[tool]]
    if args:
        cmd += shlex.split(args)
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}
