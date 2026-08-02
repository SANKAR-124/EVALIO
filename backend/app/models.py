from datetime import datetime, timezone
from typing import Optional, Any
from beanie import Document
from pydantic import Field

def get_utc_now() -> datetime:
    """
    Returns the current timezone-aware UTC datetime.
    """
    return datetime.now(timezone.utc)

class ProjectSession(Document):
    """
    A chat session scoped to a workspace_id (cheat-code auth).
    """
    workspace_id: str
    title: Optional[str] = None
    # Each entry in messages has the shape:
    # {
    #     "role": "user" | "assistant",
    #     "content": str,
    #     "timestamp": str (ISO-8601 format)
    # }
    messages: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    class Settings:
        name = "project_sessions"
        indexes = [
            "workspace_id",
            "updated_at"
        ]

class ScanResult(Document):
    """
    Persisted vulnerability scan results, kept for demo auditability.
    """
    workspace_id: str
    prompt: str
    is_vulnerable: bool
    vulnerability_type: Optional[str] = None
    explanation: str
    suggested_mitigation: Optional[str] = None
    created_at: datetime = Field(default_factory=get_utc_now)

    class Settings:
        name = "scan_results"
