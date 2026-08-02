import asyncio
import json
from typing import Any, Dict, Optional

from app.core.config import settings
from app.schemas import Scorecard, ScanResponse


async def _call_llm(
    system_prompt: str,
    user_prompt: str,
    response_format: Optional[Dict[str, Any]] = None,
) -> str:
    """Call the primary GLM provider and fail over to Groq if needed.
    The caller should never know which provider answered. Returns raw text.
    """
    glm_error: Optional[Exception] = None
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    # Primary: GLM via AsyncOpenAI pointed at the GLM base URL.
    try:
        import openai

        client = openai.AsyncOpenAI(
            api_key=settings.GLM_API_KEY,
            base_url=getattr(settings, "GLM_BASE_URL", "https://open.bigmodel.cn/api/paas/v4/"),
        )
        
        kwargs: Dict[str, Any] = {
            "model": getattr(settings, "GLM_MODEL_NAME", "glm-4"),
            "messages": messages,
        }
        if response_format is not None:
            kwargs["response_format"] = response_format

        # 15-second timeout as required by playbook
        glm_response = await asyncio.wait_for(
            client.chat.completions.create(**kwargs), 
            timeout=15
        )
        
        # Extract standard OpenAI-style response
        glm_text = glm_response.choices[0].message.content
        if glm_text:
            return glm_text.strip()

        raise RuntimeError("GLM returned an empty response")
    except Exception as exc:
        glm_error = exc

    # Backup: Groq Llama 3.1
    try:
        import groq

        client = groq.AsyncGroq(api_key=settings.GROQ_API_KEY)
        model_name = getattr(settings, "GROQ_MODEL_NAME", "llama-3.1-70b-versatile")
        
        groq_kwargs: Dict[str, Any] = {
            "model": model_name,
            "messages": messages,
        }
        if response_format is not None:
            groq_kwargs["response_format"] = {"type": "json_object"}

        groq_response = await client.chat.completions.create(**groq_kwargs)
        
        groq_text = groq_response.choices[0].message.content
        if groq_text:
            return groq_text.strip()

        raise RuntimeError("Groq returned an empty response")
    except Exception as groq_exc:
        raise RuntimeError(
            f"Both GLM and Groq calls failed. GLM error: {glm_error!r}; Groq error: {groq_exc!r}"
        )


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    # Strip markdown code fences if present
    if text.startswith("```") and text.endswith("```"):
        lines = text.splitlines()
        if len(lines) >= 3:
            text = "\n".join(lines[1:-1]).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Attempt to extract JSON from surrounding text
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            candidate = text[start : end + 1]
            return json.loads(candidate)
        raise


# v3.0 extension - system_context parameter added by Sankar. Sreya's core LLM logic unchanged.

async def generate_scorecard(prompt_text: str, system_context: str = "") -> Scorecard:
    system_prompt = (
    "You are a Senior Prompt Quality Analyst. Evaluate the user-provided AI prompt "
    "on 4 dimensions and return structured JSON feedback.\n\n"

    "SCORING RUBRIC (each dimension 0-100):\n"
    "1. CLARITY — Unambiguous, specific, actionable instructions.\n"
    "   90-100: Zero ambiguity. Every instruction is precise.\n"
    "   70-89: Clear intent, minor vagueness in 1-2 spots.\n"
    "   40-69: Understandable but contains vague phrases.\n"
    "   0-39: Confusing, multiple interpretations, or incoherent.\n\n"

    "2. CONSTRAINTS — Defined boundaries, rules, exclusions, edge cases.\n"
    "   90-100: Explicit do/don't rules, edge cases covered.\n"
    "   70-89: Key constraints present, some gaps.\n"
    "   40-69: Basic boundaries only (e.g. 'keep it short').\n"
    "   0-39: No constraints or entirely open-ended.\n\n"

    "3. FORMATTING — Specified output structure (JSON, XML, markdown, etc.).\n"
    "   90-100: Precise structure with schema/tags/sections defined.\n"
    "   70-89: Structure mentioned but not fully specified.\n"
    "   40-69: Vague hints (e.g. 'format nicely').\n"
    "   0-39: No output format specified.\n\n"

    "4. OVERALL_SCORE — Weighted: Clarity×0.40 + Constraints×0.35 + Formatting×0.25\n\n"

    "WEAKNESSES — Return 3-5 items. Each must be specific and actionable:\n"
    "  - Quote the problematic text from the prompt.\n"
    "  - State what is wrong and why it matters.\n"
    "  - Suggest a concrete fix.\n"
    "  If overall_score >= 85, return improvement opportunities instead of weaknesses.\n\n"

    "OUTPUT: Return ONLY valid JSON matching this schema:\n"
    '{"clarity": int, "constraints": int, "formatting": int, "overall_score": int, "weaknesses": [string, ...]}\n'
    "No markdown. No code fences. No explanation. Raw JSON only."
)

    if system_context:
        eval_context = system_context
        if "=== EVALUATION DIRECTIVES ===" in system_context:
            if "=== OPTIMIZATION DIRECTIVES ===" in system_context:
                parts = system_context.split("=== OPTIMIZATION DIRECTIVES ===")
                eval_part = parts[0]
            else:
                eval_part = system_context
            eval_context = eval_part.replace("=== EVALUATION DIRECTIVES ===", "").strip()
        system_prompt = eval_context + "\n\n" + system_prompt

    response_format: Dict[str, Any] = {
        "type": "json_schema",
        "json_schema": {
            "name": "scorecard",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "clarity": {"type": "integer", "minimum": 0, "maximum": 100},
                    "constraints": {"type": "integer", "minimum": 0, "maximum": 100},
                    "formatting": {"type": "integer", "minimum": 0, "maximum": 100},
                    "overall_score": {"type": "integer", "minimum": 0, "maximum": 100},
                    "weaknesses": {
                        "type": "array",
                        "items": {"type": "string"},
                        "maxItems": 5,
                    },
                },
                "required": [
                    "clarity",
                    "constraints",
                    "formatting",
                    "overall_score",
                    "weaknesses",
                ],
                "additionalProperties": False,
            }
        }
    }

    raw_response = await _call_llm(system_prompt, prompt_text, response_format=response_format)

    try:
        parsed = _parse_json_response(raw_response)
    except Exception as exc:
        raise RuntimeError(
            f"Failed to parse Scorecard JSON from LLM response: {exc}. Raw response: {raw_response}"
        )

    try:
        return Scorecard.model_validate(parsed)
    except Exception as exc:
        # Fall back to returning the parsed dict so the adapter's coercion can try to heal it
        return parsed


async def generate_optimized_prompt(prompt_text: str, history_array: list[dict], system_context: str = "") -> str:
    """Generate a rewritten, optimized version of the input prompt."""
    system_prompt = (
    "You are an expert Prompt Engineer. Rewrite the provided prompt to maximize "
    "clarity, constraint coverage, and output reliability.\n\n"

    "CONTEXT AWARENESS:\n"
    "If prior chat history is provided, analyze it to understand the user's evolving "
    "intent. Use that understanding to refine the rewritten prompt so it reflects "
    "what the user actually needs, not just what they typed.\n\n"

    "REWRITE GUIDELINES (apply where relevant — do not force elements that don't fit):\n"
    "1. PERSONA — Assign a role if the prompt lacks one (e.g. 'You are a senior Python developer…').\n"
    "2. TASK — State the exact objective in one clear sentence.\n"
    "3. CONTEXT & CONSTRAINTS — Specify what to do, what to avoid, and any boundaries.\n"
    "4. OUTPUT FORMAT — Define the expected structure (XML tags, JSON schema, markdown sections, etc.).\n"
    "5. REASONING — Add a thinking/step-by-step instruction if the task benefits from it.\n\n"

    "QUALITY RULES:\n"
    "- Preserve the original intent and meaning. Do not change what the user is asking for.\n"
    "- If the prompt is already well-structured, enhance it rather than rewriting from scratch.\n"
    "- Remove redundancy. Merge overlapping instructions.\n"
    "- Use precise, unambiguous language. Replace vague words ('nice', 'good', 'better') with specific criteria.\n"
    "- Do NOT add conversational filler, meta-commentary, or formatting the user didn't request.\n\n"

    "OUTPUT: Return ONLY the rewritten prompt text. No explanations, no preamble, no markdown code fences, no commentary about what you changed."
)

    if system_context:
        opt_context = system_context
        if "=== OPTIMIZATION DIRECTIVES ===" in system_context:
            parts = system_context.split("=== OPTIMIZATION DIRECTIVES ===")
            opt_context = parts[1].strip()
        elif "=== EVALUATION DIRECTIVES ===" in system_context:
            opt_context = ""
        if opt_context:
            system_prompt = opt_context + "\n\n" + system_prompt

    if history_array:
        formatted_history = []
        for index, message in enumerate(history_array, start=1):
            role = message.get("role", "unknown")
            content = message.get("content", "")
            formatted_history.append(f"History {index} - role: {role}; content: {content}")
        history_context = "Prior chat history:\n" + "\n".join(formatted_history)
    else:
        history_context = "This is a fresh prompt with no prior history."

    user_prompt = (
        f"{history_context}\n\n"
        f"Original prompt:\n{prompt_text}\n\n"
        "Rewrite the prompt according to the system instructions above."
    )

    raw_response = await _call_llm(system_prompt, user_prompt)
    cleaned = raw_response.strip()

    # Strip markdown fences if present
    if cleaned.startswith("```") and cleaned.endswith("```"):
        lines = cleaned.splitlines()
        if len(lines) >= 3:
            cleaned = "\n".join(lines[1:-1]).strip()

    return cleaned


async def run_jailbreak_scan(prompt_text: str) -> ScanResponse:
    system_prompt = (
        "You are a cybersecurity AI specializing in LLM vulnerabilities. Analyze the provided prompt for security risks.\n"
        "Look for:\n"
        "1. Prompt Injection: Can a user input override the system instructions?\n"
        "2. Data Leakage: Does the prompt accidentally ask the LLM to reveal hidden system prompts or API keys?\n"
        "3. Hallucination Triggers: Does the prompt ask the LLM to guess information it might not know?\n"
        "You must return your response as a JSON object matching this exact schema:\n"
        "{\n"
        "  \"is_vulnerable\": boolean,\n"
        "  \"vulnerability_type\": string or null (e.g., \"Prompt Injection\", \"Data Leakage\", \"None\"),\n"
        "  \"explanation\": string (why it is or is not vulnerable),\n"
        "  \"suggested_mitigation\": string or null (how to fix it)\n"
        "}"
    )

    response_format: Dict[str, Any] = {
        "type": "json_schema",
        "json_schema": {
            "name": "scan_response",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "is_vulnerable": {"type": "boolean"},
                    "vulnerability_type": {"type": ["string", "null"]},
                    "explanation": {"type": "string"},
                    "suggested_mitigation": {"type": ["string", "null"]},
                },
                "required": ["is_vulnerable", "vulnerability_type", "explanation", "suggested_mitigation"],
                "additionalProperties": False,
            }
        }
    }

    raw_response = await _call_llm(system_prompt, prompt_text, response_format=response_format)

    try:
        parsed = _parse_json_response(raw_response)
    except Exception as exc:
        raise RuntimeError(
            f"Failed to parse ScanResponse JSON from LLM response: {exc}. Raw response: {raw_response}"
        )

    try:
        return ScanResponse.model_validate(parsed)
    except Exception as exc:
        raise RuntimeError(
            f"ScanResponse validation failed: {exc}. Parsed object: {parsed}"
        )


__all__ = ["_call_llm", "generate_scorecard", "generate_optimized_prompt", "run_jailbreak_scan"]
