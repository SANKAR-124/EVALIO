from fastapi import APIRouter
from app.schemas import UseCaseInfo
from app.services.use_case_registry import list_use_cases

router = APIRouter(tags=["UseCases"])


@router.get("/use-cases", response_model=list[UseCaseInfo])
async def get_use_cases():
    return list_use_cases()
