"""
CONTRACT:
- Sankar owns the signatures; Sreya owns the implementations.
- Every function must be async.
- Every function must accept exactly the parameters specified — no additions, no reordering.
- generate_scorecard must return a Scorecard instance, or a dict that validates against it.
- generate_optimized_prompt must return a plain string — the rewritten prompt only, with no preamble and no markdown fences.
- run_jailbreak_scan must return a ScanResponse instance.
- GLM 4.7 is primary; Groq Llama is the fallback, implemented inside these functions. The caller must never learn which provider answered.
"""

from app.schemas import Scorecard, ScanResponse

async def generate_scorecard(prompt_text: str) -> Scorecard:
    """
    Evaluates the prompt text and returns a Scorecard model.
    
    Instructions for Sreya:
    - The model must output a JSON object containing:
      - clarity: int (0-100) - how unambiguous the prompt is
      - constraints: int (0-100) - how well boundaries/rules are stated
      - formatting: int (0-100) - how well output structure is specified
      - overall_score: int (0-100) - the weighted overall score
      - weaknesses: list[str] (max 5 strings) - specific, actionable weaknesses
    """
    # =======================================================
    # !!! MOCK BODY - TO BE DELETED ONCE SREYA DELIVERS !!!
    # =======================================================
    return Scorecard(
        clarity=75,
        constraints=70,
        formatting=80,
        overall_score=75,
        weaknesses=[
            "[MOCK] Add more explicit formatting instructions.",
            "[MOCK] Clarify output constraints."
        ]
    )
    # =======================================================

async def generate_optimized_prompt(prompt_text: str, history_array: list[dict]) -> str:
    """
    Generates a rewritten, optimized version of the input prompt.
    
    Instructions for Sreya:
    - history_array is a list of dicts, each carrying a 'role' and 'content' key.
    - If history_array is empty, this is a fresh optimization.
    - If history_array is non-empty, incorporate prior context (Contextual Memory / follow-ups).
    - Return a plain string containing ONLY the optimized prompt. No preamble, no markdown code fences.
    """
    # =======================================================
    # !!! MOCK BODY - TO BE DELETED ONCE SREYA DELIVERS !!!
    # =======================================================
    history_count = len(history_array)
    return f"[MOCK OPTIMIZED] {prompt_text} (History messages count: {history_count})"
    # =======================================================

async def run_jailbreak_scan(prompt_text: str) -> ScanResponse:
    """
    Scans the prompt text for potential prompt injection or jailbreak attempts.
    
    Instructions for Sreya:
    - Return a ScanResponse indicating whether it is vulnerable and why.
    """
    # =======================================================
    # !!! MOCK BODY - TO BE DELETED ONCE SREYA DELIVERS !!!
    # =======================================================
    return ScanResponse(
        is_vulnerable=False,
        vulnerability_type=None,
        explanation="[MOCK] The prompt seems secure. No injection pattern found.",
        suggested_mitigation=None
    )
    # =======================================================
