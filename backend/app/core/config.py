import os


class Settings:
    def __init__(self) -> None:
        self.jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
        self.jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        # Use provided env if set; otherwise fall back to user-supplied key
        self.gemini_api_key: str | None = os.getenv("GEMINI_API_KEY", "AIzaSyBRkS8lXEuRCt9NJDAm08uyrYaT0kVFsA8")


settings = Settings()


