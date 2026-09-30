from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    supabase_url: str
    supabase_secret_key: str
    supabase_db_url: str | None = None
    env: str = "development"
    require_assessment_persistence: bool = False

    @field_validator("supabase_url")
    @classmethod
    def normalize_supabase_url(cls, value: str) -> str:
        url = value.rstrip("/")
        if url.endswith("/rest/v1"):
            url = url[: -len("/rest/v1")]
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
