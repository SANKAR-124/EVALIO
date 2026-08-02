"""
Static registry of use-case definitions for Evalio.

Each entry defines the evaluation focus, scorecard weight overrides, and
optimizer system prompt addition for that domain. Updated by Sankar only.
"""

from typing import Optional


USE_CASE_REGISTRY: dict[str, dict] = {

    # ──────────────────────────────────────────────
    # 1. Image Generation
    # ──────────────────────────────────────────────
    "image_gen": {
        "id": "image_gen",
        "label": "Image Generation",
        "icon": "🎨",
        "description": "Evaluate and optimize prompts for AI image generation models like DALL-E, Midjourney, and Stable Diffusion.",
        "evaluation_focus": [
            "Art style specificity and reference accuracy",
            "Composition, camera angle, and aspect ratio definition",
            "Lighting conditions and mood description",
            "Negative prompt coverage for unwanted elements",
            "Quality boosters and technical parameters",
            "Color palette definition and harmony",
        ],
        "scorecard_weight_overrides": {
            "clarity": 25,
            "constraints": 35,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for AI image generation (DALL-E, Midjourney, or Stable Diffusion).\n"
            "Rewrite the prompt to include ALL of the following visual elements:\n"
            "(a) Art style with a specific reference (e.g., 'Studio Ghibli watercolor', 'hyper-realistic digital painting', 'low-poly 3D render', 'pencil sketch').\n"
            "(b) Lighting and mood (e.g., 'golden hour rim lighting', 'dramatic chiaroscuro', 'soft diffused overcast').\n"
            "(c) Composition and camera perspective (e.g., 'wide-angle establishing shot', 'close-up portrait at eye level', \"bird's-eye view\").\n"
            "(d) Color palette (e.g., 'muted earth tones with teal accents', 'vibrant neon cyberpunk palette', 'monochrome with red highlights').\n"
            "(e) Quality and technical parameters (e.g., '8K, highly detailed, sharp focus', 'trending on ArtStation', aspect ratio like '16:9' or 'portrait 4:5').\n"
            "(f) Negative prompt listing elements to exclude (e.g., 'exclude: blurry, watermark, text, deformed hands, low quality').\n"
            "Format the output as a natural language visual description — do NOT use Midjourney-specific syntax (--) unless the original prompt already uses it."
        ),
    },

    # ──────────────────────────────────────────────
    # 2. Video Generation
    # ──────────────────────────────────────────────
    "video_gen": {
        "id": "video_gen",
        "label": "Video Generation",
        "icon": "🎬",
        "description": "Evaluate and optimize prompts for AI video generation models like Sora, Runway, Pika, and Kling.",
        "evaluation_focus": [
            "Camera movement type, speed, and direction specification",
            "Temporal progression and scene evolution clarity",
            "Subject motion and action specificity",
            "Environment and setting description",
            "Lighting changes over the clip duration",
            "Aspect ratio and duration specification",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 30,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for AI video generation (Sora, Runway, Pika, or Kling).\n"
            "Rewrite the prompt to specify ALL of the following:\n"
            "(a) Environment and setting with visual details (location, weather, time of day, atmosphere).\n"
            "(b) Subject and their specific motion (what they do, speed, direction, physical actions).\n"
            "(c) Camera movement using precise terminology (pan, tilt, dolly, crane, tracking shot, orbit) with speed (slow, medium, fast).\n"
            "(d) How the scene evolves from start to end (temporal progression — what changes over the clip duration).\n"
            "(e) Lighting and how it shifts during the clip (e.g., 'sunrise transitioning from cool blue to warm golden').\n"
            "(f) Technical parameters: aspect ratio (16:9, 9:16, 1:1), clip duration (e.g., '4-second clip'), pacing (real-time, slow-motion, time-lapse).\n"
            "Focus on a single coherent scene — multi-scene prompts produce unreliable results in current video models."
        ),
    },

    # ──────────────────────────────────────────────
    # 3. Backend Development
    # ──────────────────────────────────────────────
    "backend_dev": {
        "id": "backend_dev",
        "label": "Backend Development",
        "icon": "⚙️",
        "description": "Evaluate and optimize prompts for backend engineering tasks including API design, database architecture, and server-side logic.",
        "evaluation_focus": [
            "Tech stack, framework, and runtime specification",
            "API endpoint definition (method, path, schema)",
            "Authentication and authorization strategy",
            "Error handling with specific HTTP status codes",
            "Database schema, ORM patterns, and query design",
            "Security constraints and input validation",
            "Observability (logging, monitoring, error tracking)",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for a backend development task.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Tech stack with specific versions (language, framework, runtime, database).\n"
            "(b) API endpoint definitions: HTTP method, path, request body schema with types, query parameters, and expected response schema.\n"
            "(c) Authentication and authorization pattern (JWT, OAuth2, API keys, session-based) with specifics about token handling and protected routes.\n"
            "(d) Input validation rules for every field (type, range, required/optional, sanitization).\n"
            "(e) Error handling: map each failure mode to a specific HTTP status code with error response schema.\n"
            "(f) Database design: schema, key relationships, ORM patterns, indexing strategy.\n"
            "(g) Security and infrastructure: CORS, rate limiting, SQL injection prevention, logging strategy, and environment configuration.\n"
            "Prioritize (a) and (b) — without a clear stack and endpoint definition, everything else is context-less."
        ),
    },

    # ──────────────────────────────────────────────
    # 4. UI / Frontend Development
    # ──────────────────────────────────────────────
    "ui_dev": {
        "id": "ui_dev",
        "label": "UI / Frontend Development",
        "icon": "🖥️",
        "description": "Evaluate and optimize prompts for frontend engineering including component design, responsive layouts, and user interaction patterns.",
        "evaluation_focus": [
            "Component hierarchy and prop interface definitions",
            "Responsive design breakpoints and layout behavior",
            "Accessibility (semantic HTML, ARIA, keyboard navigation)",
            "State management pattern and data flow",
            "All interaction states (hover, focus, loading, error, empty)",
            "Theme support (light/dark mode) and design tokens",
            "Performance considerations (lazy loading, code splitting)",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 30,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for a frontend/UI development task.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Component tree with parent-child relationships and prop interfaces (props name, type, required/optional, description).\n"
            "(b) Responsive breakpoints with layout behavior at each: mobile (≤768px), tablet (≤1024px), desktop (>1024px).\n"
            "(c) Accessibility requirements: semantic HTML elements, ARIA labels, keyboard navigation flow, screen reader compatibility.\n"
            "(d) State management: which state is local, which is shared, and the data flow direction (props down, events up).\n"
            "(e) All interaction states the component must handle: default, hover, focus, active, loading, error, disabled, empty/skeleton.\n"
            "(f) Styling methodology and theme support: design tokens, light/dark mode handling, CSS approach.\n"
            "(g) Performance requirements: lazy loading, code splitting, image optimization, memoization needs.\n"
            "Do NOT assume a specific framework (React, Vue, Svelte) unless the user's original prompt mentions one — keep framework references generic."
        ),
    },

    # ──────────────────────────────────────────────
    # 5. Data Analysis
    # ──────────────────────────────────────────────
    "data_analysis": {
        "id": "data_analysis",
        "label": "Data Analysis",
        "icon": "📊",
        "description": "Evaluate and optimize prompts for data analysis workflows including statistical methods, visualization, and insight extraction.",
        "evaluation_focus": [
            "Input data format, schema, and sample structure",
            "Statistical methods and analytical approach",
            "Output deliverables (tables, charts, metrics, insights)",
            "Edge case handling (missing data, outliers, nulls)",
            "Visualization types and chart selection rationale",
            "Business context, KPIs, and actionability of insights",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for a data analysis task.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Input data specification: column names, data types, expected ranges, a few sample rows, and total dataset size.\n"
            "(b) Analytical approach: which statistical methods to apply and WHY (e.g., 'use Pearson correlation because we need linear relationship strength').\n"
            "(c) Output deliverables: exact list of what to produce (summary statistics table, specific chart types with axis definitions, written insights, metric calculations).\n"
            "(d) Edge case strategy: how to handle missing values (impute, drop, flag), how to detect and treat outliers, null handling approach.\n"
            "(e) Visualization specifications: chart type for each analysis question, axis labels, legend placement, and color encoding logic.\n"
            "(f) Business context: what decision the analysis informs, KPI definitions with target thresholds, and what constitutes a meaningful vs. noise-level result.\n"
            "Include preferred tools/libraries only if the user's original prompt mentions them."
        ),
    },

    # ──────────────────────────────────────────────
    # 6. Content Writing
    # ──────────────────────────────────────────────
    "content_writing": {
        "id": "content_writing",
        "label": "Content Writing",
        "icon": "✍️",
        "description": "Evaluate and optimize prompts for professional content creation including blogs, marketing copy, technical writing, and SEO-optimized articles.",
        "evaluation_focus": [
            "Content type and format definition",
            "Target audience persona and reading level",
            "Tone, voice, and brand consistency guidelines",
            "Content structure and heading hierarchy",
            "SEO keywords and placement strategy",
            "Word count, CTA, and formatting constraints",
        ],
        "scorecard_weight_overrides": {
            "clarity": 35,
            "constraints": 25,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for content creation.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Content type with specific format (blog post, landing page, email newsletter, social media thread, technical documentation, whitepaper).\n"
            "(b) Audience persona: who they are, their expertise level, what they care about, and their reading level.\n"
            "(c) Tone and voice: formal/informal, authoritative/conversational, first/third person, and any brand voice references.\n"
            "(d) Content structure: heading hierarchy (H1, H2, H3), intro hook strategy, body section breakdown, conclusion type.\n"
            "(e) SEO keywords: primary keyword, 3-5 secondary keywords, and where each must appear (title, first paragraph, at least 2 headings, meta description).\n"
            "(f) Constraints: word count with acceptable range, call-to-action with placement and desired behavior, formatting rules (bullet usage, link requirements, image placeholders).\n"
            "Differentiate the content from competitors — if the user mentions a competitor or alternative, include a 'unique angle' instruction."
        ),
    },

    # ──────────────────────────────────────────────
    # 7. Code Review
    # ──────────────────────────────────────────────
    "code_review": {
        "id": "code_review",
        "label": "Code Review",
        "icon": "🔍",
        "description": "Evaluate and optimize prompts for automated code review focusing on security vulnerabilities, performance issues, and maintainability.",
        "evaluation_focus": [
            "Target language and framework specification",
            "Security vulnerability categories (OWASP Top 10)",
            "Performance anti-patterns and bottleneck detection",
            "Severity classification with clear criteria",
            "Report format with file/line references",
            "Remediation suggestions with before/after examples",
        ],
        "scorecard_weight_overrides": {
            "clarity": 25,
            "constraints": 40,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for automated code review.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Target language, framework, and version (e.g., 'Python 3.11 with FastAPI', 'TypeScript with Next.js 15'). Without this, the review cannot check framework-specific anti-patterns.\n"
            "(b) Security categories to scan: specify which OWASP Top 10 categories are relevant (e.g., injection, XSS, CSRF, broken authentication, insecure deserialization). Not all 10 apply to every codebase.\n"
            "(c) Performance checks: specify which anti-patterns to look for (N+1 queries, memory leaks, unnecessary re-renders, blocking I/O, algorithmic complexity concerns).\n"
            "(d) Severity classification with explicit criteria: Critical (exploitable, data breach risk), High (exploitable with effort, logic errors), Medium (best practice violation, maintainability), Low (style, naming, readability).\n"
            "(e) Report format: require file path, line number range, severity tag, issue description, and a before/after code snippet showing the fix.\n"
            "(f) Scope boundaries: what to review (only changed files? entire module? specific directories?) and what to exclude (tests, generated code, third-party)."
        ),
    },

    # ──────────────────────────────────────────────
    # 8. Machine Learning
    # ──────────────────────────────────────────────
    "machine_learning": {
        "id": "machine_learning",
        "label": "Machine Learning",
        "icon": "🤖",
        "description": "Evaluate and optimize prompts for machine learning workflows including model selection, training pipelines, and deployment strategies.",
        "evaluation_focus": [
            "Problem type, task classification, and objective function",
            "Data requirements, schema, and preprocessing pipeline",
            "Model selection rationale and architecture justification",
            "Evaluation metrics, validation strategy, and baselines",
            "Hyperparameter constraints and search strategy",
            "Training pipeline, checkpointing, and early stopping",
            "Deployment constraints and serving requirements",
            "Reproducibility and experiment tracking",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "The user is writing a prompt for a machine learning task.\n"
            "Rewrite the prompt to include ALL of the following:\n"
            "(a) Problem formulation: task type (classification, regression, clustering, ranking, generation), explicit objective function, and what 'success' looks like.\n"
            "(b) Data specification: schema, volume, labeling strategy, train/val/test split ratios, and preprocessing steps (normalization, encoding, augmentation).\n"
            "(c) Model selection: which architecture and WHY it fits this problem over alternatives (e.g., 'Transformer over LSTM because of long-range dependencies').\n"
            "(d) Evaluation plan: primary metric for optimization, secondary monitoring metrics, baseline to beat, and validation strategy (k-fold, time-series split, etc.).\n"
            "(e) Hyperparameter search: key parameters to tune, value ranges, and search strategy (grid, random, Bayesian).\n"
            "(f) Training pipeline: preprocessing steps, feature engineering, training loop configuration, checkpointing, and early stopping criteria.\n"
            "(g) Deployment requirements: latency budget, throughput target, hardware (CPU/GPU/edge), model format (ONNX, TensorRT, TorchScript), and post-deployment monitoring plan.\n"
            "(h) Reproducibility: random seeds, dependency pinning, experiment tracking tool (MLflow, W&B, etc.), and artifact versioning.\n"
            "If the task involves personal data or high-stakes decisions, include a bias and fairness evaluation requirement."
        ),
    },
}


def get_use_case(use_case_id: str) -> Optional[dict]:
    """
    Returns the full use-case entry for the given ID, or None if not found.
    Routes should call this function rather than accessing USE_CASE_REGISTRY directly.
    """
    return USE_CASE_REGISTRY.get(use_case_id)


def list_use_cases() -> list[dict]:
    """
    Returns all use-case entries as a list, stripped of internal-only fields.
    The frontend only needs id, label, icon, description, and evaluation_focus.
    """
    public_keys = {"id", "label", "icon", "description", "evaluation_focus"}
    return [
        {k: v for k, v in entry.items() if k in public_keys}
        for entry in USE_CASE_REGISTRY.values()
    ]
