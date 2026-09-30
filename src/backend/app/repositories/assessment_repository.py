import logging
from typing import Any

from postgrest.exceptions import APIError
from supabase import Client

from app.core.exceptions import AssessmentStorageNotConfiguredError, DatabaseError
from app.risk_engine.models import AssessmentResult

logger = logging.getLogger(__name__)

ASSESSMENTS_TABLE = "sme_assessments"
FACTORS_TABLE = "assessment_factors"


def _is_missing_table_error(exc: APIError) -> bool:
    code = getattr(exc, "code", None)
    if code == "PGRST205":
        return True
    message = str(getattr(exc, "message", "") or exc)
    return "sme_assessments" in message and "schema cache" in message


class AssessmentRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def save(self, assessment: AssessmentResult) -> dict[str, Any]:
        assessment_row = {
            "id": str(assessment.assessment_id),
            "business_id": assessment.business_id,
            "rule_version": assessment.rule_version,
            "scoring_policy_version": assessment.scoring_policy_version,
            "status": assessment.status.value,
            "scoring_status": assessment.scoring_status.value,
            "overall_score": assessment.overall_score,
            "risk_band": assessment.risk_band,
            "recommendation": assessment.recommendation,
            "recommendation_reasons": assessment.recommendation_reasons,
            "validation_valid": assessment.validation.valid,
            "validation_errors": [
                e.model_dump() for e in assessment.validation.errors
            ],
            "validation_warnings": [
                w.model_dump() for w in assessment.validation.warnings
            ],
            "dimension_results": [d.model_dump(mode="json") for d in assessment.dimension_results],
            "created_at": assessment.evaluated_at.isoformat(),
        }

        factor_rows = [
            {
                "assessment_id": str(assessment.assessment_id),
                "factor_id": factor.factor_id,
                "rule_id": factor.rule_id,
                "rule_version": assessment.rule_version,
                "dimension": factor.dimension.value,
                "field": factor.field,
                "input_value": None if factor.input_value is None else str(factor.input_value),
                "triggered": factor.triggered,
                "severity": factor.severity.value,
                "weight": factor.weight,
                "contribution": factor.contribution,
                "explanation": factor.explanation,
            }
            for factor in assessment.risk_factors
        ]

        try:
            insert_response = (
                self._client.table(ASSESSMENTS_TABLE).insert(assessment_row).execute()
            )
            if factor_rows:
                self._client.table(FACTORS_TABLE).insert(factor_rows).execute()
        except APIError as exc:
            if _is_missing_table_error(exc):
                logger.error(
                    "Assessment tables missing for business_id=%s — run migration 002",
                    assessment.business_id,
                )
                raise AssessmentStorageNotConfiguredError() from exc
            logger.exception(
                "Supabase API error persisting assessment for business_id=%s",
                assessment.business_id,
            )
            raise DatabaseError() from exc
        except Exception as exc:
            logger.exception(
                "Failed to persist assessment for business_id=%s", assessment.business_id
            )
            raise DatabaseError() from exc

        data = insert_response.data
        if isinstance(data, list) and data:
            return data[0]
        return assessment_row

    def get_latest_by_business_id(self, business_id: str) -> dict[str, Any] | None:
        try:
            response = (
                self._client.table(ASSESSMENTS_TABLE)
                .select("*")
                .eq("business_id", business_id)
                .order("created_at", desc=True)
                .limit(1)
                .maybe_single()
                .execute()
            )
        except APIError as exc:
            if _is_missing_table_error(exc):
                return None
            logger.exception(
                "Failed to fetch assessment for business_id=%s", business_id
            )
            raise DatabaseError() from exc
        except Exception as exc:
            logger.exception(
                "Failed to fetch assessment for business_id=%s", business_id
            )
            raise DatabaseError() from exc

        if response is None:
            return None
        return response.data
