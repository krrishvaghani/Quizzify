import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.jwt_secret: str = os.getenv("JWT_SECRET", "your_super_secret_jwt_key_change_this_in_production")
        self.jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        # Load Gemini API key from environment variable
        self.gemini_api_key: str | None = os.getenv("GEMINI_API_KEY", "AIzaSyB12VJUV7pqlJcazkQb94NextNiwc2hbIQ")


settings = Settings()


