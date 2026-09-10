import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "VoiceArmor AI Security Center"
    VERSION: str = "1.0.0"
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./voicearmor.db")
    
    # Engine Mode: AUTO, LIGHTWEIGHT, DEMO
    AI_ENGINE_MODE: str = os.getenv("AI_ENGINE_MODE", "AUTO")
    
    # Risk Engine Thresholds
    RISK_THRESHOLD_MODERATE: int = 21
    RISK_THRESHOLD_HIGH: int = 51
    RISK_THRESHOLD_CRITICAL: int = 76

    class Config:
        env_file = ".env"

settings = Settings()
