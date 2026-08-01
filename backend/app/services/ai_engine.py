import asyncio
from typing import Any, Dict, Optional

from app.core.config import settings

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

__all__ = ["_call_llm"]