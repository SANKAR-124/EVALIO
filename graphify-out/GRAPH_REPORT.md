# Graph Report - EVALIO  (2026-08-02)

## Corpus Check
- 53 files · ~36,077 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 362 nodes · 515 edges · 25 communities (22 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b150196a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard.jsx
- llm_service.py
- Evalio — Feature Extension Playbook (Sankar + Coding Agent)
- Evalio — Backend Execution Playbook (Sankar + Coding Agent)
- ProjectSession
- evaluate.py
- dependencies
- package.json
- ai_engine.py
- 3. Phase 2 — Core Engineering (Hours 3–8)
- 1. Prerequisites & Downloads (Pre-Hackathon — Tonight)
- main.py
- Landing.jsx
- React + Vite
- rules/graphify.md
- workflows/graphify.md
- AGENT_STATE.md

## God Nodes (most connected - your core abstractions)
1. `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` - 14 edges
2. `ProjectSession` - 13 edges
3. `evaluate_prompt()` - 13 edges
4. `Evalio — Feature Extension Playbook (Sankar + Coding Agent)` - 12 edges
5. `react` - 10 edges
6. `2. Phase 5 — Feature Extension: Registries, Schemas & Endpoints (Hours 18–20.5)` - 10 edges
7. `LLMServiceError` - 9 edges
8. `2. Phase 1 — Architecture Lock (Hours 0–3)` - 9 edges
9. `Scorecard` - 8 edges
10. `ScanResponse` - 8 edges

## Surprising Connections (you probably didn't know these)
- `_get_or_create_session()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/evaluate.py → backend/app/models.py
- `get_session_detail()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/session.py → backend/app/models.py
- `list_sessions()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/session.py → backend/app/models.py
- `scan_prompt()` --calls--> `ScanResult`  [EXTRACTED]
  backend/app/routes/scan.py → backend/app/models.py
- `evaluate_prompt()` --calls--> `execute_prompt()`  [EXTRACTED]
  backend/app/routes/evaluate.py → backend/app/services/llm_service.py

## Import Cycles
- None detected.

## Communities (25 total, 3 thin omitted)

### Community 0 - "Dashboard.jsx"
Cohesion: 0.09
Nodes (22): ContextBar(), DEFAULT_AGENTS, DEFAULT_USE_CASES, normalizeOptions(), Navbar(), metricBars, OutputPanel(), TABS (+14 more)

### Community 1 - "llm_service.py"
Cohesion: 0.12
Nodes (24): post, Runs the adversarial jailbreak agent against the prompt. Designed for parallel…, scan_prompt(), ScanRequest, ScanResponse, DatabaseError, LLMServiceError, Exception (+16 more)

### Community 2 - "Evalio — Feature Extension Playbook (Sankar + Coding Agent)"
Cohesion: 0.05
Nodes (42): 0.1 Relationship to v2.0 Playbook — CRITICAL, 0.2 IMPORTANT — This document contains NO pre-written code, 0.3 Graphify Model-Switch Protocol (READ THIS FIRST, AGENT), 0.4 Git Strategy — Updated for Solo Backend Ownership, 0.5 Project Vision Recap — Updated, 0.6 Team Hand-off Map — Updated, 0. How To Read This Document, 10. References (+34 more)

### Community 3 - "Evalio — Backend Execution Playbook (Sankar + Coding Agent)"
Cohesion: 0.05
Nodes (39): 0.1 IMPORTANT — This document contains NO pre-written code, 0.2 Graphify Model-Switch Protocol (READ THIS FIRST, AGENT), 0.3 Git Strategy — Zero-Conflict Branching, 0.4 Project Vision Recap (so the agent never loses context), 0.5 Team Hand-off Map, 0. How To Read This Document, 10. Risk Register & Contingencies, 11. Post-Hackathon Hardening (NOT for SYNC 2026 — for your README) (+31 more)

### Community 4 - "ProjectSession"
Cohesion: 0.14
Nodes (16): AsyncIOMotorClient, Central configuration loaded from .env file for the Evalio application., Settings, get_db_client(), Async context manager yielding a Motor client, ensuring it is closed in a…, ProjectSession, A chat session scoped to a workspace_id (cheat-code auth)., Persisted vulnerability scan results, kept for demo auditability. (+8 more)

### Community 5 - "evaluate.py"
Cohesion: 0.09
Nodes (33): get_workspace_id(), Dependency to extract and validate the workspace ID from the request headers.…, get_utc_now(), datetime, Returns the current timezone-aware UTC datetime., evaluate_prompt(), _get_or_create_session(), post (+25 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): axios, @codemirror/lang-markdown, @codemirror/theme-one-dark, framer-motion, dependencies, axios, @codemirror/lang-markdown, @codemirror/theme-one-dark (+13 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (20): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+12 more)

### Community 8 - "ai_engine.py"
Cohesion: 0.23
Nodes (13): Any, Coerces and rounds any float scores returned by the LLM to integers before…, Scorecard, _call_llm(), generate_optimized_prompt(), generate_scorecard(), _parse_json_response(), Any (+5 more)

### Community 9 - "3. Phase 2 — Core Engineering (Hours 3–8)"
Cohesion: 0.25
Nodes (8): 3.1 `[AGENT]` Build `app/services/ai_engine.py` — Sreya's file (mock version only), 3.2 `[AGENT]` Build `app/services/llm_service.py` — the adapter (Sankar's file), 3.3 `[AGENT]` Build `app/services/errors.py` — typed exceptions, 3.4 `[AGENT]` Build `app/routes/evaluate.py` — the core endpoint, 3.5 `[AGENT]` Build placeholder `app/routes/scan.py` and `app/routes/session.py`, 3.6 `[SANKAR]` Boot and test `/api/evaluate` end-to-end, 3.7 `[HAND-OFF]` Phase 2 artifacts, 3. Phase 2 — Core Engineering (Hours 3–8)

### Community 10 - "1. Prerequisites & Downloads (Pre-Hackathon — Tonight)"
Cohesion: 0.25
Nodes (8): 1.1 `[SANKAR]` Install local toolchain, 1.2 `[SANKAR]` Create the MongoDB Atlas cluster, 1.3 `[SANKAR]` Coordinate API keys with Sreya, 1.4 `[SANKAR]` Create the repo and scaffold the monorepo, 1.5 `[AGENT]` Create `backend/requirements.txt`, 1.6 `[AGENT]` Create `backend/.env.example` and root `.gitignore`, 1.7 `[SANKAR]` Verify the scaffold boots, 1. Prerequisites & Downloads (Pre-Hackathon — Tonight)

### Community 11 - "main.py"
Cohesion: 0.09
Nodes (24): init_db(), Initializes the MongoDB connection and Beanie ODM. Returns the Motor async…, generic_exception_handler(), health_check(), lifespan(), Exception, get, Globally catches Pydantic validation errors and converts them to our standard… (+16 more)

### Community 12 - "Landing.jsx"
Cohesion: 0.09
Nodes (20): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, App(), scoreConfig, colors (+12 more)

### Community 13 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **130 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` connect `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` to `3. Phase 2 — Core Engineering (Hours 3–8)`, `1. Prerequisites & Downloads (Pre-Hackathon — Tonight)`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `react` connect `Landing.jsx` to `Dashboard.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `ProjectSession` connect `ProjectSession` to `evaluate.py`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09103840682788052 - nodes in this community are weakly interconnected._
- **Should `llm_service.py` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._
- **Should `Evalio — Feature Extension Playbook (Sankar + Coding Agent)` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._