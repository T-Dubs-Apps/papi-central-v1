# Smart AI Integration – Architecture Diagram

```mermaid
graph TD
    subgraph PAPI Central
        A[Spaceship UI (index.html)]
        B[App Launcher]
        C[Smart AI App (HTML/JS)]
    end
    subgraph Standalone
        D[Smart AI Web App]
    end
    subgraph Backend
        E[FastAPI Server]
        F[Model/Provider Adapters]
        G[Router, Memory, Tools, Agent Orchestration]
        H[Voice-to-Text Module]
        I[Text-to-Voice Module]
    end
    
    A --> B
    B --> C
    C -- API Calls --> E
    D -- API Calls --> E
    E --> F
    E --> G
    G --> H
    G --> I
    F --> G
    
    C -.->|Integration| D
```

**Legend:**
- PAPI Central: Existing hub and app launcher
- Smart AI App: New module for PAPI Central (HTML/JS)
- Standalone: Independent web app version
- Backend: FastAPI server with adapters, memory, tools, and voice modules

**Data Flow:**
- Both PAPI Central and standalone app send requests to the FastAPI backend
- Backend handles processing, learning, and voice features
- Modular adapters allow easy extension to new models/providers
```
