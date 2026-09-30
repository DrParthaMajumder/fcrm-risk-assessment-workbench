import logging
from dataclasses import dataclass

from app.core.config import get_settings
from app.core.exceptions import (
    ApplicationNotFoundError,
    AssessmentStorageNotConfiguredError,
)
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.sme_application_repository import SmeApplicationRepository
from app.risk_engine.engine import RiskEngine
from app.risk_engine.models import AssessmentResult

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AssessmentRunResult:
    result: AssessmentResult
    persisted: bool
    storage_message: str | None = None


class AssessmentService:
    def __init__(
        self,
        application_repository: SmeApplicationRepository,
        assessment_repository: AssessmentRepository,
        risk_engine: RiskEngine | None = None,
    ) -> None:
        self._applications = application_repository
        self._assessments = assessment_repository
        self._engine = risk_engine or RiskEngine()

    def run_assessment(self, business_id: str) -> AssessmentRunResult:
        row = self._applications.get_by_business_id(business_id)
        if row is None:
            raise ApplicationNotFoundError(business_id)

        result = self._engine.assess(row)
        settings = get_settings()

        try:
            self._assessments.save(result)
            return AssessmentRunResult(result=result, persisted=True)
        except AssessmentStorageNotConfiguredError as exc:
            if settings.require_assessment_persistence:
                raise
            logger.warning(
                "Assessment for %s completed but not persisted: %s",
                business_id,
                exc,
            )
            return AssessmentRunResult(
                result=result,
                persisted=False,
                storage_message=str(exc),
            )
