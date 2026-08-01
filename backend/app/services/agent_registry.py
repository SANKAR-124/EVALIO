"""
Static registry of supported LLM agents and their prompting best practices.

Each entry defines the agent's preferred prompting style, formatting rules,
and strengths. Updated by Sankar only.
"""

from typing import Optional


AGENT_REGISTRY: dict[str, dict] = {

    # ──────────────────────────────────────────────
    # 1. Claude (Anthropic)
    # ──────────────────────────────────────────────
    "claude": {
        "id": "claude",
        "label": "Claude",
        "provider": "Anthropic",
        "icon": "🟣",
        "strengths": [
            "Exceptional instruction-following with complex, multi-step tasks",
            "Strong performance with structured XML-based prompts",
            "Reliable handling of very long prompts and documents",
            "Nuanced reasoning and careful adherence to constraints",
            "High-quality code generation with detailed explanations",
        ],
        "prompting_style": "xml_tags",
        "system_prompt_tips": [
            "Use XML tags (<role>, <instructions>, <constraints>, <output_format>) to structure your prompt — Claude's instruction-following improves significantly with explicit hierarchical structure.",
            "Provide a detailed role definition at the start to set context and persona.",
            "Break complex tasks into numbered sections or sub-tasks within XML tags.",
            "Claude reliably follows very long prompts — don't be afraid of length when precision matters.",
            "Use <example> tags with input/output pairs for few-shot demonstrations.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt using XML tags for maximum Claude compatibility.\n"
            "Wrap the output in the following hierarchical structure:\n"
            "  <role>Define the expert persona and domain expertise</role>\n"
            "  <instructions>\n"
            "    <step>Step 1: First major task requirement</step>\n"
            "    <step>Step 2: Second major task requirement</step>\n"
            "    ... (as many steps as needed)\n"
            "  </instructions>\n"
            "  <constraints>\n"
            "    List all boundaries, rules, and things to avoid\n"
            "  </constraints>\n"
            "  <output_format>\n"
            "    Specify exact output structure, fields, and formatting expectations\n"
            "  </output_format>\n"
            "  <examples>\n"
            "    <example>\n"
            "      <input>Sample input</input>\n"
            "      <output>Expected output</output>\n"
            "    </example>\n"
            "  </examples>\n"
            "Use nested tags for sub-sections. Claude's instruction-following is strongest when structure is explicit and hierarchical."
        ),
        "context_window": "200K tokens",
    },

    # ──────────────────────────────────────────────
    # 2. ChatGPT / GPT (OpenAI)
    # ──────────────────────────────────────────────
    "chatgpt": {
        "id": "chatgpt",
        "label": "ChatGPT / GPT",
        "provider": "OpenAI",
        "icon": "🟢",
        "strengths": [
            "Excellent at following markdown-structured prompts",
            "Strong structured data output (JSON, tables, schemas)",
            "Reliable few-shot learning with 2-3 examples",
            "Versatile across creative, analytical, and coding tasks",
            "Good at respecting explicit negative instructions (what NOT to do)",
        ],
        "prompting_style": "markdown_sections",
        "system_prompt_tips": [
            "Use markdown headers (## Role, ## Task, ## Output Format) to organize your prompt into clear sections.",
            "Provide an explicit output schema when you need structured data — GPT excels at producing valid JSON when the schema is spelled out.",
            "Include 2-3 few-shot examples showing the exact input-output pattern you expect.",
            "Be explicit about what NOT to do — GPT responds well to negative constraints stated clearly.",
            "Use **bold** emphasis for critical rules and constraints that must not be violated.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt using markdown headers and sub-headers for maximum GPT compatibility.\n"
            "Use the following section structure:\n"
            "  ## Role\n"
            "  Define the expert persona.\n\n"
            "  ## Task\n"
            "  Describe the primary objective clearly.\n\n"
            "  ## Constraints\n"
            "  List all rules, boundaries, and negative constraints. Use **bold** for critical rules.\n\n"
            "  ## Output Format\n"
            "  Specify the exact output structure. If JSON, provide the schema. If prose, describe the sections.\n\n"
            "  ## Examples\n"
            "  Include 2-3 input/output examples.\n\n"
            "ChatGPT excels when the output format is specified in markdown and key rules are bolded for emphasis."
        ),
        "context_window": "128K tokens",
    },

    # ──────────────────────────────────────────────
    # 3. Gemini (Google)
    # ──────────────────────────────────────────────
    "gemini": {
        "id": "gemini",
        "label": "Gemini",
        "provider": "Google",
        "icon": "🔵",
        "strengths": [
            "Massive 2M token context window for large document processing",
            "Strong multimodal capabilities (text, image, video, audio)",
            "Excellent grounding for factual accuracy",
            "Efficient with concise, direct system prompts",
            "Native support for structured output and function calling",
        ],
        "prompting_style": "concise_direct",
        "system_prompt_tips": [
            "Keep system prompts concise and direct — Gemini's 2M context means brevity in the system prompt, not length.",
            "Specify output structure explicitly using bullet points or short format descriptions.",
            "Leverage grounding features for factual accuracy when available.",
            "Avoid overly long or repetitive system prompts — Gemini processes efficiently with clear, compact instructions.",
            "Use short paragraphs and bullet points instead of deeply nested structures.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt to be clean, concise, and direct for maximum Gemini compatibility.\n"
            "Use short paragraphs and bullet points. Avoid excessive nesting or verbose XML structures.\n"
            "Structure as:\n"
            "  1. Role: One sentence defining the persona.\n"
            "  2. Task: Clear, direct statement of what to do.\n"
            "  3. Key rules:\n"
            "     - Rule 1\n"
            "     - Rule 2\n"
            "     - Rule 3\n"
            "  4. Output: Specify the exact format in one concise block.\n\n"
            "Gemini's massive context window means the SYSTEM prompt should be tight and efficient. "
            "Focus on clear, direct instructions rather than elaborate structural scaffolding."
        ),
        "context_window": "2M tokens",
    },

    # ──────────────────────────────────────────────
    # 4. LLaMA (Meta)
    # ──────────────────────────────────────────────
    "llama": {
        "id": "llama",
        "label": "LLaMA",
        "provider": "Meta",
        "icon": "🦙",
        "strengths": [
            "Strong open-source model with flexible deployment options",
            "Good performance with explicit delimiters and boundary markers",
            "Benefits from redundancy in critical constraints",
            "Effective with few-shot examples (3-5 recommended)",
            "Competitive reasoning with explicit step-by-step instructions",
        ],
        "prompting_style": "explicit_delimiters",
        "system_prompt_tips": [
            "Use explicit delimiters (triple backticks, ###, ---) to clearly separate sections of your prompt.",
            "Provide very explicit formatting rules — LLaMA benefits from being told exactly how to structure output.",
            "Include 3-5 few-shot examples to establish the expected pattern reliably.",
            "State critical constraints clearly AND repeat them at the end of the prompt for emphasis.",
            "Use boundary markers between role definition, task, constraints, and output format.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt using clear section delimiters for maximum LLaMA compatibility.\n"
            "Use the following structure with explicit boundary markers:\n"
            "  ### ROLE ###\n"
            "  Define the expert persona.\n\n"
            "  ---\n\n"
            "  ### TASK ###\n"
            "  Describe the objective.\n\n"
            "  ---\n\n"
            "  ### CONSTRAINTS ###\n"
            "  List all rules and boundaries. Repeat critical constraints.\n\n"
            "  ---\n\n"
            "  ### OUTPUT FORMAT ###\n"
            "  Specify exact output structure.\n\n"
            "  ---\n\n"
            "  ### EXAMPLES ###\n"
            "  Provide 3-5 input/output examples enclosed in triple backticks.\n\n"
            "  ---\n\n"
            "  ### REMINDER ###\n"
            "  Repeat the most critical constraints here.\n\n"
            "LLaMA benefits from redundancy and explicit boundary markers between sections."
        ),
        "context_window": "128K tokens",
    },

    # ──────────────────────────────────────────────
    # 5. DeepSeek
    # ──────────────────────────────────────────────
    "deepseek": {
        "id": "deepseek",
        "label": "DeepSeek",
        "provider": "DeepSeek",
        "icon": "🐋",
        "strengths": [
            "Exceptional chain-of-thought reasoning capabilities",
            "Strong performance on complex multi-step problems",
            "Excellent at breaking down problems into intermediate steps",
            "Competitive coding and mathematical reasoning",
            "Effective with explicit reasoning chain requests",
        ],
        "prompting_style": "chain_of_thought",
        "system_prompt_tips": [
            "Use 'think step by step' reasoning patterns — DeepSeek performs best when chain-of-thought is explicitly requested.",
            "Break complex problems into intermediate steps with clear checkpoints.",
            "Ask for explicit reasoning chains before the final answer.",
            "State constraints at both the start and end of the prompt to reinforce boundaries.",
            "Structure prompts as: constraints → reasoning instructions → output format.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt to leverage chain-of-thought reasoning for maximum DeepSeek compatibility.\n"
            "Structure the prompt in three distinct phases:\n\n"
            "  Phase 1 — Role and Constraints:\n"
            "  Define the persona and list all constraints upfront.\n\n"
            "  Phase 2 — Step-by-Step Thinking Instructions:\n"
            "  Include explicit reasoning directives:\n"
            "    'Think step by step before answering.'\n"
            "    'Break this problem into the following sub-steps:'\n"
            "    '  Step 1: [first reasoning step]'\n"
            "    '  Step 2: [second reasoning step]'\n"
            "    '  Step 3: [synthesis and conclusion]'\n\n"
            "  Phase 3 — Output Format:\n"
            "  Specify the exact deliverable format.\n"
            "  Restate the most critical constraints.\n\n"
            "DeepSeek performs best when chain-of-thought reasoning is explicitly structured into the prompt."
        ),
        "context_window": "128K tokens",
    },

    # ──────────────────────────────────────────────
    # 6. Mistral (Mistral AI)
    # ──────────────────────────────────────────────
    "mistral": {
        "id": "mistral",
        "label": "Mistral",
        "provider": "Mistral AI",
        "icon": "🌀",
        "strengths": [
            "Highly efficient with compact, well-structured prompts",
            "Strong performance with concise XML-like tag structures",
            "Excellent cost-to-performance ratio",
            "Fast inference speed suitable for real-time applications",
            "Good multilingual support across European languages",
        ],
        "prompting_style": "concise_xml",
        "system_prompt_tips": [
            "Keep system prompts concise — Mistral values efficiency and every word should earn its place.",
            "Use XML-like structures for complex tasks, but keep them shorter than for Claude.",
            "Be direct and explicit about the expected output format.",
            "Avoid unnecessary context, preambles, or verbose explanations in the system prompt.",
            "Front-load the most important instructions — Mistral's attention is strongest at the prompt start.",
        ],
        "formatting_rules": (
            "Restructure the optimized prompt to be compact with XML-like tags for maximum Mistral compatibility.\n"
            "Use a streamlined structure:\n"
            "  <role>One-sentence persona definition</role>\n"
            "  <task>Clear, direct task statement</task>\n"
            "  <rules>\n"
            "    - Critical constraint 1\n"
            "    - Critical constraint 2\n"
            "    - Critical constraint 3\n"
            "  </rules>\n"
            "  <format>Exact output specification</format>\n\n"
            "Keep it shorter than Claude's XML structure. Mistral values efficiency — "
            "every word should earn its place. Avoid redundancy and verbose explanations."
        ),
        "context_window": "128K tokens",
    },
}


def get_agent(agent_id: str) -> Optional[dict]:
    """
    Returns the full agent entry for the given ID, or None if not found.
    Routes should call this function rather than accessing AGENT_REGISTRY directly.
    """
    return AGENT_REGISTRY.get(agent_id)


def list_agents() -> list[dict]:
    """
    Returns all agent entries as a list, stripped of internal-only fields.
    The frontend needs: id, label, provider, icon, strengths, prompting_style,
    system_prompt_tips, context_window.
    """
    return [
        {k: v for k, v in entry.items() if k != "formatting_rules"}
        for entry in AGENT_REGISTRY.values()
    ]
