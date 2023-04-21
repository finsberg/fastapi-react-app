from typing import List

from decouple import config
from pydantic import AnyHttpUrl
from pydantic import BaseSettings
from pydantic import parse_obj_as


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        parse_obj_as(AnyHttpUrl, "http://localhost:5173"),
    ]
    PROJECT_NAME: str = "TODO list"

    # Database
    SQL_CONNECTION_STRING: str = config("SQL_CONNECTION_STRING", cast=str)
    # MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)

    class Config:
        case_sensitive = True


settings = Settings()
