from functools import lru_cache

from app.core.supabase import get_supabase_client
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.sme_application_repository import SmeApplicationRepository
from app.services.application_service import ApplicationService
from app.services.assessment_service import AssessmentService


@lru_cache
def get_application_repository() -> SmeApplicationRepository:
    return SmeApplicationRepository(get_supabase_client())


@lru_cache
def get_assessment_repository() -> AssessmentRepository:
    return AssessmentRepository(get_supabase_client())


@lru_cache
def get_application_service() -> ApplicationService:
    return ApplicationService(get_application_repository())


@lru_cache
def get_assessment_service() -> AssessmentService:
    return AssessmentService(
        get_application_repository(),
        get_assessment_repository(),
    )
