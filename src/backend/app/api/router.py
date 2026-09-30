from fastapi import APIRouter

from app.api.routes import applications, assessments

api_router = APIRouter()
api_router.include_router(
    applications.router,
    prefix="/applications",
    tags=["Applications"],
)
api_router.include_router(
    assessments.router,
    prefix="/applications",
)
