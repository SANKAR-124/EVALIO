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
            "Claude performs best when instructions are wrapped in XML tags that create an explicit hierarchy — this is its strongest differentiator.",
            "Long, detailed prompts improve Claude's output rather than degrading it — never truncate for brevity.",
            "Claude reliably distinguishes between <instructions>, <constraints>, and <output_format> when they are in separate tags.",
            "Few-shot examples inside <example> tags with <input> and <output> sub-tags produce highly consistent results.",
            "Claude follows negative constraints ('do NOT do X') with high fidelity when placed in a dedicated <constraints> tag.",
        ],
        "formatting_rules": (
            "When optimizing for Claude, restructure the prompt using XML tags.\n"
            "Use this hierarchical template:\n\n"
            "<role>One-sentence expert persona definition</role>\n\n"
            "<instructions>\n"
            "  <step>First task requirement</step>\n"
            "  <step>Second task requirement</step>\n"
            "</instructions>\n\n"
            "<constraints>\n"
            "  - Rule or boundary 1\n"
            "  - Rule or boundary 2\n"
            "</constraints>\n\n"
            "<output_format>\n"
            "  Exact output structure specification\n"
            "</output_format>\n\n"
            "Only include <examples> if the original prompt contained examples or the task pattern is non-obvious.\n"
            "When including examples, use: <example><input>...</input><output>...</output></example>\n"
            "Claude's instruction-following is strongest with explicit, hierarchical XML structure."
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
            "GPT performs best with clear markdown section headers (## Role, ## Task, ## Constraints, ## Output Format) that segment the prompt into distinct zones.",
            "When JSON output is needed, provide the exact schema with field names, types, and descriptions — GPT produces valid JSON with high reliability when the schema is explicit.",
            "2-3 few-shot examples are sufficient; more than 3 rarely improves output and wastes tokens.",
            "GPT responds strongly to negative constraints stated as explicit 'Do NOT...' rules — place these in a dedicated ## Constraints section.",
            "Use **bold** for non-negotiable rules. GPT weights bolded text more heavily in its instruction-following.",
        ],
        "formatting_rules": (
            "When optimizing for ChatGPT, restructure the prompt using markdown headers.\n"
            "Use this section template:\n\n"
            "## Role\n"
            "Define the expert persona.\n\n"
            "## Task\n"
            "State the exact objective in one clear paragraph.\n\n"
            "## Constraints\n"
            "- Rule 1\n"
            "- **Non-negotiable rule (bold this)**\n"
            "- Rule 3\n\n"
            "## Output Format\n"
            "Specify the exact structure. For JSON, include the full schema. For prose, list the sections.\n\n"
            "## Examples\n"
            "Include 2-3 input/output examples only if the task pattern is non-obvious.\n\n"
            "Bold all critical rules. GPT weights bolded instructions more heavily."
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
            "Gemini's massive context window is for INPUT data, not for verbose system prompts — keep the system prompt tight and direct.",
            "Short bullet-pointed instructions outperform long paragraphs for Gemini.",
            "Gemini responds well to numbered lists with clear, sequential logic.",
            "Avoid deeply nested structures, XML scaffolding, or repetitive instructions — Gemini processes efficiently and redundancy can confuse it.",
            "State the output format in one concise block rather than spreading format instructions across multiple sections.",
        ],
        "formatting_rules": (
            "When optimizing for Gemini, make the prompt concise and direct.\n"
            "Use this compact structure:\n\n"
            "**Role:** One-sentence persona.\n\n"
            "**Task:** One clear sentence stating the objective.\n\n"
            "**Rules:**\n"
            "- Rule 1\n"
            "- Rule 2\n"
            "- Rule 3\n\n"
            "**Output:** Exact format specification in one block.\n\n"
            "Do NOT add XML tags, verbose explanations, or multiple sections.\n"
            "Gemini performs best with minimal, high-signal instructions."
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
            "Effective with few-shot examples",
            "Competitive reasoning with explicit step-by-step instructions",
        ],
        "prompting_style": "explicit_delimiters",
        "system_prompt_tips": [
            "LLaMA relies heavily on explicit section delimiters (###, ---) to distinguish prompt zones — without them, instructions bleed together.",
            "Critical constraints must appear TWICE: once in the constraints section and again in a final REMINDER section — this reinforcement significantly improves compliance.",
            "Boundary markers (---) between sections prevent LLaMA from conflating adjacent instructions.",
            "2-3 concrete examples are the sweet spot. Avoid asking for more than 3 — fabricated examples degrade output quality.",
            "State the output format with an explicit template showing the exact structure, including placeholder text.",
        ],
        "formatting_rules": (
            "When optimizing for LLaMA, use explicit delimiters to separate every section.\n"
            "Use this structure:\n\n"
            "### ROLE ###\n"
            "Expert persona definition.\n"
            "---\n\n"
            "### TASK ###\n"
            "Clear objective statement.\n"
            "---\n\n"
            "### RULES ###\n"
            "- Rule 1\n"
            "- Rule 2\n"
            "- Rule 3\n"
            "---\n\n"
            "### OUTPUT FORMAT ###\n"
            "Exact output structure with a template.\n"
            "---\n\n"
            "### REMINDER ###\n"
            "Repeat the 2-3 most critical constraints here. This reinforcement is essential for LLaMA.\n\n"
            "Use --- between every section. Repeat critical rules at the end."
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
            "DeepSeek's core advantage is chain-of-thought reasoning — always include an explicit 'think step by step' instruction for any non-trivial task.",
            "Structure the prompt so reasoning comes BEFORE the final answer — DeepSeek produces stronger outputs when the thinking process is requested upfront.",
            "Breaking a problem into explicit sub-steps with labels ('Step 1: Analyze...', 'Step 2: Execute...', 'Step 3: Verify...') dramatically improves accuracy.",
            "State constraints at the beginning so DeepSeek's reasoning chain respects them throughout.",
            "For code tasks, asking DeepSeek to 'explain your approach before writing code' produces more correct solutions.",
        ],
        "formatting_rules": (
            "When optimizing for DeepSeek, structure the prompt to enforce chain-of-thought reasoning.\n"
            "Use this three-phase structure:\n\n"
            "### CONTEXT ###\n"
            "Role definition and all constraints listed upfront.\n\n"
            "### THINKING PROCESS ###\n"
            "Add this instruction block:\n"
            "'Before responding, think through this step by step:\n"
            "1. [First reasoning step relevant to the task]\n"
            "2. [Second reasoning step]\n"
            "3. [Final synthesis or conclusion]'\n\n"
            "### OUTPUT ###\n"
            "Specify the exact deliverable format.\n"
            "Restate the 1-2 most critical constraints.\n\n"
            "Always include an explicit reasoning instruction. DeepSeek's strongest capability is activated by chain-of-thought prompts."
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
            "Mistral's attention is strongest at the START of the prompt — front-load the most critical instructions.",
            "Every word should earn its place. Mistral performs worse with verbose or redundant prompts compared to Claude or GPT.",
            "Short XML-like tags (<role>, <task>, <rules>, <format>) work well, but keep each tag's content to 1-3 lines maximum.",
            "Mistral follows direct, imperative instructions ('Return JSON with these fields: ...') more reliably than descriptive ones ('You should return JSON...').",
            "Avoid few-shot examples unless absolutely necessary — Mistral performs well with zero-shot when instructions are clear.",
        ],
        "formatting_rules": (
            "When optimizing for Mistral, make the prompt as compact as possible.\n"
            "Use this streamlined XML-like structure:\n\n"
            "<role>One-sentence persona</role>\n"
            "<task>Direct task statement</task>\n"
            "<rules>\n"
            "- Critical rule 1\n"
            "- Critical rule 2\n"
            "</rules>\n"
            "<format>Exact output specification</format>\n\n"
            "Keep each tag's content to 1-3 lines. Do NOT add examples, preambles, or verbose explanations.\n"
            "Front-load the most important instruction. Omit anything non-essential."
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
