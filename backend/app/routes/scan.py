import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException

from app.schemas import ScanRequest, ScanResponse
from app.models import ScanResult
from app.dependencies import get_workspace_id
from app.services import llm_service
from app.services.errors import LLMServiceError

router = APIRouter()
logger = logging.getLogger("evalio.scan")

# Timeout constant (20 seconds)
SCAN_TIMEOUT = 20.0

@router.post("/scan", response_model=ScanResponse)
async def scan_prompt(
    request: ScanRequest,
    workspace_id: str = Depends(get_workspace_id)
) -> ScanResponse:
    """
    Runs the adversarial jailbreak agent against the prompt.
    Designed for parallel invocation alongside /evaluate from the frontend.
    """
    try:
        # Await the jailbreak scan through llm_service wrapped in a 20-second timeout
        scan_res = await asyncio.wait_for(
            llm_service.run_jailbreak_scan(request.prompt),
            timeout=SCAN_TIMEOUT
        )
    except asyncio.TimeoutError:
        logger.warning(f"Scan timed out for workspace {workspace_id}")
        # Return a soft 200 OK on timeout to avoid blocking the user flow
        scan_res = ScanResponse(
            is_vulnerable=False,
            vulnerability_type=None,
            explanation="The scan timed out. The prompt should be treated as unverified.",
            suggested_mitigation="Please perform manual review."
        )
    except LLMServiceError as e:
        logger.exception(f"LLM service error during scan for workspace {workspace_id}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": e.error_code,
                "message": str(e),
                "detail": None
            }
        )
    except Exception as e:
        logger.exception(f"Unexpected error during scan for workspace {workspace_id}")
        raise HTTPException(
            status_code=502,
            detail={
                "error_code": "SCAN_ERROR",
                "message": "The scanning service is currently unavailable.",
                "detail": str(e)
            }
        )

    # Persist ScanResult after we have the result.
    # This is wrapped in its own try/except so a database failure never blocks the client response.
    try:
        scan_doc = ScanResult(
            workspace_id=workspace_id,
            prompt=request.prompt,
            is_vulnerable=scan_res.is_vulnerable,
            vulnerability_type=scan_res.vulnerability_type,
            explanation=scan_res.explanation
        )
        await scan_doc.insert()
    except Exception as db_exc:
        logger.warning(f"Failed to persist ScanResult in database: {db_exc}", exc_info=True)

    return scan_res
