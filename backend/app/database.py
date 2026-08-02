from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models import ProjectSession, ScanResult

async def init_db() -> AsyncIOMotorClient:
    """
    Initializes the MongoDB connection and Beanie ODM.
    Returns the Motor async client to allow closing on shutdown.
    """
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=10000
    )
    database = client[settings.DATABASE_NAME]
    
    # Register document models with Beanie
    await init_beanie(
        database=database,
        document_models=[ProjectSession, ScanResult]
    )
    
    return client

@asynccontextmanager
async def get_db_client():
    """
    Async context manager yielding a Motor client, ensuring it is closed in a finally block.
    """
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=10000
    )
    try:
        yield client
    finally:
        client.close()
