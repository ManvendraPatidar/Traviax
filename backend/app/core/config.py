from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "traviax-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs (Optional)
    OPENAI_API_KEY: Optional[str] = None
    AMADEUS_API_KEY: Optional[str] = None
    AMADEUS_API_SECRET: Optional[str] = None
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    
    # Mock Data
    MOCK_DATA_PATH: str = "./mock_data/db.json"
    
    class Config:
        env_file = ".env"

settings = Settings()
