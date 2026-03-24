import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuAgent"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./docuagent.db"
    
    # LLM Settings
    LITELLM_DEFAULT_MODEL: str = "gemini/gemini-pro"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
