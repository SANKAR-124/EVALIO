import asyncio
import json
from typing import Any, Dict, Optional

from app.core.config import settings
from app.schemas import Scorecard


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
            groq_kwargs["response_format"] = response_format

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


async def generate_scorecard(prompt_text: str) -> Scorecard:
    system_prompt = (
        "You are a ruthless Senior AI Engineer grading prompts written by junior developers.\n"
        "Analyze the provided prompt based on 4 dimensions:\n"
        "1. Clarity: Is the instruction specific or vague?\n"
        "2. Constraints: Are boundaries, rules, and edge cases well-defined?\n"
        "3. Formatting: Is the output structure specified? (e.g., XML tags, markdown, JSON)\n"
        "4. Overall Score: A weighted average of the above.\n"
        "Provide a score out of 100 for each dimension. Also provide a list of specific, actionable weaknesses (max 5 items) that explain why the prompt failed.\n"
        "You must return your response as a JSON object matching this exact schema:\n"
        "{ \"clarity\": integer (0-100), \"constraints\": integer (0-100), \"formatting\": integer (0-100), \"overall_score\": integer (0-100), \"weaknesses\": array of strings }"
    )

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
        raise RuntimeError(
            f"Scorecard validation failed: {exc}. Parsed object: {parsed}"
        )


__all__ = ["_call_llm", "generate_scorecard"]