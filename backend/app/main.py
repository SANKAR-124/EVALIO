import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database import init_db

logger = logging.getLogger("evalio.main")

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

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """
    Globally catches Pydantic validation errors and converts them to our standard envelope.
    """
    return JSONResponse(
        status_code=422,
        content={
            "detail": {
                "error_code": "VALIDATION_ERROR",
                "message": "The request failed validation.",
                "detail": exc.errors()
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc: Exception):
    """
    Catch-all exception handler to format any unhandled server errors into our standard envelope.
    """
    logger.exception(f"Unhandled exception caught by global handler: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": {
                "error_code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred on the server.",
                "detail": str(exc)
            }
        }
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
from app.routes import evaluate, scan, session, use_cases, agents
app.include_router(evaluate.router, prefix="/api", tags=["Evaluate"])
app.include_router(scan.router, prefix="/api", tags=["Scan"])
app.include_router(session.router, prefix="/api", tags=["Session"])
app.include_router(use_cases.router, prefix="/api", tags=["UseCases"])
app.include_router(agents.router, prefix="/api", tags=["Agents"])

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
