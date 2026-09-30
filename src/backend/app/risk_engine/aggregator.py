from app.risk_engine.models import (
    AssessmentStatus,
    DimensionResult,
    RiskDimension,
    RiskFactor,
    RuleEvaluationResult,
    ScoringStatus,
)
from app.risk_engine.policy.demo_policy import DEMO_RULE_WEIGHTS
from app.risk_engine.enums import RiskLevel
from app.risk_engine.policy.models import ScoringPolicy
from app.risk_engine.scoring import PolicyScorer


class RiskAggregator:
    """Aggregates rule results into dimension summaries and applies scoring policy."""

    def __init__(self, policy: ScoringPolicy | None = None) -> None:
        self._policy = policy
        self._scorer = PolicyScorer(policy) if policy else None

    def build_factors(
        self,
        evaluations: list[RuleEvaluationResult],
    ) -> list[RiskFactor]:
        factors: list[RiskFactor] = []
        severity_multipliers = (
            self._policy.severity_multipliers if self._policy else {}
        )

        for idx, result in enumerate(evaluations):
            contribution = 0.0
            if result.triggered and self._policy:
                multiplier = severity_multipliers.get(result.severity, 1.0)
                contribution = round(result.weight * multiplier, 2)

            factors.append(
                RiskFactor(
                    factor_id=f"{result.rule_id}:{idx}",
                    rule_id=result.rule_id,
                    dimension=result.dimension,
                    field=result.field,
                    input_value=result.input_value,
                    triggered=result.triggered,
                    severity=result.severity,
                    weight=result.weight,
                    contribution=contribution,
                    explanation=result.reason,
                )
            )
        return factors

    def build_dimension_results(
        self,
        factors: list[RiskFactor],
    ) -> list[DimensionResult]:
        by_dimension: dict[RiskDimension, list[RiskFactor]] = {}
        for factor in factors:
            by_dimension.setdefault(factor.dimension, []).append(factor)

        results: list[DimensionResult] = []
        for dimension in RiskDimension:
            dim_factors = by_dimension.get(dimension, [])
            if not dim_factors:
                continue

            if self._scorer:
                score = self._scorer.dimension_score(dim_factors, DEMO_RULE_WEIGHTS)
                risk_level = self._scorer.risk_level_for_score(score)
            else:
                score = 0.0
                risk_level = RiskLevel.LOW

            results.append(
                DimensionResult(
                    dimension=dimension,
                    rules_evaluated=len(dim_factors),
                    rules_triggered=sum(1 for f in dim_factors if f.triggered),
                    dimension_score=score,
                    risk_level=risk_level,
                    factors=dim_factors,
                )
            )
        return results

    def score_assessment(
        self,
        factors: list[RiskFactor],
        dimension_results: list[DimensionResult],
    ) -> tuple[float, str, str, list[str]]:
        if not self._scorer:
            raise RuntimeError("Scoring policy is not configured")

        dimension_scores = {d.dimension: d.dimension_score for d in dimension_results}
        overall = self._scorer.overall_score(dimension_scores)
        band = self._scorer.overall_risk_band(overall)
        recommendation, reasons = self._scorer.recommend(factors, band)
        return overall, band.value, recommendation.value, reasons

    def scoring_status(self) -> ScoringStatus:
        if self._policy:
            return ScoringStatus.COMPLETED
        return ScoringStatus.POLICY_NOT_CONFIGURED

    def assessment_status(self, validation_valid: bool) -> AssessmentStatus:
        if not validation_valid:
            return AssessmentStatus.VALIDATION_FAILED
        return AssessmentStatus.COMPLETED
