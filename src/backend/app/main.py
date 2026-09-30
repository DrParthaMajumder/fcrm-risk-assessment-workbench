from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Allow `python main.py` from this directory (src/backend/app).
if __name__ == "__main__":
    backend_root = Path(__file__).resolve().parent.parent
    if str(backend_root) not in sys.path:
        sys.path.insert(0, str(backend_root))

from fastapi import FastAPI

from app.api.router import api_router
from app.api.routes import health
from app.core.config import get_settings
from app.core.db_migrations import ensure_assessment_tables

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    ensure_assessment_tables(settings.supabase_db_url)
    yield


app = FastAPI(
    title="SME Loan Workbench API",
    version="0.1.0",
    description="Backend API for the SME loan underwriting workbench.",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[str(Path(__file__).resolve().parent.parent)],
    )
