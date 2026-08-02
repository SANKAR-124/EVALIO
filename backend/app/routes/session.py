from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from app.schemas import SessionSummary, SessionDetail, ChatMessage
from app.models import ProjectSession
from app.dependencies import get_workspace_id

router = APIRouter()

@router.get("/sessions", response_model=list[SessionSummary])
async def list_sessions(
    workspace_id: str = Depends(get_workspace_id)
) -> list[SessionSummary]:
    """
    Retrieves all chat sessions for the active workspace, sorted by updated_at descending.
    """
    sessions = await ProjectSession.find(
        ProjectSession.workspace_id == workspace_id
    ).sort(-ProjectSession.updated_at).to_list()

    return [
        SessionSummary(
            session_id=str(session.id),
            title=session.title,
            message_count=len(session.messages),
            created_at=session.created_at,
            updated_at=session.updated_at
        )
        for session in sessions
    ]

@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session_detail(
    session_id: str,
    workspace_id: str = Depends(get_workspace_id)
) -> SessionDetail:
    """
    Retrieves the full details of a specific chat session, including messages.
    Raises 404 if the session does not exist or does not belong to the workspace.
    """
    session = None
    try:
        session = await ProjectSession.get(ObjectId(session_id))
    except Exception:
        # Silence invalid ObjectId parse errors and treat as not found
        pass

    if not session or session.workspace_id != workspace_id:
        raise HTTPException(
            status_code=404,
            detail={
                "error_code": "SESSION_NOT_FOUND",
                "message": f"Session with ID {session_id} not found.",
                "detail": None
            }
        )

    # Convert the messages dict list to Pydantic ChatMessage objects
    chat_messages = [
        ChatMessage(
            role=msg["role"],
            content=msg["content"],
            timestamp=msg["timestamp"]
        )
        for msg in session.messages
    ]

    return SessionDetail(
        session_id=str(session.id),
        title=session.title,
        message_count=len(session.messages),
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=chat_messages
    )

@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    workspace_id: str = Depends(get_workspace_id)
) -> None:
    """
    Deletes a specific chat session.
    Raises 404 if the session does not exist or does not belong to the workspace.
    """
    session = None
    try:
        session = await ProjectSession.get(ObjectId(session_id))
    except Exception:
        pass

    if not session or session.workspace_id != workspace_id:
        raise HTTPException(
            status_code=404,
            detail={
                "error_code": "SESSION_NOT_FOUND",
                "message": f"Session with ID {session_id} not found.",
                "detail": None
            }
        )

    await session.delete()
    return None
