# Evalio Backend Agent State

[1.5] backend/requirements.txt — DONE — pinned dependencies initialized
[1.6] backend/.env.example, .gitignore — DONE — environment template and ignore rules created
[2.1] backend/app/core/config.py — DONE — Settings class created and validated
[2.2] backend/app/models.py — DONE — ProjectSession and ScanResult Beanie documents defined
[2.3] backend/app/schemas.py — DONE — all request, response, and error schemas defined (schema frozen after 2.8 — do not rename fields)
[2.4] backend/app/database.py — DONE — MongoDB connection and Beanie ODM setup completed and verified
[2.5] backend/app/dependencies.py — DONE — header extraction and validation dependency created and tested
[2.6] backend/app/main.py — DONE — server boots successfully (evaluate, scan, session router inclusions commented out)
[3.1] backend/app/services/ai_engine.py — DONE — mock implementations and Sreya instructions defined (HANDED TO SREYA AT 3.7 — SANKAR MUST NOT EDIT THIS FILE AGAIN)
[3.2] backend/app/services/llm_service.py — DONE — adapter created with dict coercion, fence stripping, and thread offloading support
[3.4] backend/app/routes/evaluate.py — DONE — /evaluate route with parallel LLM execution and contextual history persistence implemented
[3.5] backend/app/routes/scan.py, app/routes/session.py — DONE — placeholders created and included in main.py
[4.1] backend/app/services/ai_engine.py — DONE — Created _call_llm helper with GLM primary + Groq failover
[4.2] backend/app/services/ai_engine.py — DONE — Implemented generate_scorecard with JSON schema parsing and validation
[4.2] backend/app/routes/scan.py — DONE — scan endpoint implemented with custom timeout and audit log database persistence
[4.3] backend/app/services/ai_engine.py — DONE — Implemented generate_optimized_prompt with contextual history and markdown fence cleanup
[4.3] backend/app/routes/session.py — DONE — session list, get, and delete endpoints implemented with workspace isolation checks
[4.4] backend/app/services/ai_engine.py — DONE — Implemented run_jailbreak_scan with schema validation and JSON parsing
[4.4] backend/app/main.py — DONE — global exception handlers for RequestValidationError and generic Exception registered
[7.1] backend/app/services/use_case_registry.py — DONE — 8 use-case entries with evaluation focus, weight overrides, and optimizer additions; get_use_case and list_use_cases helpers defined
[7.2] backend/app/services/agent_registry.py — DONE — 6 agent entries with prompting styles, formatting rules, and strengths; get_agent and list_agents helpers defined
[7.3] backend/app/schemas.py — DONE — schemas.py extended — existing classes unchanged except EvaluateRequest gained two optional fields (use_case, target_agent); added UseCaseInfo and AgentInfo response models
[7.4] backend/app/routes/use_cases.py — DONE — GET /api/use-cases returns 8 use-case entries; registered in main.py
[7.5] backend/app/routes/agents.py — DONE — GET /api/agents returns 6 agent entries; registered in main.py
[7.6] backend/app/main.py — DONE — registered use_cases and agents routes under /api prefix; all 5 route groups visible in OpenAPI docs
[8.1] backend/app/services/ai_engine.py — DONE — added system_context optional parameter to generate_scorecard and generate_optimized_prompt
[8.2] backend/app/services/llm_service.py — DONE — updated generate_scorecard and generate_optimized_prompt wrappers to accept and pass system_context through to ai_engine
[8.3] backend/app/routes/evaluate.py — DONE — composed partitioned system_context (eval vs opt instructions) from use-case and agent registries and passed to llm_service wrappers; verified live end-to-end compatibility and custom optimizations

