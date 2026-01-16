# Standalone Smart AI App

To run the Smart AI app independently:

## Backend
- Start the FastAPI backend:
  ```sh
  uvicorn smart_ai_backend:app --reload --port 8001
  ```
- The API will be available at http://localhost:8001

## Frontend
- Open smart-ai-app.html or smart-ai-app-builder.html in your browser
- If serving from a static server, ensure API requests are proxied to the backend (adjust apiBase in JS if needed)

## Features
- Request processing, learning, voice-to-text, text-to-voice, code generation
- App builder UI for generating code/apps

## Integration
- Can be launched from PAPI Central or as a standalone web app
