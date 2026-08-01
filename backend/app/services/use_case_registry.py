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
            "Composition and camera angle definition",
            "Lighting conditions and mood description",
            "Negative prompt coverage for unwanted elements",
            "Quality boosters and resolution specification",
            "Color palette definition and harmony",
        ],
        "scorecard_weight_overrides": {
            "clarity": 25,
            "constraints": 35,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "You are an expert image-prompt engineer specializing in DALL-E, Midjourney, and Stable Diffusion.\n"
            "When rewriting the user's prompt, you MUST produce a dense, comma-separated visual description that includes ALL of the following elements:\n"
            "(a) A specific art style reference (e.g., 'in the style of Studio Ghibli watercolor', 'hyper-realistic digital painting', 'low-poly 3D render').\n"
            "(b) Lighting and mood (e.g., 'golden hour rim lighting', 'dramatic chiaroscuro', 'soft diffused overcast').\n"
            "(c) Composition and camera perspective (e.g., 'wide-angle establishing shot', 'close-up portrait at eye level', 'bird's-eye view').\n"
            "(d) A defined color palette (e.g., 'muted earth tones with teal accents', 'vibrant neon cyberpunk palette').\n"
            "(e) Quality boosters (e.g., '8K resolution, highly detailed, sharp focus, trending on ArtStation').\n"
            "(f) A negative prompt section prefixed with '--no' listing elements to exclude (e.g., '--no blurry, watermark, text, low quality, deformed hands').\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten image prompt as a single dense description."
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
            "Camera movement type and speed specification",
            "Temporal progression and pacing clarity",
            "Scene transition descriptions for multi-scene prompts",
            "Subject motion and action description",
            "Lighting changes and evolution over time",
            "Output duration and aspect ratio hints",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 30,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "You are an expert video-prompt engineer specializing in Sora, Runway, Pika, and Kling.\n"
            "When rewriting the user's prompt, you MUST produce a structured video generation prompt that specifies ALL of the following:\n"
            "(a) Camera movement with precise terminology (pan left/right, tilt up/down, dolly in/out, crane shot, tracking shot) and speed (slow, medium, fast).\n"
            "(b) Temporal progression describing how the scene evolves from start to end.\n"
            "(c) Subject motion with specific actions, speed, and directionality.\n"
            "(d) Lighting evolution describing how light changes throughout the clip (e.g., 'sunrise transitioning from cool blue to warm golden').\n"
            "(e) Scene transitions if multi-scene (cut, dissolve, whip pan, match cut).\n"
            "(f) Duration and pacing hints (e.g., '4-second clip', 'slow-motion at 0.5x speed').\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten video prompt."
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
            "Tech stack and framework specification",
            "Authentication and authorization strategy",
            "Error handling patterns and HTTP status codes",
            "Database schema and ORM/query patterns",
            "Input validation and sanitization rules",
            "Security constraints and threat mitigation",
            "API versioning and deprecation strategy",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "You are a senior backend architect with deep expertise in API design, distributed systems, and production-grade server engineering.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive backend specification that addresses ALL of the following:\n"
            "(a) Tech stack and framework (language, framework version, runtime).\n"
            "(b) Authentication/authorization pattern (JWT, OAuth2, API keys, RBAC).\n"
            "(c) Request/response schema with explicit input validation rules (types, ranges, required fields).\n"
            "(d) Error handling strategy with specific HTTP status codes for each failure mode.\n"
            "(e) Database patterns (schema design, ORM usage, migrations, indexing strategy).\n"
            "(f) Security constraints (CORS, rate limiting, input sanitization, SQL injection prevention).\n"
            "(g) Rate limiting and throttling configuration.\n"
            "(h) Logging, monitoring, and observability requirements.\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten backend engineering prompt."
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
            "Component hierarchy and composition structure",
            "Responsive design breakpoints and behavior",
            "Accessibility compliance (WCAG 2.1 / ARIA attributes)",
            "State management pattern and data flow",
            "Styling approach and design system adherence",
            "Interaction states (hover, focus, loading, error, empty)",
            "Performance considerations (lazy loading, code splitting)",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 30,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "You are a senior frontend engineer and UI architect with expertise in modern component-driven frameworks.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive frontend specification that addresses ALL of the following:\n"
            "(a) Component tree structure with parent-child relationships and prop interfaces.\n"
            "(b) Responsive design breakpoints (mobile ≤768px, tablet ≤1024px, desktop >1024px) with layout behavior at each.\n"
            "(c) Accessibility requirements (semantic HTML, ARIA labels, keyboard navigation, screen reader compatibility).\n"
            "(d) State management pattern (local state, context, Redux/Zustand, server state with React Query).\n"
            "(e) Styling methodology (CSS modules, Tailwind, styled-components) with design token references.\n"
            "(f) All interaction states: default, hover, focus, active, loading, error, disabled, empty/skeleton.\n"
            "(g) Performance optimizations: lazy loading, code splitting, image optimization, memoization.\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten frontend engineering prompt."
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
            "Expected input data format and schema definition",
            "Statistical methods and analytical approach",
            "Output format specification (tables, charts, metrics)",
            "Edge case handling (missing data, outliers, nulls)",
            "Visualization types and chart selection rationale",
            "Business context and KPI definitions",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "You are a senior data analyst with expertise in statistical methods, data visualization, and business intelligence.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive data analysis specification that addresses ALL of the following:\n"
            "(a) Input data format with explicit schema (column names, data types, expected ranges, sample rows).\n"
            "(b) Statistical methods to apply (descriptive stats, hypothesis tests, regression, clustering) with justification.\n"
            "(c) Output format specifying exact deliverables (summary tables, charts, metric dashboards, written insights).\n"
            "(d) Edge case handling: strategy for missing values (impute, drop, flag), outlier detection method, and null handling.\n"
            "(e) Visualization types with specific chart recommendations (bar, line, scatter, heatmap) and axis definitions.\n"
            "(f) KPI definitions tied to business objectives with target thresholds.\n"
            "(g) Reproducibility requirements (random seeds, version pinning, notebook structure).\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten data analysis prompt."
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
            "Target audience persona and demographic clarity",
            "Tone, voice, and brand consistency guidelines",
            "Content structure and outline specification",
            "SEO keywords and strategic placement instructions",
            "Word count and length constraints",
            "Call-to-action definition and placement",
            "Formatting rules (headings, bullets, links, media)",
        ],
        "scorecard_weight_overrides": {
            "clarity": 35,
            "constraints": 25,
            "formatting": 40,
        },
        "optimizer_system_addition": (
            "You are a professional content strategist with expertise in SEO, copywriting, and editorial best practices.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive content brief that addresses ALL of the following:\n"
            "(a) Audience persona with demographics, pain points, and reading level.\n"
            "(b) Tone and voice guidelines (formal/informal, authoritative/conversational, brand voice references).\n"
            "(c) Content structure with a detailed outline (H1, H2, H3 hierarchy, intro hook, body sections, conclusion).\n"
            "(d) SEO keywords (primary keyword, 3-5 secondary keywords) with placement instructions (title, meta description, first paragraph, headings).\n"
            "(e) Word count target with acceptable range.\n"
            "(f) Call-to-action with specific text, placement, and desired user behavior.\n"
            "(g) Formatting rules: heading hierarchy, bullet point usage, internal/external link requirements, image/media placeholders.\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten content writing prompt."
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
            "Security vulnerability categories (OWASP Top 10)",
            "Performance anti-patterns and bottleneck detection",
            "Code style, readability, and maintainability criteria",
            "Severity classification system (critical, high, medium, low)",
            "False positive handling and confidence scoring",
            "Remediation suggestions with code examples",
        ],
        "scorecard_weight_overrides": {
            "clarity": 25,
            "constraints": 40,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "You are a senior security engineer and code reviewer with expertise in OWASP, secure coding practices, and performance optimization.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive code review specification that addresses ALL of the following:\n"
            "(a) Vulnerability categories to check (injection, XSS, CSRF, insecure deserialization, broken auth, security misconfiguration).\n"
            "(b) Performance checks (N+1 queries, unnecessary allocations, blocking I/O, memory leaks, algorithmic complexity).\n"
            "(c) Code style and maintainability criteria (naming conventions, function length, cyclomatic complexity, DRY violations).\n"
            "(d) Severity classification: Critical (exploitable now), High (exploitable with effort), Medium (best practice violation), Low (style/readability).\n"
            "(e) Report format with file path, line number references, issue description, and severity tag.\n"
            "(f) Remediation suggestions with before/after code snippets for each finding.\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten code review prompt."
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
            "Problem formulation and task type classification",
            "Data requirements and preprocessing pipeline",
            "Model selection rationale and architecture choice",
            "Evaluation metrics and validation strategy",
            "Hyperparameter constraints and search space",
            "Deployment and serving requirements",
            "Reproducibility and experiment tracking",
        ],
        "scorecard_weight_overrides": {
            "clarity": 30,
            "constraints": 35,
            "formatting": 35,
        },
        "optimizer_system_addition": (
            "You are a senior ML engineer with expertise in end-to-end machine learning pipelines, from data preprocessing to production deployment.\n"
            "When rewriting the user's prompt, you MUST produce a comprehensive ML specification that addresses ALL of the following:\n"
            "(a) Problem type and formulation (classification, regression, clustering, ranking, generative) with explicit objective function.\n"
            "(b) Data requirements: expected schema, volume, labeling strategy, train/val/test split ratios, augmentation techniques.\n"
            "(c) Model selection criteria with justification (why this architecture over alternatives).\n"
            "(d) Evaluation metrics (primary metric for optimization, secondary metrics for monitoring, baseline to beat).\n"
            "(e) Hyperparameter search space with ranges and search strategy (grid, random, Bayesian).\n"
            "(f) Training pipeline steps: preprocessing, feature engineering, training loop, checkpointing, early stopping criteria.\n"
            "(g) Deployment constraints: latency budget, throughput requirements, hardware target (CPU/GPU/edge), model format (ONNX, TensorRT).\n"
            "(h) Reproducibility requirements: random seeds, dependency pinning, experiment tracking (MLflow/W&B), artifact versioning.\n"
            "Do NOT output explanations or markdown. Output ONLY the rewritten machine learning prompt."
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
