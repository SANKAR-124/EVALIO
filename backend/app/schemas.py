from datetime import datetime, timezone
from typing import Optional, Literal, Any
from pydantic import BaseModel, Field, field_validator

def get_utc_now() -> datetime:
    """
    Returns the current timezone-aware UTC datetime.
    """
    return datetime.now(timezone.utc)


# ==========================================
# SECTION 1: Chat primitives
# ==========================================

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = Field(default_factory=get_utc_now)


# ==========================================
# SECTION 2: REQUEST schemas
# ==========================================

class EvaluateRequest(BaseModel):
    raw_prompt: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The raw input prompt to be evaluated and optimized.",
        examples=["Evaluate this prompt for me."]
    )
    session_id: Optional[str] = Field(
        None,
        description="Pass the session ID to continue a session, or omit to start a new one."
    )
    use_case: Optional[str] = Field(
        None,
        description="The ID of the selected use case from the registry. Pass to enable domain-specific evaluation. Omit for generic behavior."
    )
    target_agent: Optional[str] = Field(
        None,
        description="The ID of the target LLM agent from the agent registry. Pass to enable agent-specific formatting. Omit for generic formatting."
    )

class ScanRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The prompt to be scanned for security vulnerabilities."
    )


# ==========================================
# SECTION 3: RESPONSE schemas
# >>> HAND-OFF BLOCK TO SREYA <<<
# ==========================================

class Scorecard(BaseModel):
    clarity: int = Field(
        ...,
        ge=0,
        le=100,
        description="How unambiguous the prompt is"
    )
    constraints: int = Field(
        ...,
        ge=0,
        le=100,
        description="How well boundaries/rules are stated"
    )
    formatting: int = Field(
        ...,
        ge=0,
        le=100,
        description="How well output structure is specified"
    )
    overall_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="The weighted overall score"
    )
    weaknesses: list[str] = Field(
        default_factory=list,
        max_length=5,
        description="Specific, actionable weaknesses (max 5)"
    )

    @field_validator("clarity", "constraints", "formatting", "overall_score", mode="before")
    @classmethod
    def coerce_and_round_scores(cls, v: Any) -> Any:
        """
        Coerces and rounds any float scores returned by the LLM to integers
        before Pydantic schema validation.
        """
        if isinstance(v, (int, float)):
            return round(v)
        return v


class EvaluateResponse(BaseModel):
    session_id: str
    scorecard: Scorecard
    optimized_prompt: str = Field(
        ...,
        description="The fully rewritten, production-ready prompt"
    )
    chat_history: list[ChatMessage] = Field(default_factory=list)

class ScanResponse(BaseModel):
    is_vulnerable: bool = Field(
        ...,
        description="Whether the prompt is vulnerable to security exploits"
    )
    vulnerability_type: Optional[str] = Field(
        None,
        description="Type of vulnerability, e.g. prompt injection, jailbreak, data exfiltration"
    )
    explanation: str = Field(
        ...,
        description="Why the prompt is or is not vulnerable"
    )
    suggested_mitigation: Optional[str] = Field(
        None,
        description="Actionable mitigation suggestions if vulnerable"
    )


# ==========================================
# SECTION 4: Session management schemas
# ==========================================

class SessionSummary(BaseModel):
    session_id: str
    title: Optional[str] = None
    message_count: int
    created_at: datetime
    updated_at: datetime

class SessionDetail(SessionSummary):
    messages: list[ChatMessage]


# ==========================================
# SECTION 5: Standardized error envelope
# >>> HAND-OFF BLOCK TO VITHUL <<<
# ==========================================

class ErrorDetail(BaseModel):
    error_code: str = Field(
        ...,
        description="A machine-readable error code",
        examples=["EMPTY_PROMPT", "LLM_TIMEOUT", "SESSION_NOT_FOUND"]
    )
    message: str = Field(
        ...,
        description="A human-readable error message"
    )
    detail: Optional[str] = Field(
        None,
        description="Technical details/traceback for debugging"
    )


# ─── PHASE 5+ EXTENSIONS (v3.0) ───

# ==========================================
# SECTION 6: Use-Case and Agent Request Extensions
# (Fields added to EvaluateRequest above)
# ==========================================


# ==========================================
# SECTION 7: Registry Response Models
# ==========================================

class UseCaseInfo(BaseModel):
    """Flat model for the GET /api/use-cases response."""
    id: str
    label: str
    icon: str
    description: str
    evaluation_focus: list[str]

class AgentInfo(BaseModel):
    """Flat model for the GET /api/agents response."""
    id: str
    label: str
    provider: str
    icon: str
    strengths: list[str]
    prompting_style: str
    system_prompt_tips: list[str]
    context_window: str
