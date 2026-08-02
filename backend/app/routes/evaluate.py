import asyncio
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.schemas import EvaluateRequest, EvaluateResponse, ChatMessage, Scorecard
from app.models import ProjectSession, get_utc_now
from app.dependencies import get_workspace_id
from app.services import llm_service
from app.services.errors import LLMServiceError
from app.services.use_case_registry import get_use_case
from app.services.agent_registry import get_agent

# Create router and logger
router = APIRouter()
logger = logging.getLogger("evalio.evaluate")

# Constants
HISTORY_WINDOW = 10
LLM_TIMEOUT = 30.0

async def _get_or_create_session(workspace_id: str, session_id: Optional[str] = None) -> ProjectSession:
    """
    Retrieves an existing session by ID (ensuring it belongs to the active workspace)
    or creates a new session.
    """
    session = None
    if session_id:
        try:
            session = await ProjectSession.get(ObjectId(session_id))
        except Exception:
            # Silence invalid ObjectId parse errors and fall back to creating a session
            pass

    # Ensure the session belongs to the requesting workspace to prevent data leaks
    if session and session.workspace_id == workspace_id:
        return session

    # Silently create a fresh session for safety in the demo flow
    session = ProjectSession(
        workspace_id=workspace_id,
        title=None,
        messages=[]
    )
    await session.insert()
    return session

@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_prompt(
    request: EvaluateRequest,
    workspace_id: str = Depends(get_workspace_id)
) -> EvaluateResponse:
    """
    Evaluates and optimizes a user prompt.

    Step 1 — Session: Call the helper to get or create the session.
    Step 2 — History window: Slice the last 10 messages off the session's message list.
    Step 2.5 — Compose System Context: Retrieve use-case/agent directives and build system_context.
    Step 3 — Parallel LLM calls: Fire the scorecard and optimizer concurrently with a 30s timeout.
    Step 4 — Persist: Save the new user prompt and AI optimized prompt in the session history.
    Step 5 — Respond: Return the EvaluateResponse payload.
    """
    # Step 1: Session
    session = await _get_or_create_session(workspace_id, request.session_id)

    # Step 2: Slice the last N messages for history context
    history_array = session.messages[-HISTORY_WINDOW:]

    # Step 2.5: Compose system context from use case and agent registries
    system_context = ""
    eval_parts = []
    opt_parts = []

    if request.use_case:
        use_case_data = get_use_case(request.use_case)
        if use_case_data:
            focus_str = "\n".join(f"- {f}" for f in use_case_data["evaluation_focus"])
            eval_parts.append(f"Domain Evaluation Focus:\n{focus_str}")
            opt_parts.append(use_case_data["optimizer_system_addition"])

    if request.target_agent:
        agent_data = get_agent(request.target_agent)
        if agent_data:
            tips_str = "\n".join(f"- {tip}" for tip in agent_data["system_prompt_tips"])
            eval_parts.append(f"Target Agent Tips to evaluate against:\n{tips_str}")
            
            agent_instruction = (
                f"Optimize and format the prompt specifically for the '{agent_data['label']}' model "
                f"(provided by {agent_data['provider']}) using the '{agent_data['prompting_style']}' prompting style.\n"
                f"Follow these formatting rules to structure the output prompt:\n"
                f"{agent_data['formatting_rules']}\n"
                f"Best practices for this agent:\n"
                f"{tips_str}"
            )
            opt_parts.append(agent_instruction)

    # Combine into a single string with clear tags
    parts = []
    if eval_parts:
        parts.append("=== EVALUATION DIRECTIVES ===\n" + "\n\n".join(eval_parts))
    if opt_parts:
        parts.append("=== OPTIMIZATION DIRECTIVES ===\n" + "\n\n".join(opt_parts))

    if parts:
        system_context = "\n\n".join(parts)

    # Step 3: Call LLM scorecard and optimizer in parallel
    try:
        scorecard, optimized_prompt = await asyncio.wait_for(
            asyncio.gather(
                llm_service.generate_scorecard(request.raw_prompt, system_context=system_context),
                llm_service.generate_optimized_prompt(request.raw_prompt, history_array, system_context=system_context)
            ),
            timeout=LLM_TIMEOUT
        )
        
        # Execute the optimized prompt to get the agent's output response
        agent_response = await llm_service.execute_prompt(optimized_prompt, system_context=system_context)
    except asyncio.TimeoutError as e:
        logger.error(f"Timeout calling AI services for workspace {workspace_id}", exc_info=True)
        raise HTTPException(
            status_code=504,
            detail={
                "error_code": "LLM_TIMEOUT",
                "message": "The AI service took too long to respond.",
                "detail": None
            }
        )
    except LLMServiceError as e:
        logger.exception(f"LLM service error occurred for workspace {workspace_id}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": e.error_code,
                "message": str(e),
                "detail": None
            }
        )
    except Exception as e:
        logger.exception(f"Unexpected exception calling AI services for workspace {workspace_id}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": "LLM_ERROR",
                "message": "The AI service is currently unavailable.",
                "detail": str(e)
            }
        )

    # Step 4: Persist the conversation history
    timestamp = get_utc_now().isoformat()
    
    # Append the prompt and response messages
    session.messages.append({
        "role": "user",
        "content": request.raw_prompt,
        "timestamp": timestamp
    })
    session.messages.append({
        "role": "assistant",
        "content": optimized_prompt,
        "agent_response": agent_response,
        "timestamp": timestamp
    })
    
    # Update title if it doesn't exist
    if not session.title:
        session.title = request.raw_prompt[:60]
        
    session.updated_at = get_utc_now()
    await session.save()

    # Step 5: Construct response history matching ChatMessage schemas
    chat_history = [
        ChatMessage(
            role=msg["role"],
            content=msg["content"],
            timestamp=msg["timestamp"]
        )
        for msg in session.messages[-HISTORY_WINDOW:]
    ]

    return EvaluateResponse(
        session_id=str(session.id),
        scorecard=scorecard,
        optimized_prompt=optimized_prompt,
        chat_history=chat_history,
        agent_response=agent_response
    )
