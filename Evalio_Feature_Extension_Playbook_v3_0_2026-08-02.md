# Evalio — Feature Extension Playbook (Sankar + Coding Agent)

> **Document type:** Technical Documentation — Step-by-step build guide
> **Owner:** Sankar (Backend & DB Lead — now sole backend owner)
> **Event:** SYNC 2026, Ahalia School of Engineering and Technology (ASET) — IEDC
> **Theme:** Human-AI Collaboration
> **Product:** Evalio — an AI-powered Prompt IDE
> **Stack:** Python 3.11+, FastAPI, Pydantic v2, MongoDB Atlas, Beanie ODM
> **LLM:** GLM 4.7 (primary) · Groq Llama (backup)
> **Version:** 3.0
> **Date:** 2026-08-02
> **Prerequisite:** v2.0 Playbook Phases 1–4 COMPLETE and FROZEN

---

## 0. How To Read This Document

This playbook is the **extension guide** for the two new WOW-factor features being added to Evalio after Phase 4 is complete. It follows the exact same conventions as the v2.0 playbook — every step is tagged with an owner, every `[AGENT]` step has a `READ FIRST` block and a `DONE WHEN` block, and every phase ends with a `[GIT]` merge and a yell.

| Tag        | Meaning                                                                                      |
|------------|----------------------------------------------------------------------------------------------|
| `[SANKAR]` | You (Sankar) perform this manually — installs, decisions, teammate hand-offs, DB ops, smoke tests. |
| `[AGENT]`  | Your coding agent writes/generates the code or file from the instructions given. You review it. |
| `[HAND-OFF]` | A concrete artifact (contract, field table, URL) you must physically hand to a teammate.    |
| `[RECEIVE]`| An artifact you must physically collect from a teammate before this step can finish.         |
| `[GIT]`    | A version-control action — commit, push, pull, or merge to `main`.                           |

### 0.1 Relationship to v2.0 Playbook — CRITICAL

**Phases 1 through 4 of the v2.0 playbook are COMPLETE and FROZEN.** This means:

- `app/core/config.py` — done, do not touch.
- `app/database.py` — done, do not touch.
- `app/dependencies.py` — done, do not touch.
- `app/models.py` — done, do not touch (ProjectSession and ScanResult are frozen).
- `app/services/errors.py` — done, do not touch.
- `app/routes/scan.py` — done, do not touch.
- `app/routes/session.py` — done, do not touch.
- `app/main.py` — done EXCEPT for registering two new routers (Step 5.6).
- `app/services/ai_engine.py` — Sreya’s real implementation is merged. **You now own this file.** You will ADD a parameter, not rewrite.
- `app/services/llm_service.py` — done. You will ADD a parameter pass-through, not rewrite.
- `app/routes/evaluate.py` — done. You will ADD system-context composition logic, not rewrite.
- `app/schemas.py` — FROZEN after Phase 1 in v2.0. You will APPEND new schemas, not modify existing ones.
- `scripts/seed_golden_path.py` — done. You will UPDATE it for the new features.

**Rule:** If a step in this document tells you to modify a frozen file, read the modification carefully. The change must be purely additive (new fields with defaults, new imports, new lines) — never alter an existing line of a frozen schema or route.

### 0.2 IMPORTANT — This document contains NO pre-written code

Same rule as v2.0. Every `[AGENT]` step is written as **build instructions**, not source code. The agent reads the instruction, understands the intent, and writes the implementation. Terminal commands for environment setup are the one exception.

### 0.3 Graphify Model-Switch Protocol (READ THIS FIRST, AGENT)

Identical to v2.0 Section 0.2. Every step in this document is self-contained and stateless. Three mechanisms survive:

**1. Every `[AGENT]` step opens with a `READ FIRST` block** naming the exact files to open before writing.

**2. Every `[AGENT]` step closes with a `DONE WHEN` block** — a concrete, verifiable exit condition.

**3. `backend/docs/AGENT_STATE.md` is the hand-off baton.** This file already contains entries from `[1.5]` through `[6.1]` (all v2.0 steps). New steps in this document append entries starting at `[7.1]`. A fresh model’s first action is always: **read `backend/docs/AGENT_STATE.md` from top to bottom.**

**Never assume prior context. Never claim a file exists without opening it. Never rewrite a file another step already completed.**

### 0.4 Git Strategy — Updated for Solo Backend Ownership

The team structure has changed. Sreya is on PPT duty. **You (Sankar) now own every file in `/backend`.** This simplifies everything.

**Branch reality:**

| Branch                    | Status    | Who pushes        |
|---------------------------|-----------|-------------------|
| `main`                    | Active    | Sankar (gatekeeper, merge-only) |
| `feature/backend`         | **Active** | Sankar — ALL backend work happens here |
| `feature/ai-pipeline`     | **Dormant** | Nobody — Sreya is on PPT |
| `feature/frontend-ui`     | Active    | Anamika |
| `feature/frontend-logic`  | Active    | Vithul |

**Since you own everything in `/backend`, the file-level ownership conflict matrix from v2.0 Section 0.3 no longer applies.** You can freely edit `ai_engine.py`, `llm_service.py`, `evaluate.py`, `schemas.py`, and every other backend file from `feature/backend` without any merge conflict risk.

**The workflow (simplified):**

1. Pull latest `main` into `feature/backend`: `git pull origin main`
2. Build the feature steps on `feature/backend`.
3. Commit and push to `feature/backend`.
4. Merge to `main` via GitHub PR at each checkpoint.
5. Yell: **“MAIN IS UPDATED — [what changed].”** Vithul and Anamika pull.

**Merge-to-main checkpoints in this document:** end of Phase 5 (registries + schemas + registry endpoints), end of Phase 6 (AI engine integration + evaluate route update), end of Phase 7 (golden path + demo lockdown). Three merges, three yells.

### 0.5 Project Vision Recap — Updated

Evalio’s original **4 core features** remain (Scorecard, AI Optimizer, Contextual Memory, Vulnerability Scanner). Two new features are being added:

5. **Use-Case Prompt Templates** — The user selects a use case (e.g., “Image Generation,” “Backend Development”) before evaluating. The backend provides use-case-specific evaluation criteria, scorecard weight overrides, and an optimized system prompt tailored to that domain.

6. **Agent-Specific Prompt Targeting (Power Combo)** — The user also selects a target LLM agent (e.g., Claude, ChatGPT, Gemini). The backend reformats the optimized prompt to match that agent’s preferred prompting style. **Both use case and agent are always selected together** — this is the Power Combo mode.

### 0.6 Team Hand-off Map — Updated

| Teammate     | Role                                  | What Sankar gives them                          | What Sankar gets from them                          |
|--------------|---------------------------------------|-------------------------------------------------|-----------------------------------------------------|
| **Vithul**   | State & API Integrator (frontend↔API) | Updated JSON field tables, 2 new endpoint URLs, updated Swagger docs | Frontend integration confirmation, bug reports |
| **Anamika**  | UI & Pitch Co-Lead                    | Use-case and agent option lists for dropdowns, updated field table | (none until demo) |
| **Sreya**    | PPT & Pitch (no backend work)         | (none — she is on presentation duty)      | (none — her ai_engine.py implementation is already merged) |

---

## 1. Feature Architecture Overview

This section defines WHAT the two features are and HOW they work at a high level. Read this section once to understand the full picture before executing any build step.

### 1.1 Feature 1: Use-Case Prompt Templates

**The problem:** Currently, Evalio evaluates every prompt with the same generic criteria (Clarity, Constraints, Formatting). A prompt for Midjourney and a system prompt for a REST API get scored identically. The optimizer produces a generic rewrite regardless of domain.

**The solution:** Before evaluating, the user selects one of **8 fixed use cases**. Each use case carries:

- **Evaluation focus areas** — what the scorecard should specifically look for in that domain.
- **Scorecard weight overrides** — shifting the relative importance of Clarity, Constraints, and Formatting for that domain.
- **Optimizer system prompt addition** — domain-specific instructions appended to the LLM’s internal system prompt so the optimizer produces domain-aware output.

**The 8 use cases are fixed.** There is no “General” or “Custom” option. The 8 options ARE the product.

| Use Case ID | Label | Icon | When to Use |
|-------------|-------|------|-------------|
| `image_gen` | Image Generation | 🎨 | Prompts for DALL-E, Midjourney, Stable Diffusion |
| `video_gen` | Video Generation | 🎬 | Prompts for Sora, Runway Gen-3, Pika, Kling |
| `backend_dev` | Backend Development | ⚙️ | System prompts for backend code generation |
| `ui_dev` | UI / Frontend Development | 💻 | System prompts for frontend/UI code generation |
| `data_analysis` | Data Analysis | 📊 | Prompts for data analysis, visualization, statistics |
| `content_writing` | Content Writing | ✍️ | Prompts for blogs, articles, copywriting, marketing |
| `code_review` | Code Review | 🔍 | System prompts for automated code review / security audit |
| `machine_learning` | Machine Learning | 🤖 | System prompts for ML pipeline design, model selection |

### 1.2 Feature 2: Agent-Specific Prompt Targeting (Power Combo)

**The problem:** Different LLM agents (Claude, ChatGPT, Gemini) have fundamentally different prompting best practices. A prompt optimized for Claude’s XML-tagged structure will underperform on ChatGPT, which prefers markdown-sectioned system prompts. Currently, Evalio produces one generic optimized prompt — it doesn’t know which agent will consume it.

**The solution:** The user selects a target agent alongside the use case. The backend reformats the optimized prompt to match that agent’s preferred prompting style. Research from 2025–2026 confirms significant model-specific differences:

- **Claude** (Anthropic): Excels with XML-tagged structures (`<instructions>`, `<rules>`, `<example>`). Follows complex multi-part instructions and very long system prompts (200K context) better than any other model. Less strong at strict JSON output without explicit formatting instructions [1][2].
- **ChatGPT / GPT** (OpenAI): Works best with markdown-formatted system prompts using section headers (`## Role`, `## Task`, `## Output Format`). Excels at code generation and JSON output with minimal fuss. Few-shot examples are highly effective [1][3].
- **Gemini** (Google): Massive 2M-token context window. Prefers concise, direct instructions — overly long system prompts can degrade performance. Strongest at research synthesis and factual grounding [3][4].
- **LLaMA** (Meta): Open-weight, runs locally. Needs very explicit formatting rules and delimiter instructions. Benefits from 3–5 few-shot examples. Less tolerant of ambiguous instructions [5].
- **DeepSeek**: Strongest at chain-of-thought reasoning. Benefits from “think step by step” patterns. Excellent at mathematical and logical tasks. Cost-efficient API pricing [6].
- **Mistral** (Mistral AI): Efficient inference, strong multilingual support. Works well with concise system prompts and XML-like structures. Good for European data residency requirements [7].

**The 6 supported agents are fixed.** There is no “other” or “custom” option.

| Agent ID | Label | Provider | Prompting Style | Context Window |
|----------|-------|----------|-----------------|----------------|
| `claude` | Claude | Anthropic | XML tags | 200K tokens |
| `chatgpt` | ChatGPT / GPT | OpenAI | Markdown sections | 128K tokens |
| `gemini` | Gemini | Google | Concise direct | 2M tokens |
| `llama` | LLaMA | Meta | Explicit delimiters | 128K tokens |
| `deepseek` | DeepSeek | DeepSeek | Chain of thought | 128K tokens |
| `mistral` | Mistral | Mistral AI | Concise XML | 128K tokens |

### 1.3 How Features Compose — The Power Combo

The two features are designed to work **together, always**. The user always selects both a use case and a target agent. The backend composes a `system_context` string that combines both, and this context is injected into the LLM’s internal system prompt for both scorecard evaluation and prompt optimization.

**Composition flow:**

```
User selects: use_case=“backend_dev” + target_agent=“claude”

Backend composes system_context:
  = BASE_SYSTEM_PROMPT
  + USE_CASE_REGISTRY[“backend_dev”][“optimizer_system_addition”]
  + AGENT_REGISTRY[“claude”][“formatting_rules”]

This system_context is passed to:
  → generate_scorecard(prompt_text, system_context)
  → generate_optimized_prompt(prompt_text, history, system_context)

Result: A scorecard with backend-specific weaknesses
        + An optimized prompt formatted in Claude’s XML-tagged style
```

**What the judge sees:** The user selects “Backend Development” + “Claude,” pastes a rough prompt, clicks Evaluate, and gets back an optimized system prompt that is both domain-rich (covers auth, error handling, DB schema) AND agent-formatted (wrapped in `<role>`, `<instructions>`, `<constraints>` XML tags). That is the WOW moment.

### 1.4 Design Principles

1. **Backward compatibility via optional fields.** Both `use_case` and `target_agent` are `Optional[str] = None` on `EvaluateRequest`. If neither is provided, the system behaves **exactly** as v2.0 — Vithul’s existing Axios calls continue working with zero changes.
2. **Registry-based, not database-backed.** Use cases and agents are defined as Python dictionaries in dedicated modules. No new MongoDB collections. This is a deliberate hackathon trade-off — zero DB schema migrations, zero seed scripts for registries, instant iteration.
3. **Purely additive schema changes.** New fields are appended to `EvaluateRequest`. New response models (`UseCaseInfo`, `AgentInfo`) are added. No existing field is renamed, retyped, or removed.
4. **AI engine extension via default parameters.** `system_context: str = ""` is added as a default-parameter to Sreya’s function signatures. Her existing implementation (which doesn’t accept this parameter) continues to work because the default is empty — until Sankar updates it.

---

## 2. Phase 5 — Feature Extension: Registries, Schemas & Endpoints (Hours 18–20.5)

**Goal:** Build the two registry modules, extend the Pydantic schemas, and ship two new GET endpoints so Vithul and Anamika can start frontend integration.

### 2.1 `[AGENT]` Build `app/services/use_case_registry.py`

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/schemas.py` (to understand existing patterns) → Graphify’s project/context files.

**Task:** Create the use-case registry module. This is a **Sankar-owned file** (not Sreya’s). It contains a single Python dictionary mapping use-case IDs to their full metadata. No classes, no Beanie models, no database calls — pure data.

**Instructions:**

1. Open the file with a module docstring stating: this is a static registry of use-case definitions for Evalio. Each entry defines the evaluation focus, scorecard weight overrides, and optimizer system prompt addition for that domain. Updated by Sankar only.

2. Define a module-level dictionary named `USE_CASE_REGISTRY`. The keys are string use-case IDs. The values are dictionaries with exactly these keys:

   | Key | Type | Description |
   |-----|------|-------------|
   | `id` | `str` | Same as the dictionary key (e.g., `"image_gen"`) |
   | `label` | `str` | Human-readable name for the UI dropdown (e.g., `"Image Generation"`) |
   | `icon` | `str` | A single emoji character for the UI (e.g., `"🎨"`) |
   | `description` | `str` | One-sentence description of what this use case covers |
   | `evaluation_focus` | `list[str]` | 5–7 specific criteria the scorecard should check for this domain |
   | `scorecard_weight_overrides` | `dict` | Three keys — `clarity`, `constraints`, `formatting` — with integer values summing to 100. These OVERRIDE the default equal weighting when this use case is active |
   | `optimizer_system_addition` | `str` | A multi-line string appended to the LLM’s internal system prompt. It must instruct the LLM to optimize the prompt for this SPECIFIC domain. Include concrete, actionable directives |

3. Populate **all 8 entries**. Here is the specification for each — the agent must author the actual content (not copy-paste these summaries):

   **`image_gen` — Image Generation:**
   - Evaluation focus: art style specificity, composition/camera angle, lighting and mood, negative prompt coverage, quality boosters and resolution, color palette definition.
   - Weight overrides: clarity 25, constraints 35, formatting 40 (visual description structure is most important).
   - Optimizer addition: instruct the LLM to act as an expert image-prompt engineer for DALL-E/Midjourney/Stable Diffusion. The rewrite must include: (a) art style reference, (b) lighting/mood, (c) composition/camera perspective, (d) color palette, (e) quality boosters (8K, highly detailed), (f) a `--no` negative prompt section. Output should be a dense, comma-separated visual description.

   **`video_gen` — Video Generation:**
   - Evaluation focus: camera movement type and speed, temporal progression, scene transitions (if multi-scene), subject motion description, lighting changes over time, output duration hints.
   - Weight overrides: clarity 30, constraints 30, formatting 40.
   - Optimizer addition: instruct the LLM to act as an expert video-prompt engineer for Sora/Runway/Pika/Kling. The rewrite must specify: (a) camera movement (pan, tilt, dolly, crane, tracking), (b) temporal progression, (c) subject motion, (d) lighting evolution, (e) scene transitions, (f) duration/pacing hints.

   **`backend_dev` — Backend Development:**
   - Evaluation focus: tech stack specification, authentication/authorization strategy, error handling and status codes, database/ORM patterns, input validation, security constraints, API versioning.
   - Weight overrides: clarity 30, constraints 35, formatting 35.
   - Optimizer addition: instruct the LLM to act as a senior backend architect. The rewrite must specify: (a) tech stack and framework, (b) auth pattern, (c) request/response schema with validation, (d) error handling with status codes, (e) database patterns, (f) security constraints, (g) rate limiting, (h) logging/monitoring requirements.

   **`ui_dev` — UI / Frontend Development:**
   - Evaluation focus: component hierarchy, responsive breakpoints, accessibility (WCAG/ARIA), state management pattern, styling approach, interaction states (hover/focus/loading/error), performance considerations.
   - Weight overrides: clarity 30, constraints 30, formatting 40.
   - Optimizer addition: instruct the LLM to act as a senior frontend engineer and UI architect. The rewrite must specify: (a) component tree structure, (b) responsive design breakpoints, (c) accessibility requirements, (d) state management pattern, (e) styling methodology, (f) interaction states, (g) performance (lazy loading, code splitting).

   **`data_analysis` — Data Analysis:**
   - Evaluation focus: expected input data format/schema, statistical methods, output format (tables/charts/metrics), edge case handling (missing data/outliers), visualization types, business context/KPI definitions.
   - Weight overrides: clarity 30, constraints 35, formatting 35.
   - Optimizer addition: instruct the LLM to act as a senior data analyst. The rewrite must specify: (a) input data format, (b) statistical methods, (c) output format, (d) edge case handling, (e) visualization types, (f) KPI definitions, (g) reproducibility requirements.

   **`content_writing` — Content Writing:**
   - Evaluation focus: target audience persona, tone and voice, content structure/outline, SEO keywords and placement, word count constraints, call-to-action, formatting rules.
   - Weight overrides: clarity 35, constraints 25, formatting 40.
   - Optimizer addition: instruct the LLM to act as a professional content strategist. The rewrite must specify: (a) audience persona, (b) tone guidelines, (c) content structure, (d) SEO keywords, (e) word count, (f) CTA, (g) formatting (headings, bullets, links).

   **`code_review` — Code Review:**
   - Evaluation focus: security vulnerability categories (OWASP), performance anti-patterns, code style/maintainability, severity classification system, false positive handling, remediation suggestions.
   - Weight overrides: clarity 25, constraints 40, formatting 35.
   - Optimizer addition: instruct the LLM to act as a senior security engineer and code reviewer. The rewrite must specify: (a) vulnerability categories, (b) performance checks, (c) code style criteria, (d) severity levels, (e) report format with line references, (f) remediation suggestions.

   **`machine_learning` — Machine Learning:**
   - Evaluation focus: problem formulation, data requirements and preprocessing, model selection rationale, evaluation metrics, hyperparameter constraints, deployment/serving requirements, reproducibility.
   - Weight overrides: clarity 30, constraints 35, formatting 35.
   - Optimizer addition: instruct the LLM to act as a senior ML engineer. The rewrite must specify: (a) problem type and formulation, (b) data requirements, (c) model selection criteria, (d) evaluation metrics, (e) hyperparameter search space, (f) training pipeline steps, (g) deployment constraints, (h) reproducibility requirements.

4. After the dictionary, define a single public function: `get_use_case(use_case_id: str) -> dict | None`. It returns the matching entry or `None` if the ID doesn’t exist. This is what the evaluate route calls — never access the dictionary directly from a route.

5. Define a second public function: `list_use_cases() -> list[dict]`. It returns all entries as a list (for the GET `/api/use-cases` endpoint). Strip the `optimizer_system_addition` and `scorecard_weight_overrides` from each entry — the frontend only needs `id`, `label`, `icon`, `description`, and `evaluation_focus`.

**DONE WHEN:** importing `USE_CASE_REGISTRY` returns a dict with exactly 8 keys, `get_use_case("backend_dev")` returns a dict with all required sub-keys, `get_use_case("nonexistent")` returns `None`, and `list_use_cases()` returns a list of 8 dicts each missing `optimizer_system_addition` and `scorecard_weight_overrides`. Append the `[7.1]` line to `AGENT_STATE.md`.

---

### 2.2 `[AGENT]` Build `app/services/agent_registry.py`

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/services/use_case_registry.py` (mirror its pattern) → Graphify’s project/context files.

**Task:** Create the agent registry module. Same architecture as the use-case registry — a Python dictionary, no DB, no classes. This is a **Sankar-owned file**.

**Instructions:**

1. Module docstring: static registry of supported LLM agents and their prompting best practices. Each entry defines the agent’s preferred prompting style, formatting rules, and strengths. Updated by Sankar only.

2. Define `AGENT_REGISTRY` as a module-level dictionary. Keys are agent IDs. Values are dictionaries with exactly these keys:

   | Key | Type | Description |
   |-----|------|-------------|
   | `id` | `str` | Same as the dictionary key |
   | `label` | `str` | Human-readable name for the UI dropdown |
   | `provider` | `str` | The company behind the agent |
   | `icon` | `str` | A single emoji character |
   | `strengths` | `list[str]` | 4–6 key strengths of this agent |
   | `prompting_style` | `str` | A short identifier for the prompting style (e.g., `"xml_tags"`, `"markdown_sections"`) |
   | `system_prompt_tips` | `list[str]` | 4–6 actionable tips for writing prompts for this specific agent |
   | `formatting_rules` | `str` | A multi-line string describing HOW to restructure a prompt for this agent. This is what the optimizer uses to reformat the output |
   | `context_window` | `str` | Human-readable context window size |

3. Populate **all 6 entries**. Here is the specification for each — the agent must author the actual content:

   **`claude` — Claude (Anthropic):**
   - Prompting style: `xml_tags`
   - Tips: use XML tags for structure, provide detailed role definitions, break complex tasks into numbered sections, Claude follows very long prompts reliably.
   - Formatting rules: instruct the optimizer to wrap the output in XML tags — `<role>`, `<instructions>`, `<constraints>`, `<output_format>`, `<examples>`. Use nested tags for sub-sections. Claude’s instruction-following is strongest when structure is explicit and hierarchical.

   **`chatgpt` — ChatGPT / GPT (OpenAI):**
   - Prompting style: `markdown_sections`
   - Tips: use markdown headers (`## Role`, `## Task`, `## Output Format`), provide explicit output schema for structured data, include 2–3 few-shot examples, be explicit about what NOT to do.
   - Formatting rules: instruct the optimizer to structure the output with markdown headers and sub-headers. Use `**bold**` for emphasis on key rules. Include a clear `## Output Format` section. ChatGPT excels when the output format is specified in markdown.

   **`gemini` — Gemini (Google):**
   - Prompting style: `concise_direct`
   - Tips: keep system prompts concise and direct, specify output structure explicitly, leverage grounding for factual accuracy, avoid overly long system prompts.
   - Formatting rules: instruct the optimizer to produce a clean, concise system prompt. Use short paragraphs and bullet points. Avoid excessive nesting. Gemini’s 2M context means brevity in the SYSTEM prompt, not length. Focus on clear, direct instructions.

   **`llama` — LLaMA (Meta):**
   - Prompting style: `explicit_delimiters`
   - Tips: use explicit delimiters (triple backticks, `###`, `---`) to separate sections, provide very explicit formatting rules, include 3–5 few-shot examples, state constraints clearly and repeat key rules.
   - Formatting rules: instruct the optimizer to use clear section delimiters. Separate role, task, constraints, and output format with `###` or `---`. Repeat critical constraints. LLaMA benefits from redundancy and explicit boundary markers.

   **`deepseek` — DeepSeek:**
   - Prompting style: `chain_of_thought`
   - Tips: use “think step by step” reasoning patterns, break complex problems into intermediate steps, ask for explicit reasoning chains, state constraints at both start and end.
   - Formatting rules: instruct the optimizer to include a reasoning/thinking section in the prompt. Structure as: (1) role and constraints, (2) step-by-step thinking instructions, (3) output format. DeepSeek performs best when chain-of-thought is explicitly requested.

   **`mistral` — Mistral (Mistral AI):**
   - Prompting style: `concise_xml`
   - Tips: keep system prompts concise, use XML-like structures for complex tasks, be direct about expected output, avoid unnecessary context.
   - Formatting rules: instruct the optimizer to produce a compact system prompt with XML-like tags for structure. Keep it shorter than for Claude. Mistral values efficiency — every word should earn its place.

4. Define `get_agent(agent_id: str) -> dict | None` — same pattern as the use-case registry.

5. Define `list_agents() -> list[dict]` — returns all entries as a list, stripping `formatting_rules` (the frontend doesn’t need the internal formatting instructions). The frontend needs: `id`, `label`, `provider`, `icon`, `strengths`, `prompting_style`, `system_prompt_tips`, `context_window`.

**DONE WHEN:** importing `AGENT_REGISTRY` returns a dict with exactly 6 keys, `get_agent("claude")` returns a dict with a non-empty `formatting_rules` string, `get_agent("nonexistent")` returns `None`, and `list_agents()` returns 6 dicts without `formatting_rules` keys. Append the `[7.2]` line to `AGENT_STATE.md`.

---

### 2.3 `[AGENT]` Update `app/schemas.py` — Add new fields and response models

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/schemas.py` (READ THE ENTIRE FILE — it is frozen, you must understand every existing class before appending) → Graphify’s project/context files.

**Task:** APPEND new schemas to the existing file. Do NOT modify, rename, or delete any existing class or field. The v2.0 schemas (Section 1–5) are sacred.

**Instructions:**

1. At the top of the file, add two new imports: `Literal` from `typing` (if not already imported — check first), and `Field` from `pydantic` (should already be imported).

2. **Do NOT touch any existing class.** Scroll to the very bottom of the file.

3. Add a prominent comment banner: `# ─── PHASE 5+ EXTENSIONS (v3.0) ───`

4. **Section 6 — Use-Case and Agent Request Extensions.**

   Add two new optional fields to `EvaluateRequest` — but do so by creating a NEW class that inherits from the original, or by directly adding fields. The cleanest approach for Pydantic v2: add the two fields directly to the existing `EvaluateRequest` class at the end of its field list. This is safe because both are `Optional` with `None` defaults.

   Add these two fields to `EvaluateRequest`:

   | Field | Type | Default | Rules |
   |-------|------|---------|-------|
   | `use_case` | `Optional[str]` | `None` | Describe as: the ID of the selected use case from the registry. Pass to enable domain-specific evaluation. Omit for generic behavior. |
   | `target_agent` | `Optional[str]` | `None` | Describe as: the ID of the target LLM agent from the agent registry. Pass to enable agent-specific formatting. Omit for generic formatting. |

   > **Why adding to the existing class is safe:** Both fields default to `None`. Pydantic v2 treats missing keys in the JSON body as `None` for Optional fields. Vithul’s existing Axios calls (which don’t send these fields) will continue to validate successfully. Zero breaking changes.

5. **Section 7 — Registry Response Models.**

   Define `UseCaseInfo` (a flat model for the GET `/api/use-cases` response):

   | Field | Type | Description |
   |-------|------|-------------|
   | `id` | `str` | Use case identifier |
   | `label` | `str` | Display name |
   | `icon` | `str` | Emoji icon |
   | `description` | `str` | One-sentence description |
   | `evaluation_focus` | `list[str]` | Domain-specific evaluation criteria |

   Define `AgentInfo` (a flat model for the GET `/api/agents` response):

   | Field | Type | Description |
   |-------|------|-------------|
   | `id` | `str` | Agent identifier |
   | `label` | `str` | Display name |
   | `provider` | `str` | Company name |
   | `icon` | `str` | Emoji icon |
   | `strengths` | `list[str]` | Key strengths |
   | `prompting_style` | `str` | Style identifier |
   | `system_prompt_tips` | `list[str]` | Actionable tips |
   | `context_window` | `str` | Context window size |

**DONE WHEN:** constructing an `EvaluateRequest` with only `raw_prompt` (no `use_case`, no `target_agent`) still validates. Constructing one with `use_case="backend_dev"` and `target_agent="claude"` also validates. Constructing `UseCaseInfo` with all 5 fields validates. Constructing `AgentInfo` with all 8 fields validates. The existing `Scorecard` validation (clarity=150 raises error) still works. Append the `[7.3]` line to `AGENT_STATE.md` with the note: `schemas.py extended — existing classes unchanged except EvaluateRequest gained two optional fields.`

---

### 2.4 `[AGENT]` Build `app/routes/use_cases.py` — GET /api/use-cases

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/schemas.py` (Section 7 — new response models) → `app/services/use_case_registry.py` → Graphify’s project/context files.

**Task:** Create a simple registry endpoint that returns all use cases for the frontend dropdown.

**Instructions:**

1. Create `APIRouter` with prefix empty (the prefix `/api` is added by `main.py`), tag `"UseCases"`.
2. Define `GET /use-cases` with response model `list[UseCaseInfo]`. No auth header needed for this read-only endpoint (registry data is not user-specific).
3. Import and call `list_use_cases()` from the registry module. Return its result directly.
4. This is a three-line route. Do not over-engineer it.

**DONE WHEN:** the server boots without import errors and `GET /api/use-cases` returns a JSON array of 8 objects, each with `id`, `label`, `icon`, `description`, and `evaluation_focus`. Append the `[7.4]` line to `AGENT_STATE.md`.

---

### 2.5 `[AGENT]` Build `app/routes/agents.py` — GET /api/agents

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/schemas.py` (Section 7) → `app/services/agent_registry.py` → Graphify’s project/context files.

**Task:** Mirror the use-cases route for agents.

**Instructions:**

1. Create `APIRouter` with tag `"Agents"`.
2. Define `GET /agents` with response model `list[AgentInfo]`. No auth header.
3. Import and call `list_agents()`. Return the result.

**DONE WHEN:** `GET /api/agents` returns a JSON array of 6 objects. Append the `[7.5]` line to `AGENT_STATE.md`.

---

### 2.6 `[AGENT]` Update `app/main.py` — Register new routers

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/main.py` → Graphify’s project/context files.

**Task:** Add two new router includes to the FastAPI app. This is the ONLY modification to `main.py`.

**Instructions:**

1. Open `main.py`. Read it fully. Find the existing three `include_router` calls (evaluate, scan, session).
2. Add two new imports at the top: `app.routes.use_cases` and `app.routes.agents`.
3. Add two new `include_router` calls immediately after the existing three, each under the `/api` prefix, with tags `"UseCases"` and `"Agents"` respectively.
4. Do not modify anything else in `main.py`. The lifespan, CORS, and health route stay untouched.

**DONE WHEN:** the server boots with all 5 route groups (evaluate, scan, session, use-cases, agents) visible in `/docs`. Append the `[7.6]` line to `AGENT_STATE.md`.

---

### 2.7 `[SANKAR]` Verify backward compatibility and registry endpoints

Boot the server:

```bash
uvicorn app.main:app --reload --port 8000
```

**Test 1 — Backward compatibility (critical):**

Send a `POST` to `http://localhost:8000/api/evaluate` with the same headers and body as Phase 2 smoke test (just `raw_prompt`, no `use_case`, no `target_agent`). Expect 200 with the same mock/live response shape. This proves Vithul’s existing frontend still works.

**Test 2 — New fields accepted:**

Send the same POST but add `"use_case": "backend_dev"` and `"target_agent": "claude"` to the JSON body. Expect 200. The response should be identical to Test 1 (because the evaluate route doesn’t use the new fields yet — that happens in Phase 6).

**Test 3 — Registry endpoints:**

- `GET http://localhost:8000/api/use-cases` → expect 200, JSON array of 8 objects.
- `GET http://localhost:8000/api/agents` → expect 200, JSON array of 6 objects.

**Test 4 — Swagger completeness:**

Open `http://localhost:8000/docs`. Verify all 7 routes are listed: `/health`, `/api/evaluate`, `/api/scan`, `/api/sessions`, `/api/sessions/{session_id}`, `/api/use-cases`, `/api/agents`.

---

### 2.8 `[GIT]` Merge to main and yell

```bash
git add .
git commit -m "feat: use-case and agent registries, extended schemas, registry endpoints"
git push origin feature/backend
# GitHub -> Compare & pull request -> Merge pull request
```

Then **yell: “MAIN IS UPDATED — use-case and agent registries are live.”**

Vithul and Anamika each run `git pull origin main` from their branch.

---

### 2.9 `[HAND-OFF]` Phase 5 artifacts to distribute

**→ Vithul (give):**

Two new endpoints for his Axios integration:

| Endpoint | Method | Response | When to Call |
|----------|--------|----------|-------------|
| `/api/use-cases` | GET | `UseCaseInfo[]` (8 objects) | Once on app load, cache in React state. Populate the Use Case dropdown. |
| `/api/agents` | GET | `AgentInfo[]` (6 objects) | Once on app load, cache in React state. Populate the Target Agent dropdown. |

Updated `POST /api/evaluate` body — two new optional fields:

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
| `use_case` | string or null | No | Pass the `id` from the use-case dropdown. Send `null` or omit if not selected. |
| `target_agent` | string or null | No | Pass the `id` from the agent dropdown. Send `null` or omit if not selected. |

Tell Vithul: “Both fields are optional. If you don’t send them, the API behaves exactly as before. Add them to your evaluate POST body when the user has made selections. Your existing code doesn’t break.”

**→ Anamika (give):**

The full list of 8 use cases and 6 agents (same data the endpoints return) so she can design the Context Bar. Give her this layout recommendation:

```
┌──────────────────────────────────────────────────────────────┐
│  Use Case: [Backend Development ▾]   Target: [Claude ▾]   │
└──────────────────────────────────────────────────────────────┘
```

Both dropdowns should show the `icon` + `label` for each option. When a selection is made, show a subtle colored badge/pill next to the dropdown indicating the active choice.

`[RECEIVE]` Verbal confirmation from Vithul that the field contract makes sense. From Anamika, confirmation that she has the data for the UI.

---

## 3. Phase 6 — Feature Extension: AI Engine Integration (Hours 20.5–22)

**Goal:** Wire the registries into the AI evaluation pipeline so that selecting a use case + agent actually changes the scorecard and optimized prompt output.

### 3.1 `[AGENT]` Update `app/services/ai_engine.py` — Add system_context parameter

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/services/ai_engine.py` (READ THE ENTIRE FILE — Sreya’s real implementation) → `app/schemas.py` → Graphify’s project/context files.

> **OWNERSHIP NOTE.** This file was Sreya’s. She is now on PPT duty. **You (Sankar) own this file for the remainder of the hackathon.** You are adding a parameter to her existing function signatures — not rewriting her LLM call logic.

**Task:** Add an optional `system_context` parameter to `generate_scorecard` and `generate_optimized_prompt`. This parameter carries the composed use-case + agent context that the LLM needs to produce domain-specific, agent-formatted output.

**Instructions:**

1. Read the ENTIRE file first. Understand Sreya’s implementation — how she constructs the system prompt, how she calls the LLM SDK, how she parses the response.

2. Add `system_context: str = ""` as the **last parameter** to both `generate_scorecard` and `generate_optimized_prompt`. The default empty string means: if the caller doesn’t pass context, the function behaves exactly as Sreya wrote it. Zero breaking changes.

3. In `generate_scorecard`: if `system_context` is non-empty, **prepend it to Sreya’s internal system prompt** (the instruction that tells the LLM how to evaluate). The composed prompt becomes: `system_context + "\n\n" + SREYA_ORIGINAL_SYSTEM_PROMPT`. This way the use-case and agent context frames the evaluation before Sreya’s base instructions.

4. In `generate_optimized_prompt`: same approach. If `system_context` is non-empty, prepend it to the internal system prompt. The optimizer now knows both the domain context and the target agent’s formatting preference.

5. **Do NOT touch `run_jailbreak_scan`.** The vulnerability scanner is use-case and agent agnostic — a prompt injection attempt is dangerous regardless of domain or target model. Leave its signature unchanged.

6. Add a module-level comment noting: “v3.0 extension — system_context parameter added by Sankar. Sreya’s core LLM logic unchanged.”

**DONE WHEN:** calling `generate_scorecard("test prompt")` with no `system_context` returns the same result as before. Calling `generate_scorecard("test prompt", system_context="You are evaluating a backend development prompt.")` returns a result that reflects the added context (the scorecard weaknesses should mention backend-specific concepts if the LLM is live, or the mock should at least not crash). Append the `[8.1]` line to `AGENT_STATE.md`.

---

### 3.2 `[AGENT]` Update `app/services/llm_service.py` — Pass system_context through

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/services/llm_service.py` (the adapter) → `app/services/ai_engine.py` (verify new signatures) → Graphify’s project/context files.

**Task:** Update the adapter’s three public wrapper functions to accept and forward the `system_context` parameter.

**Instructions:**

1. Add `system_context: str = ""` as the last parameter to the `generate_scorecard` and `generate_optimized_prompt` wrappers in `llm_service.py`. Match the exact parameter name and position from `ai_engine.py`.

2. In each wrapper, pass `system_context` through to the `ai_engine` function call. If the wrapper does any normalization (dict coercion, fence stripping, sync-offload), the `system_context` pass-through happens AFTER the await and normalization — it’s a parameter, not part of the return value.

3. **Do NOT add `system_context` to the `run_jailbreak_scan` wrapper.** The scanner stays unchanged.

**DONE WHEN:** calling the scorecard wrapper with `system_context="test"` does not raise a TypeError (proving the parameter is accepted and forwarded). Append the `[8.2]` line to `AGENT_STATE.md`.

---

### 3.3 `[AGENT]` Update `app/routes/evaluate.py` — Compose system context from registries

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `app/routes/evaluate.py` (the existing route — read the ENTIRE file) → `app/services/use_case_registry.py` → `app/services/agent_registry.py` → `app/services/llm_service.py` (verify new signatures) → Graphify’s project/context files.

**Task:** This is the **integration step** that makes everything work together. Modify the evaluate route to compose a `system_context` string from the two registries and pass it to the LLM service wrappers.

**Instructions:**

1. Read the entire `evaluate.py` file. Understand the existing 5-step flow (Session → History Window → Parallel LLM Calls → Persist → Respond).

2. Add two new imports at the top: `get_use_case` from `use_case_registry` and `get_agent` from `agent_registry`.

3. **Insert a new step between Step 2 (History Window) and Step 3 (Parallel LLM Calls).** Call it **Step 2.5 — Compose System Context.**

   The logic:
   - Initialize an empty string: `system_context = ""`
   - If `request.use_case` is not None and not empty:
     - Call `get_use_case(request.use_case)`. If it returns a dict (valid ID), append the `optimizer_system_addition` string to `system_context` with a clear separator.
     - If it returns `None` (invalid ID), **silently ignore it** — do not raise an error. A typo in the use-case ID should not block evaluation.
   - If `request.target_agent` is not None and not empty:
     - Call `get_agent(request.target_agent)`. If it returns a dict, construct a context block containing: the agent’s `label`, `provider`, `prompting_style`, and `system_prompt_tips` formatted as a structured instruction block. Append this to `system_context`.
     - If it returns `None`, silently ignore.
   - The final `system_context` is a string that may be empty (if neither was selected), contain only use-case context, contain only agent context, or contain both. All four cases produce valid behavior.

4. **Modify Step 3 (Parallel LLM Calls).** Pass `system_context` as the last argument to both `generate_scorecard` and `generate_optimized_prompt` calls inside the `asyncio.gather`.

5. **Do NOT modify Steps 1, 2, 4, or 5.** Session handling, history, persistence, and response construction remain untouched.

6. Update the route’s docstring to reflect the new 5.5-step flow.

**DONE WHEN:** sending a POST with `use_case="backend_dev"` and `target_agent="claude"` returns 200 and the `optimized_prompt` in the response reflects the composed context (if the LLM is live, the output should mention backend concepts and/or use XML-like structure). Sending a POST without the new fields still works as before. Append the `[8.3]` line to `AGENT_STATE.md`.

---

### 3.4 `[SANKAR]` End-to-end smoke test

Boot the server and run these tests in order:

**Test 1 — Backward compatibility (regression gate):**

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-1
Body: { "raw_prompt": "Write SQL queries for me." }
```
Expect: 200. Response shape identical to v2.0. This is the regression gate — if this fails, stop and debug.

**Test 2 — Use case only:**

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-2
Body: { "raw_prompt": "Build me a REST API for task management", "use_case": "backend_dev" }
```
Expect: 200. The optimized prompt should contain backend-specific concepts (auth, error handling, DB schema) if the LLM is live.

**Test 3 — Agent only:**

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-3
Body: { "raw_prompt": "You are a helpful assistant", "target_agent": "claude" }
```
Expect: 200. The optimized prompt should show Claude-style formatting (XML tags) if the LLM is live.

**Test 4 — Power Combo (the demo path):**

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-4
Body: { "raw_prompt": "Build me a REST API for task management", "use_case": "backend_dev", "target_agent": "claude" }
```
Expect: 200. The optimized prompt should be BOTH domain-rich (backend concepts) AND agent-formatted (Claude XML tags). This is the WOW test.

**Test 5 — Invalid IDs (graceful degradation):**

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-5
Body: { "raw_prompt": "Hello", "use_case": "nonexistent_case", "target_agent": "nonexistent_agent" }
```
Expect: 200. The response should be identical to Test 1 (invalid IDs are silently ignored).

**Test 6 — Contextual memory still works:**

Use the `session_id` from Test 4. Send a follow-up:

```bash
POST /api/evaluate
Headers: X-Workspace-Id: test-ws-4
Body: { "raw_prompt": "Now add JWT authentication to that", "session_id": "<from test 4>", "use_case": "backend_dev", "target_agent": "claude" }
```
Expect: 200. `chat_history` should contain 4 messages. The optimized prompt should build on the previous turn AND maintain backend + Claude formatting.

---

### 3.5 `[GIT]` Merge to main and yell

```bash
git add .
git commit -m "feat: system context composition from use-case and agent registries"
git push origin feature/backend
# GitHub -> Compare & pull request -> Merge pull request
```

Then **yell: “MAIN IS UPDATED — Power Combo evaluation is live.”**

Vithul pulls and integrates the new fields into his Axios call.

---

### 3.6 `[HAND-OFF]` Phase 6 artifacts to distribute

**→ Vithul (give):**

Confirm that the Power Combo flow works end-to-end. Tell him:
> “When the user selects both a use case and an agent, pass both `use_case` and `target_agent` in the evaluate POST body. The optimized prompt you get back will be formatted for that specific agent AND tailored to that domain. This is the headline demo moment. Make sure both dropdowns send their values on every evaluate call, not just the first one.”

Remind him that `session_id` must still be tracked and sent on follow-ups (Contextual Memory), and that the scan endpoint is called in parallel as before (nothing changed there).

**→ Anamika (give):**

Tell her the Power Combo is live. She should style the active dropdown selections to feel like part of the IDE — subtle badges that show “Backend Development · Claude” near the editor, so the judge can see the context at a glance.

---

## 4. Phase 7 — Demo Lockdown & Golden Path (Hours 22–23)

**Goal:** Seed a flawless demo session that showcases the Power Combo. Zero new feature code — only demo data and verification.

### 4.1 `[AGENT]` Update `scripts/seed_golden_path.py` — Power Combo golden path

**READ FIRST:** `backend/docs/AGENT_STATE.md` → `scripts/seed_golden_path.py` (the existing v2.0 seeder) → `app/database.py` → `app/models.py` → Graphify’s project/context files.

**Task:** Update the golden path seeder to include use-case and agent context in the seeded conversation, so the demo can showcase the Power Combo even if the live LLM is slow.

**Instructions:**

1. Read the existing seeder. Understand its structure — it plants one `ProjectSession` document with 4 messages.

2. Keep the demo workspace id as `demo-golden-path`.

3. Update the title to: “Backend Dev + Claude — Power Combo Demo”

4. Replace the 4-message conversation with a new one that tells the **Power Combo story**:

   | # | Role | Content |
   |---|------|---------|
   | 1 | user | A rough backend development prompt, e.g., “Build me a REST API for a task management app” |
   | 2 | assistant | An optimized prompt that is clearly **Claude-formatted** (XML tags like `<role>`, `<instructions>`, `<constraints>`) AND **backend-domain-rich** (mentions auth, error handling, DB schema, rate limiting). This is the Power Combo output. |
   | 3 | user | A follow-up: “Now add JWT authentication and pagination to that” |
   | 4 | assistant | The message 2 prompt **verbatim, unchanged**, PLUS an appended `<authentication>` and `<pagination>` XML section. This proves Contextual Memory works WITH Power Combo. |

   Message 2 is the critical demo artifact. It must be visibly XML-structured (Claude style) and contain backend-specific content. Message 4 must visibly contain message 2 unchanged plus new additions (proving memory).

5. Backdate the timestamps the same way as v2.0 (roughly 8 minutes and 3 minutes ago).

6. The delete-existing logic remains the same — re-running never produces duplicates.

**DONE WHEN:** running the seeder leaves exactly one document in `project_sessions` with the demo workspace id, 4 messages, and the title containing “Power Combo.” The `GET /api/sessions/{id}` endpoint returns the full conversation. Append the `[9.1]` line to `AGENT_STATE.md`.

---

### 4.2 `[SANKAR]` Run the seeder

```bash
cd evalio/backend
python -m scripts.seed_golden_path
```

Copy the printed session id. Verify in MongoDB Compass: the document has 4 messages, message 2 contains XML tags, message 4 contains message 2’s content plus additions.

---

### 4.3 `[SANKAR]` Pre-flight demo checklist (updated)

- [ ] `uvicorn app.main:app --port 8000` boots with zero errors.
- [ ] `/health` returns 200.
- [ ] `/docs` renders all 7 routes (health, evaluate, scan, sessions, sessions/{id}, use-cases, agents).
- [ ] `/api/use-cases` returns 8 use cases.
- [ ] `/api/agents` returns 6 agents.
- [ ] Power Combo test: POST `/api/evaluate` with `use_case="backend_dev"` + `target_agent="claude"` returns 200 with domain-rich, agent-formatted optimized prompt.
- [ ] Backward compatibility: POST `/api/evaluate` with only `raw_prompt` returns 200 (same as v2.0).
- [ ] Contextual Memory: follow-up POST with same session_id returns 4 messages in `chat_history`.
- [ ] Golden Path session reachable via `GET /api/sessions/{id}` with header `X-Workspace-Id: demo-golden-path`.
- [ ] Vulnerability scanner: POST `/api/scan` with injection attempt returns `is_vulnerable: true`.
- [ ] MongoDB Atlas network access still `0.0.0.0/0`.
- [ ] `.env` has the production `MONGODB_URI`.
- [ ] GLM 4.7 key has quota; Groq fallback tested.
- [ ] `main` branch is green — clone fresh and boot.
- [ ] Laptop plugged in. Hotspot ready.
- [ ] Swagger tab + Postman collection open as backup.

---

### 4.4 `[HAND-OFF]` Phase 7 artifacts — the final demo script

**→ Anamika & Sreya (give):** The updated demo script:

```
1. Open Evalio. The UI loads with the dark-mode editor.
2. Anamika’s Context Bar is visible: two dropdowns above the editor.
3. Select Use Case: “Backend Development”
4. Select Target Agent: “Claude”
   → Subtle badges appear showing “Backend Development · Claude”
5. Paste: “Build me a REST API for a task management app”
6. Click “Evaluate.”
   → Scorecard animates in (Clarity/Constraints/Formatting — now with backend-specific weaknesses).
   → Optimized prompt appears — formatted in Claude’s XML-tagged style with backend-specific content.
   → Red banner does NOT appear (scan: not vulnerable).
7. Type a follow-up: “Now add JWT authentication and pagination to that.”
8. Click “Evaluate” again.
   → Optimized prompt now includes <authentication> and <pagination> XML sections.
   → The previous content is preserved — proving Contextual Memory + Power Combo.
9. (Optional) Switch Target Agent to “ChatGPT” and re-evaluate the same prompt.
   → The optimized prompt reformats to markdown sections (·· Role, ·· Task, ·· Output Format).
   → This proves agent-specific formatting in real time.
10. (Optional vulnerability demo) Paste an injection attempt.
    → RED BANNER appears.
11. Close: “Evalio turns guesswork into production-ready, agent-optimized prompts.”
```

Tell them: “If the live LLM is slow, pivot to the Golden Path session. The seeded data already shows the Power Combo output. Set `X-Workspace-Id: demo-golden-path` in localStorage and load the session.”

---

### 4.5 `[SANKAR]` Final merge — LOCK

```bash
git add .
git commit -m "feat: Power Combo golden path, updated demo script"
git push origin feature/backend
# GitHub -> Compare & pull request -> Merge pull request
```

**Yell: “MAIN IS UPDATED — this is the FINAL demo build. Nobody push anything.”**

From this point, `main` is locked. No more merges.

---

## 5. Complete Endpoint Reference (Updated)

| Method | Path | Auth Header | Request Body | Response (200) | Failure Codes |
|--------|------|-------------|--------------|-----------------|---------------|
| GET | `/health` | none | — | `{status, service, version}` | none |
| POST | `/api/evaluate` | `X-Workspace-Id` | `EvaluateRequest` (+ optional `use_case`, `target_agent`) | `EvaluateResponse` | 400 `MISSING_WORKSPACE`, 422 `VALIDATION_ERROR`, 502/504 `LLM_*` |
| POST | `/api/scan` | `X-Workspace-Id` | `ScanRequest` | `ScanResponse` | 400 `MISSING_WORKSPACE`, 422, 502 `SCAN_ERROR` |
| GET | `/api/sessions` | `X-Workspace-Id` | — | `SessionSummary[]` | 400 `MISSING_WORKSPACE` |
| GET | `/api/sessions/{session_id}` | `X-Workspace-Id` | — | `SessionDetail` | 400, 404 `SESSION_NOT_FOUND` |
| DELETE | `/api/sessions/{session_id}` | `X-Workspace-Id` | — | 204 (no body) | 400, 404 `SESSION_NOT_FOUND` |
| **GET** | **`/api/use-cases`** | **none** | **—** | **`UseCaseInfo[]`** (8 objects) | **none** |
| **GET** | **`/api/agents`** | **none** | **—** | **`AgentInfo[]`** (6 objects) | **none** |

New endpoints are in **bold**. Modified endpoint (`/api/evaluate`) has updated request body description but remains backward-compatible.

---

## 6. File-by-File Responsibility Matrix (Updated)

All paths are relative to `backend/`. The **New/Modified** column indicates what changed in this extension.

| File | Original Owner | Current Owner | Git Branch | Status in This Extension |
|------|---------------|---------------|------------|------------------------|
| `app/main.py` | Sankar | Sankar | `feature/backend` | **Modified** — 2 new router includes |
| `app/core/config.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/database.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/models.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/schemas.py` | Sankar | Sankar | `feature/backend` | **Modified** — 2 optional fields on EvaluateRequest + 2 new response models |
| `app/dependencies.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/routes/evaluate.py` | Sankar | Sankar | `feature/backend` | **Modified** — system context composition (Step 2.5) |
| `app/routes/scan.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/routes/session.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `app/routes/use_cases.py` | — | **Sankar (new)** | `feature/backend` | **New file** |
| `app/routes/agents.py` | — | **Sankar (new)** | `feature/backend` | **New file** |
| `app/services/llm_service.py` | Sankar | Sankar | `feature/backend` | **Modified** — system_context pass-through |
| `app/services/ai_engine.py` | Sankar (mock) → Sreya (real) | **Sankar (now owns)** | `feature/backend` | **Modified** — system_context parameter on 2 functions |
| `app/services/use_case_registry.py` | — | **Sankar (new)** | `feature/backend` | **New file** |
| `app/services/agent_registry.py` | — | **Sankar (new)** | `feature/backend` | **New file** |
| `app/services/errors.py` | Sankar | Sankar | `feature/backend` | Untouched |
| `scripts/seed_golden_path.py` | Sankar | Sankar | `feature/backend` | **Modified** — Power Combo golden path |
| `docs/AGENT_STATE.md` | Agent | Agent | `feature/backend` | **Appended** — entries [7.1] through [9.1] |
| `.env` | Sankar | Sankar | never committed | Untouched |
| `../frontend/**` | Anamika / Vithul | Anamika / Vithul | `feature/frontend-*` | **Modified by them** — Context Bar, dropdown integrations |

---

## 7. Risk Register & Contingencies (Updated)

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| All v2.0 risks (see v2.0 Section 10) | — | — (still apply) |
| Adding fields to EvaluateRequest breaks Vithul’s existing frontend | **Low** | Fields are Optional with None defaults. Pydantic v2 treats missing JSON keys as None. Tested in Phase 5 Step 2.7. |
| Sreya’s ai_engine.py breaks when system_context is added | **Low** | Default parameter = "". Her existing code paths are untouched. Tested in Phase 6 Step 3.1. |
| LLM ignores the system_context and produces generic output | **Medium** | The system_context is PREPENDED to the system prompt, giving it highest priority. If the LLM still ignores it, the demo falls back to the Golden Path session which has pre-built Power Combo content. |
| Use-case/agent IDs from frontend don’t match registry keys | **Low** | Invalid IDs are silently ignored (returns None from getter functions). The evaluate route degrades to generic behavior, never errors. |
| Registry data is stale or wrong | **Medium** | Registries are Python dicts — update in seconds, no migration needed. Keep the registry modules open during development for quick edits. |
| Demo runs out of time showing both features | **Medium** | The Power Combo demo (Steps 3-8 of the demo script) takes ~2 minutes. The agent-switch demo (Step 9) is optional. Golden Path is the Plan B for any live failure. |
| Model switch in Graphify loses registry context | **High** | Every step has READ FIRST listing the registry files. AGENT_STATE.md records which steps are done. A cold model can rebuild from the instructions alone. |

---

## 8. Frequently Asked Questions (Feature-Specific)

**Q10. Why are use cases and agents in Python dicts instead of MongoDB collections?**
Hackathon speed. A MongoDB collection requires a Beanie model, seed scripts, migration logic, and query code. A Python dict requires one import. Post-hackathon, migrate to a `UseCase` and `Agent` Beanie document with an admin CRUD endpoint so you can add use cases without deploying code.

**Q11. Why not make use_case and target_agent required fields?**
Backward compatibility. Vithul’s frontend already sends evaluate requests without these fields. Making them required would break his integration and force a coordinated deploy. Optional fields with None defaults mean his existing code keeps working while he integrates the new dropdowns at his own pace.

**Q12. What happens if the user selects a use case but no agent (or vice versa)?**
The system works in all four combinations. If only a use case is selected, the optimizer produces domain-specific output with generic formatting. If only an agent is selected, the optimizer reformats for that agent with generic domain content. If both are selected, you get the Power Combo. If neither, you get v2.0 behavior. The UI is designed to encourage both selections (the Power Combo is the headline demo), but the backend handles all cases gracefully.

**Q13. Why prepend system_context instead of appending it?**
LLM attention is position-biased — instructions at the beginning of the system prompt receive more attention than those at the end. By prepending the use-case and agent context, we ensure the LLM prioritizes domain-specific and agent-specific formatting over the generic base instructions.

**Q14. Why doesn’t the vulnerability scanner use system_context?**
Prompt injection is domain-agnostic. An injection attempt like “Ignore all previous instructions” is equally dangerous whether the prompt is for image generation or backend development. Adding domain context to the scanner would slow it down without improving detection accuracy. The scanner’s 20-second timeout is already tight.

**Q15. Can we add more use cases or agents after the hackathon?**
Yes. That’s why the registry is in a dedicated module. To add a new use case: add one entry to `USE_CASE_REGISTRY`. To add a new agent: add one entry to `AGENT_REGISTRY`. The GET endpoints, the evaluate route, and the frontend dropdowns all read from the registry dynamically — no other code changes needed. Post-hackathon, migrate to database-backed registries with admin CRUD.

**Q16. What if the LLM formats the optimized prompt incorrectly for the target agent?**
The `formatting_rules` string in each agent’s registry entry explicitly instructs the LLM how to format. For example, Claude’s entry says “wrap the output in XML tags: `<role>`, `<instructions>`, `<constraints>`, `<output_format>`.” If the LLM still produces markdown instead, the system_context was too weak — strengthen the `formatting_rules` text in the registry. This is a tuning exercise, not a code change.

---

## 9. Glossary (Updated)

- All v2.0 glossary terms remain valid (see v2.0 Section 12).
- **Use-Case Registry** — A Python dictionary (`USE_CASE_REGISTRY`) mapping use-case IDs to their evaluation criteria, scorecard weights, and optimizer system prompt additions. Stored in `app/services/use_case_registry.py`. No database involved.
- **Agent Registry** — A Python dictionary (`AGENT_REGISTRY`) mapping agent IDs to their prompting styles, formatting rules, and strengths. Stored in `app/services/agent_registry.py`. No database involved.
- **System Context** — A composed string that combines use-case and agent metadata, passed to the LLM’s internal system prompt to produce domain-specific, agent-formatted output.
- **Power Combo** — The mode where both a use case and a target agent are selected. The optimizer produces output that is both domain-rich AND agent-formatted. This is Evalio’s WOW-factor feature for the SYNC 2026 demo.
- **Context Bar** — The UI component (designed by Anamika, integrated by Vithul) containing the Use Case and Target Agent dropdowns, positioned above the code editor.
- **Scorecard Weight Overrides** — Per-use-case adjustments to the Clarity/Constraints/Formatting weights in the scorecard. Backend development weights constraints higher; content writing weights formatting higher.

---

## 10. References

[1] PromptBuilder, “Best AI for Prompt Engineering 2026: Claude vs ChatGPT vs GPT-4o vs Gemini,” 2026. https://promptbuilder.cc/blog/best-ai-for-prompt-engineering-2026-claude-vs-gpt-4o-vs-gemini

[2] Y. Biziuk, “Differences in Prompting Techniques: Claude vs. GPT,” COXIT Blog, April 2025. https://medium.com/coxit/differences-in-prompting-techniques-claude-vs-gpt-0eaa835f7ad3

[3] The AI Corner, “Your 2026 Guide to Prompt Engineering: How to Get 10x Better Results,” 2026. https://www.the-ai-corner.com/p/your-2026-guide-to-prompt-engineering

[4] Morph, “ChatGPT vs Claude vs Gemini (June 2026),” 2026. https://www.morphllm.com/comparisons/chatgpt-vs-claude-vs-gemini

[5] Creator Economy, “ChatGPT vs Claude vs Gemini: The Best AI Model for Each Use Case in 2025,” June 2025. https://creatoreconomy.so/p/chatgpt-vs-claude-vs-gemini-the-best-ai-model-for-each-use-case-2025

[6] Improvado, “Claude vs ChatGPT vs Gemini vs DeepSeek: Which AI Is Actually Best in 2026?,” July 2026. https://improvado.io/blog/claude-vs-chatgpt-vs-gemini-vs-deepseek

[7] Anthropic Engineering, “Effective Context Engineering for AI Agents,” 2025. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

---

**End of Playbook.** This document extends the v2.0 playbook from Phase 5 onward. Execute top-to-bottom. The v2.0 playbook remains the authoritative reference for Phases 1–4. This document is the authoritative reference for Phases 5–7. Good luck at ASET.