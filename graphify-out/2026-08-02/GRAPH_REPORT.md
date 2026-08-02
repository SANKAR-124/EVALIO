# Graph Report - EVALIO  (2026-08-02)

## Corpus Check
- 48 files · ~33,912 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 341 nodes · 492 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8201eb95`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard.jsx
- evaluate.py
- Evalio — Feature Extension Playbook (Sankar + Coding Agent)
- Evalio — Backend Execution Playbook (Sankar + Coding Agent)
- main.py
- schemas.py
- dependencies
- package.json
- ai_engine.py
- .coerce_and_round_scores
- ProjectSession
- 2. Phase 1 — Architecture Lock (Hours 0–3)
- .oxlintrc.json
- React + Vite
- rules/graphify.md
- workflows/graphify.md
- AGENT_STATE.md

## God Nodes (most connected - your core abstractions)
1. `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` - 14 edges
2. `ProjectSession` - 13 edges
3. `evaluate_prompt()` - 13 edges
4. `Evalio — Feature Extension Playbook (Sankar + Coding Agent)` - 12 edges
5. `2. Phase 5 — Feature Extension: Registries, Schemas & Endpoints (Hours 18–20.5)` - 10 edges
6. `LLMServiceError` - 9 edges
7. `2. Phase 1 — Architecture Lock (Hours 0–3)` - 9 edges
8. `Scorecard` - 8 edges
9. `ScanResponse` - 8 edges
10. `Dashboard()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `evaluate_prompt()` --calls--> `get_utc_now()`  [EXTRACTED]
  backend/app/routes/evaluate.py → backend/app/models.py
- `_get_or_create_session()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/evaluate.py → backend/app/models.py
- `get_session_detail()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/session.py → backend/app/models.py
- `list_sessions()` --references--> `ProjectSession`  [EXTRACTED]
  backend/app/routes/session.py → backend/app/models.py
- `scan_prompt()` --calls--> `ScanResult`  [EXTRACTED]
  backend/app/routes/scan.py → backend/app/models.py

## Import Cycles
- None detected.

## Communities (22 total, 3 thin omitted)

### Community 0 - "Dashboard.jsx"
Cohesion: 0.08
Nodes (27): plugins, App(), ContextBar(), DEFAULT_AGENTS, DEFAULT_USE_CASES, normalizeOptions(), Navbar(), metricBars (+19 more)

### Community 1 - "evaluate.py"
Cohesion: 0.08
Nodes (37): get_workspace_id(), Dependency to extract and validate the workspace ID from the request headers.…, evaluate_prompt(), _get_or_create_session(), post, Retrieves an existing session by ID (ensuring it belongs to the active…, Evaluates and optimizes a user prompt. Step 1 — Session: Call the helper to get…, post (+29 more)

### Community 2 - "Evalio — Feature Extension Playbook (Sankar + Coding Agent)"
Cohesion: 0.05
Nodes (42): 0.1 Relationship to v2.0 Playbook — CRITICAL, 0.2 IMPORTANT — This document contains NO pre-written code, 0.3 Graphify Model-Switch Protocol (READ THIS FIRST, AGENT), 0.4 Git Strategy — Updated for Solo Backend Ownership, 0.5 Project Vision Recap — Updated, 0.6 Team Hand-off Map — Updated, 0. How To Read This Document, 10. References (+34 more)

### Community 3 - "Evalio — Backend Execution Playbook (Sankar + Coding Agent)"
Cohesion: 0.04
Nodes (46): 0.1 IMPORTANT — This document contains NO pre-written code, 0.2 Graphify Model-Switch Protocol (READ THIS FIRST, AGENT), 0.3 Git Strategy — Zero-Conflict Branching, 0.4 Project Vision Recap (so the agent never loses context), 0.5 Team Hand-off Map, 0. How To Read This Document, 10. Risk Register & Contingencies, 11. Post-Hackathon Hardening (NOT for SYNC 2026 — for your README) (+38 more)

### Community 4 - "main.py"
Cohesion: 0.07
Nodes (30): AsyncIOMotorClient, Central configuration loaded from .env file for the Evalio application., Settings, get_db_client(), init_db(), Async context manager yielding a Motor client, ensuring it is closed in a…, Initializes the MongoDB connection and Beanie ODM. Returns the Motor async…, generic_exception_handler() (+22 more)

### Community 5 - "schemas.py"
Cohesion: 0.17
Nodes (18): get_session_detail(), list_sessions(), get, Retrieves all chat sessions for the active workspace, sorted by updated_at…, Retrieves the full details of a specific chat session, including messages.…, AgentInfo, ChatMessage, ErrorDetail (+10 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): axios, @codemirror/lang-markdown, @codemirror/theme-one-dark, framer-motion, dependencies, axios, @codemirror/lang-markdown, @codemirror/theme-one-dark (+13 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (20): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+12 more)

### Community 8 - "ai_engine.py"
Cohesion: 0.38
Nodes (9): _call_llm(), generate_optimized_prompt(), generate_scorecard(), _parse_json_response(), Any, Call the primary GLM provider and fail over to Groq if needed. The caller…, Generate a rewritten, optimized version of the input prompt., run_jailbreak_scan() (+1 more)

### Community 9 - ".coerce_and_round_scores"
Cohesion: 0.50
Nodes (3): Any, Coerces and rounds any float scores returned by the LLM to integers before…, field_validator

### Community 10 - "ProjectSession"
Cohesion: 0.18
Nodes (13): get_utc_now(), ProjectSession, datetime, A chat session scoped to a workspace_id (cheat-code auth)., Persisted vulnerability scan results, kept for demo auditability., Returns the current timezone-aware UTC datetime., ScanResult, Settings (+5 more)

### Community 11 - "2. Phase 1 — Architecture Lock (Hours 0–3)"
Cohesion: 0.22
Nodes (9): 2.1 `[AGENT]` Build `app/core/config.py`, 2.2 `[AGENT]` Build `app/models.py` — Beanie Documents, 2.3 `[AGENT]` Build `app/schemas.py` — Pydantic v2 contracts, 2.4 `[AGENT]` Build `app/database.py` — Beanie init, 2.5 `[AGENT]` Build `app/dependencies.py` — header extraction, 2.6 `[AGENT]` Build `app/main.py` — minimal bootable server, 2.7 `[SANKAR]` Run the smoke test, 2.8 `[HAND-OFF]` Phase 1 artifacts to distribute (+1 more)

### Community 12 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 13 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **122 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` connect `Evalio — Backend Execution Playbook (Sankar + Coding Agent)` to `2. Phase 1 — Architecture Lock (Hours 0–3)`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `ProjectSession` connect `ProjectSession` to `evaluate.py`, `main.py`, `schemas.py`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Scorecard` connect `evaluate.py` to `ai_engine.py`, `.coerce_and_round_scores`, `schemas.py`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07632850241545894 - nodes in this community are weakly interconnected._
- **Should `evaluate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._
- **Should `Evalio — Feature Extension Playbook (Sankar + Coding Agent)` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._