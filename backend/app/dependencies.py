from typing import Optional
from fastapi import Header, HTTPException

async def get_workspace_id(x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-Id")) -> str:
    """
    Dependency to extract and validate the workspace ID from the request headers.
    Acts as a cheat-code auth mechanism for hackathon scoping.
    """
    if not x_workspace_id or not x_workspace_id.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error_code": "MISSING_WORKSPACE",
                "message": "X-Workspace-Id header is required.",
                "detail": None
            }
        )
    return x_workspace_id.strip()
