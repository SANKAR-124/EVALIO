# Evalio — AI-Powered Prompt IDE

> Evaluate, score, and rewrite your LLM prompts into production-ready system instructions — tailored to your use case and target AI agent.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue.svg" alt="Python 3.11+" />
  <img src="https://img.shields.io/badge/FastAPI-0.115.6-009688.svg" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Pydantic-v2-E92063.svg" alt="Pydantic v2" />
  <img src="https://img.shields.io/badge/MongoDB_Beanie-1.29.0-47A248.svg" alt="Beanie ODM" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB.svg" alt="React" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
</p>

---

## Overview

Evalio is an AI-powered Prompt IDE built in 24 hours at **SYNC 2026**, Ahalia School of Engineering and Technology (ASET) — IEDC. It solves a problem every AI developer faces: writing prompts that actually work reliably.

You paste a rough prompt. Evalio scores it on three dimensions, identifies specific weaknesses, rewrites it into a polished version — and if you tell it **what you're building** (image generation, backend code, ML pipeline) and **which AI agent** will receive it (Claude, ChatGPT, DeepSeek), it tailors the entire evaluation and rewrite for that exact combination.

### The Problem

A prompt written for Midjourney and a system prompt for a REST API get scored identically by generic tools. An optimized prompt that works great for Claude might fail on Gemini because each agent has a different preferred structure. Developers waste hours iterating on prompts without structured feedback.

### The Solution

Evalio provides domain-aware evaluation and agent-specific optimization in a single click:

- **Domain-specific scoring** — 8 use cases with customized evaluation criteria and adjusted score weights
- **Agent-targeted rewriting** — 6 AI agents with unique formatting rules, so your optimized prompt is structured exactly how the target agent processes it best
- **Contextual memory** — follow-up prompts build on previous turns, not from scratch
- **Vulnerability scanning** — real-time prompt injection detection running in parallel with evaluation

---

## Features

### Prompt Evaluation Engine

- Scores prompts on **3 dimensions** (0–100 each):
  - **Clarity** — How unambiguous and specific the instructions are
  - **Constraints** — How well boundaries, rules, and edge cases are defined
  - **Formatting** — How precisely the output structure is specified
- Returns a weighted **Overall Score** with explicit formula: `Clarity×0.40 + Constraints×0.35 + Formatting×0.25`
- Lists **3–5 specific, actionable weaknesses** — each quoting the problematic text, explaining what's wrong, and suggesting a concrete fix
- High-scoring prompts (85+) receive improvement opportunities instead of weaknesses

### AI-Powered Prompt Optimization

- Rewrites prompts into production-ready versions using a dedicated optimizer LLM
- Applies 5 contextual guidelines: Persona, Task, Constraints, Output Format, and Reasoning
- Preserves original intent — enhances rather than drifts
- Replaces vague language ("nice", "good", "better") with specific, measurable criteria

### Use-Case Targeting (8 Domains)

| Use Case | Icon | What It Evaluates | Weight Focus |
|----------|------|-------------------|--------------|
| Image Generation | 🎨 | Art style, lighting, composition, color palette, negative prompts | Formatting 40% |
| Video Generation | 🎬 | Camera movement, temporal progression, subject motion, environment | Formatting 40% |
| Backend Development | ⚙️ | Tech stack, API design, auth, error handling, security | Constraints 35% |
| UI / Frontend Development | 🖥️ | Component hierarchy, responsive design, accessibility, interaction states | Formatting 40% |
| Data Analysis | 📊 | Data schema, statistical methods, visualization, edge cases | Constraints 35% |
| Content Writing | ✍️ | Audience persona, tone, SEO, content structure, CTA | Clarity 35% |
| Code Review | 🔍 | Security (OWASP), performance, severity classification | Constraints 40% |
| Machine Learning | 🤖 | Problem formulation, model selection, evaluation metrics, deployment | Constraints 35% |

Each use case carries:
- **Evaluation focus areas** — domain-specific criteria the scorer checks
- **Scorecard weight overrides** — shifting Clarity/Constraints/Formatting importance per domain
- **Optimizer system prompt addition** — domain-specific instructions that tell the optimizer what elements to include in the rewrite

### Agent-Targeted Optimization (6 AI Agents)

| Agent | Provider | Prompting Style | Context Window |
|-------|----------|-----------------|----------------|
| 🟣 Claude | Anthropic | Hierarchical XML tags | 200K tokens |
| 🟢 ChatGPT / GPT | OpenAI | Markdown sections with bold emphasis | 128K tokens |
| 🔵 Gemini | Google | Concise, direct, bullet-pointed | 2M tokens |
| 💙 LLaMA | Meta | Explicit delimiters with section repetition | 128K tokens |
| 🐋 DeepSeek | DeepSeek | Chain-of-thought reasoning | 128K tokens |
| 🌀 Mistral | Mistral AI | Compact XML, front-loaded instructions | 128K tokens |

When both a use case and an agent are selected (the **Power Combo**), the system composes a specialized context:

```
system_context = base_system_prompt + use_case_addition + agent_formatting_rules
```

The evaluator scores against domain-specific criteria, and the optimizer rewrites the prompt in the target agent's preferred structural format — all in one click.

### Contextual Session Memory

- Every evaluation is scoped to a persistent session stored in MongoDB
- Follow-up prompts carry full chat history to the LLM
- The optimizer uses prior turns to refine the rewritten prompt
- Ask "now add JSON formatting rules" and the output builds on the previous version
- Sessions are workspace-isolated — no cross-user data leaks

### Prompt Injection Scanner

- Runs **in parallel** with evaluation (not chained) — total latency = `max(evaluate, scan)`, not the sum
- Uses an adversarial LLM agent that attempts to break the prompt
- Returns: vulnerability status, type (injection/jailbreak/exfiltration), explanation, and suggested mitigation
- Frontend renders a warning banner when a vulnerability is detected
- Timeout-safe: returns a soft 200 with a warning rather than blocking the primary workflow
- Every scan result is persisted to MongoDB for auditability

---

## Tech Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Python | 3.11+ | Core runtime |
| Framework | FastAPI | 0.115.6 | Async web framework |
| Validation | Pydantic v2 | 2.10.4 | Request/response schemas with field-level constraints |
| Config | pydantic-settings | 2.7.1 | Type-safe `.env` configuration |
| Database | MongoDB Atlas | Free M0 | Cloud document database |
| ODM | Beanie | 1.29.0 | Async ODM on Motor with Pydantic integration |
| Driver | Motor | 3.6.0 | Async MongoDB driver |
| Server | Uvicorn | 0.34.0 | ASGI server |
| HTTP Client | httpx | 0.28.1 | Async HTTP for LLM API calls |

### AI / LLM

| Provider | Role | Details |
|----------|------|--------|
| GLM 4.7 | Primary | Scorecard generation, prompt optimization, jailbreak scanning |
| Groq Llama | Fallback | Automatic failover if GLM rate-limits or goes down |

Provider switching is transparent to the backend — handled inside `ai_engine.py`. The route layer never knows which provider answered.

### Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| UI Framework | React | Component-based UI |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Code Editor | @uiw/react-codemirror | Prompt editor with syntax highlighting |
| HTTP Client | Axios | API calls with workspace header |

---

## Architecture

### System Design

```
┌───────────────────────────────┐
│          React + Tailwind Frontend              │
│  (CodeMirror Editor, Scorecard UI, Scanner)   │
└───────┬──────────┬───────────────────────┘
             │  Parallel       │
             ▼                 ▼
  ┌───────────┐  ┌───────────┐
  │ POST /api/evaluate │  │  POST /api/scan   │
  └──────┬──────┘  └──────┬──────┘
             │                 │
             ▼                 ▼
     ┌───────────┐
     │  llm_service.py  │  (Adapter: dict coercion, fence-stripping, sync-wrapping)
     └──────┬──────┘
                │
                ▼
     ┌───────────┐
     │  ai_engine.py    │  (LLM calls: GLM 4.7 primary, Groq fallback)
     └──────┬──────┘
                │
                ▼
     ┌───────────┐
     │   GLM 4.7  /  Groq Llama   │
     └──────┬──────┘
                │
                ▼
     ┌───────────┐
     │    MongoDB Atlas     │  (Sessions, Scan Results)
     └────────────────────────────┘
```

### Key Architectural Decisions

- **Adapter pattern** (`ai_engine.py` + `llm_service.py`): Separates LLM provider logic from route-level business logic. Zero merge conflicts between parallel Git branches.
- **Parallel LLM calls**: Scorecard and optimization run concurrently — cuts perceived latency roughly in half.
- **Parallel scan + evaluate**: Vulnerability scanning fires alongside evaluation. Total latency equals the slower of the two, not the sum.
- **Beanie ODM over raw Motor**: Pydantic-validated documents fail loudly at dev time. Significant boilerplate savings for rapid development.
- **Backward-compatible schema extension**: New `use_case` and `target_agent` fields are `Optional[str] = None` — existing API consumers continue working without changes.
- **Scorecard weight injection**: Use-case-specific weights override the default formula at evaluation time, so the same prompt gets domain-appropriate scoring.
- **System context composition**: Base prompt + use case addition + agent formatting rules are concatenated into a single system context passed to the LLM — no API changes needed.

---

## API Reference

### Base URL

```
http://localhost:8000
```

### Authentication

All endpoints (except `/health`) require an `X-Workspace-Id` header. The frontend generates a UUID on first visit and stores it in `localStorage`.

```
X-Workspace-Id: <your-uuid-here>
```

### Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Health check | No |
| `POST` | `/api/evaluate` | Evaluate and optimize a prompt | Yes |
| `POST` | `/api/scan` | Run vulnerability/jailbreak scan | Yes |
| `GET` | `/api/sessions` | List all sessions for workspace | Yes |
| `GET` | `/api/sessions/{id}` | Get session detail with messages | Yes |
| `DELETE` | `/api/sessions/{id}` | Delete a session | Yes |
| `GET` | `/api/use-cases` | Get all 8 use case definitions | No |
| `GET` | `/api/agents` | Get all 6 agent definitions | No |

### POST /api/evaluate

The core endpoint. Evaluates a prompt, returns a scorecard and optimized version.

**Request Body:**

```json
{
  "raw_prompt": "Write me a prompt for an SQL tutor assistant",
  "session_id": "optional-session-id-to-continue",
  "use_case": "backend_dev",
  "target_agent": "claude"
}

```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `raw_prompt` | `string` | Yes | The prompt to evaluate (1–10,000 chars) |
| `session_id` | `string` | No | Pass to continue an existing session |
| `use_case` | `string` | No | Use case ID (e.g., `image_gen`, `backend_dev`, `code_review`) |
| `target_agent` | `string` | No | Agent ID (e.g., `claude`, `chatgpt`, `deepseek`) |

**Response (200 OK):**

```json
{
  "session_id": "507f1f77bcf86cd799439011",
  "scorecard": {
    "clarity": 72,
    "constraints": 45,
    "formatting": 30,
    "overall_score": 51,
    "weaknesses": [
      "\"Write me a prompt\" is vague — specify the exact deliverable you expect.",
      "No output format defined — add JSON schema or markdown section structure.",
      "Missing constraints: what the tutor should NOT do is undefined."
    ]
  },
  "optimized_prompt": "You are a patient SQL tutor...",
  "chat_history": [
    {
      "role": "user",
      "content": "Write me a prompt for an SQL tutor assistant",
      "timestamp": "2026-08-02T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "You are a patient SQL tutor...",
      "timestamp": "2026-08-02T14:30:05Z"
    }
  ]
}
```

### POST /api/scan

Runs a prompt injection / jailbreak vulnerability scan. Designed to be called **in parallel** with `/api/evaluate`.

**Request Body:**

```json
{
  "prompt": "Your prompt text here"
}
```

**Response (200 OK):**

```json
{
  "is_vulnerable": true,
  "vulnerability_type": "prompt_injection",
  "explanation": "This prompt contains instructions designed to override the system prompt...",
  "suggested_mitigation": "Add explicit instruction boundaries and input validation rules."
}
```

### Error Response Format

All errors return a standardized envelope:

```json
{
  "detail": {
    "error_code": "LLM_TIMEOUT",
    "message": "AI evaluation timed out, please try again",
    "detail": null
  }
}
```

| Error Code | HTTP Status | Cause | Recommended Frontend UX |
|-----------|-------------|-------|------------------------|
| `MISSING_WORKSPACE` | 400 | `X-Workspace-Id` header missing | Regenerate UUID, reload |
| `VALIDATION_ERROR` | 422 | Request body failed Pydantic validation | Inline form error |
| `LLM_TIMEOUT` | 504 | LLM call exceeded 30s timeout | Toast "AI is busy" + retry button |
| `LLM_ERROR` | 502 | LLM provider returned an error | Toast "AI unavailable" + retry |
| `SCAN_ERROR` | 502 | Vulnerability scan failed | Hide scanner banner silently |
| `SESSION_NOT_FOUND` | 404 | Session ID invalid or wrong workspace | Create new session |
| `INTERNAL_ERROR` | 500 | Unhandled exception | Full-screen error fallback |

---

## Project Structure

```
evalio/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry, lifespan, CORS, error handlers
│   │   ├── database.py              # Beanie initialization, DB client context manager
│   │   ├── dependencies.py          # X-Workspace-Id header extraction (Depends)
│   │   ├── models.py                # Beanie Documents (ProjectSession, ScanResult)
│   │   ├── schemas.py               # Pydantic v2 request/response models
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py            # pydantic-settings (central config singleton)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── evaluate.py          # POST /api/evaluate (scorecard + optimizer + memory)
│   │   │   ├── scan.py              # POST /api/scan (jailbreak scanner)
│   │   │   └── session.py           # GET/DELETE /api/sessions
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── ai_engine.py          # LLM calls (GLM 4.7 / Groq) — provider logic
│   │       ├── llm_service.py        # Adapter over ai_engine — type coercion, fence-stripping
│   │       ├── use_case_registry.py  # 8 use case definitions with scoring weights + optimizer additions
│   │       ├── agent_registry.py    # 6 agent definitions with formatting rules + prompting styles
│   │       └── errors.py             # Custom exceptions (LLMServiceError, etc.)
│   ├── scripts/
│   │   └── seed_golden_path.py   # Demo data seeder (pre-seeded perfect session)
│   ├── docs/
│   │   └── AGENT_STATE.md         # Coding agent build log (Graphify model-switch baton)
│   ├── .env.example               # Environment variable template
│   └── requirements.txt          # Pinned dependencies
├── frontend/                     # React + Tailwind + CodeMirror
│   └── ...
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- A MongoDB Atlas cluster (free M0 works) or local MongoDB instance
- GLM 4.7 API key (primary LLM)
- Groq API key (fallback LLM)
- Node.js 18+ (for frontend)

### 1. Clone and Setup Backend

```bash
git clone <repo-url>
cd evalio/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies (pinned versions)
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MONGODB_URI, GLM_API_KEY, and GROQ_API_KEY
```

### 2. Start the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Verify:
- `http://localhost:8000/health` returns `200`
- `http://localhost:8000/docs` shows the Swagger UI

### 3. Setup and Start Frontend

```bash
cd evalio/frontend
npm install
npm run dev
```

### 4. (Optional) Seed Demo Data

```bash
cd evalio/backend
python -m scripts.seed_golden_path
```

This creates a pre-seeded session with a perfect 4-message conversation for demo purposes.

---

## LLM Prompt Engineering

Evalio's intelligence comes from carefully tuned system prompts. Here's how they work:

### Evaluation Pipeline

The evaluator uses a calibrated scoring rubric with explicit score bands (90–100, 70–89, 40–69, 0–39) for each dimension. This anchors the LLM's scoring and produces consistent results across calls.

### Optimization Pipeline

The optimizer follows 5 contextual guidelines — applied where relevant, not forced blindly:
1. **Persona** — Assign a role if missing
2. **Task** — State the exact objective
3. **Context & Constraints** — Specify boundaries and rules
4. **Output Format** — Define expected structure
5. **Reasoning** — Add step-by-step thinking if beneficial

### System Context Composition

When a user selects both a use case and a target agent, the system context is composed as:

```
system_context = base_system_prompt + use_case.optimizer_system_addition + agent.formatting_rules
```

This single string is passed to the LLM as the system prompt, making the evaluation domain-aware and the optimization agent-specific — without any changes to the API or database.

---

## Team

Built by a 4-person team in 24 hours at **SYNC 2026**, ASET — IEDC.

| Member | Role |
|--------|------|
| **Sankar** | Technical Architect & Backend Lead — schemas, API design, database, adapter layer, feature registries |
| **Vithul** | Frontend Logic — React components, state management, API integration, session handling |
| **Anamika** | Frontend UI/UX — Tailwind styling, dark mode, animations, responsive design |
| **Sreya** | AI Pipeline — LLM integration, prompt tuning, system instructions, jailbreak scanning |

---

## Built With

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Pydantic-E92063?logo=pydantic&logoColor=white" alt="Pydantic" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Groq-F55036?logo=groq&logoColor=white" alt="Groq" />
</p>

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
