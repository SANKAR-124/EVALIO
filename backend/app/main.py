from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and save client connection
    client = await init_db()
    app.state.db_client = client
    yield
    # Shutdown: close database connection
    client.close()

app = FastAPI(
    title="Evalio API",
    version="1.0.0",
    description="The AI-powered Prompt IDE backend for SYNC 2026",
    lifespan=lifespan
)

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router inclusions
from app.routes import evaluate, scan, session
app.include_router(evaluate.router, prefix="/api", tags=["Evaluate"])
app.include_router(scan.router, prefix="/api", tags=["Scan"])
app.include_router(session.router, prefix="/api", tags=["Session"])

@app.get("/health", tags=["System"])
async def health_check():
    """
    Simple health check endpoint returning status.
    """
    return {
        "status": "ok",
        "service": "evalio-backend",
        "version": "1.0.0"
    }
