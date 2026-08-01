from fastapi import APIRouter
from app.schemas import AgentInfo
from app.services.agent_registry import list_agents

router = APIRouter(tags=["Agents"])


@router.get("/agents", response_model=list[AgentInfo])
async def get_agents():
    return list_agents()
