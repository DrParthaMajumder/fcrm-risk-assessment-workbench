from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.risk_engine.models import (
    AssessmentStatus,
    DimensionResult,
    RiskFactor,
    ScoringStatus,
    ValidationResult,
)
from app.services.assessment_service import AssessmentRunResult


class AssessmentResponse(BaseModel):
    assessment_id: UUID
    business_id: str
    rule_version: str
    scoring_policy_version: str | None = None
    status: AssessmentStatus
    scoring_status: ScoringStatus
    validation: ValidationResult
    risk_factors: list[RiskFactor] = Field(default_factory=list)
    dimension_results: list[DimensionResult] = Field(default_factory=list)
    overall_score: float | None = None
    risk_band: str | None = None
    recommendation: str | None = None
    recommendation_reasons: list[str] = Field(default_factory=list)
    evaluated_at: datetime
    persisted: bool = True
    storage_message: str | None = None

    @classmethod
    def from_run(cls, run: AssessmentRunResult) -> "AssessmentResponse":
        payload = run.result.model_dump()
        payload["persisted"] = run.persisted
        payload["storage_message"] = run.storage_message
        return cls.model_validate(payload)
