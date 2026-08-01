from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Central configuration loaded from .env file for the Evalio application.
    """
    MONGODB_URI: str
    DATABASE_NAME: str = "evalio"
    GLM_API_KEY: str = "c6d9255efda0400d895e5c1c9dbbe0bd.aYkwviyHo7X9tHte"
    GLM_MODEL_NAME: str = "glm-4.7"
    GROQ_API_KEY: str = "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"
    GROQ_MODEL_NAME: str = "llama-3.1-8b-instant"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate as a module-level singleton
settings = Settings()
