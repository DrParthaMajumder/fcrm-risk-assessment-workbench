from typing import Any

from app.risk_engine.models import (
    RiskApplicationFeatures,
    ValidationErrorDetail,
    ValidationResult,
)

BLOCKING_REQUIRED_FIELDS: tuple[str, ...] = (
    "business_id",
    "business_name",
)

WARN_IF_MISSING_FIELDS: tuple[str, ...] = (
    "owner_credit_score",
    "document_verification",
    "annual_revenue",
    "operating_cash_flow",
)


class InputValidator:
    """Validates raw feature dict before rule evaluation."""

    def validate_raw(self, features: dict[str, Any]) -> ValidationResult:
        errors: list[ValidationErrorDetail] = []
        warnings: list[ValidationErrorDetail] = []

        for field in BLOCKING_REQUIRED_FIELDS:
            if field not in features or features[field] is None:
                errors.append(
                    ValidationErrorDetail(
                        field=field,
                        code="MISSING_REQUIRED",
                        message=f"Required field '{field}' is missing or null.",
                    )
                )

        for field in WARN_IF_MISSING_FIELDS:
            if field not in features or features[field] is None:
                warnings.append(
                    ValidationErrorDetail(
                        field=field,
                        code="MISSING_OPTIONAL",
                        message=(
                            f"Field '{field}' is missing — related rules may not apply."
                        ),
                    )
                )

        if "business_id" in features and features["business_id"] is not None:
            if not str(features["business_id"]).strip():
                errors.append(
                    ValidationErrorDetail(
                        field="business_id",
                        code="INVALID_VALUE",
                        message="business_id must be a non-empty string.",
                    )
                )

        numeric_fields = (
            "owner_credit_score",
            "annual_revenue",
            "operating_cash_flow",
            "completeness_score",
        )
        for field in numeric_fields:
            if field in features and features[field] is not None:
                try:
                    float(features[field])
                except (TypeError, ValueError):
                    errors.append(
                        ValidationErrorDetail(
                            field=field,
                            code="INVALID_VALUE",
                            message=f"Field '{field}' must be numeric.",
                        )
                    )

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )

    def validate_model(self, features: RiskApplicationFeatures) -> ValidationResult:
        return self.validate_raw(features.model_dump())
