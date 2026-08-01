"""
This is the boundary between Sankar's routes and Sreya's pipeline.
All route files must import LLM/AI functions from here, never directly from ai_engine.py.
"""

import asyncio
import inspect
import re
import json
from typing import Any, Callable
from app.schemas import Scorecard, ScanResponse
from app.services import ai_engine
from app.services.errors import LLMServiceError

def _strip_fences(text: str) -> str:
    """
    Strips markdown code fences (e.g. ```json ... ```) wrapping the content.
    Supports multi-line text by enabling dot-matches-newline (re.DOTALL).
    """
    pattern = r"^\s*```[a-zA-Z]*\s*(.*?)\s*```\s*$"
    match = re.match(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

async def _call_engine(func: Callable, *args: Any, **kwargs: Any) -> Any:
    """
    Calls the engine function. Offloads to a worker thread if the function
    is synchronous to prevent blocking the event loop.
    """
    if inspect.iscoroutinefunction(func):
        return await func(*args, **kwargs)
    else:
        return await asyncio.to_thread(func, *args, **kwargs)

async def generate_scorecard(prompt_text: str) -> Scorecard:
    """
    Adapter wrapper around ai_engine.generate_scorecard.
    Applies dict coercion, sync-function tolerance, and fence stripping.
    """
    res = await _call_engine(ai_engine.generate_scorecard, prompt_text)
    
    # Fence stripping and JSON loading if returned as string representation of JSON
    if isinstance(res, str):
        res = _strip_fences(res)
        try:
            res = json.loads(res)
        except json.JSONDecodeError as e:
            raise LLMServiceError(f"Failed to parse scorecard JSON: {str(e)}") from e

    # Dict coercion to Scorecard Pydantic model
    if isinstance(res, dict):
        try:
            res = Scorecard(**res)
        except Exception as e:
            raise LLMServiceError(f"Scorecard validation failed: {str(e)}") from e

    return res

async def generate_optimized_prompt(prompt_text: str, history_array: list[dict]) -> str:
    """
    Adapter wrapper around ai_engine.generate_optimized_prompt.
    Applies sync-function tolerance and strips code fences if present.
    """
    res = await _call_engine(ai_engine.generate_optimized_prompt, prompt_text, history_array)
    if isinstance(res, str):
        res = _strip_fences(res)
    return res

async def run_jailbreak_scan(prompt_text: str) -> ScanResponse:
    """
    Adapter wrapper around ai_engine.run_jailbreak_scan.
    Applies dict coercion, sync-function tolerance, and fence stripping.
    """
    res = await _call_engine(ai_engine.run_jailbreak_scan, prompt_text)
    
    # Fence stripping and JSON loading if returned as string representation of JSON
    if isinstance(res, str):
        res = _strip_fences(res)
        try:
            res = json.loads(res)
        except json.JSONDecodeError as e:
            raise LLMServiceError(f"Failed to parse scan response JSON: {str(e)}") from e

    # Dict coercion to ScanResponse Pydantic model
    if isinstance(res, dict):
        try:
            res = ScanResponse(**res)
        except Exception as e:
            raise LLMServiceError(f"ScanResponse validation failed: {str(e)}") from e

    return res
