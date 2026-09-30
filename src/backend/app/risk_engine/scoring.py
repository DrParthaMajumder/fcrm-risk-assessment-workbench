"""
Deterministic scoring: dimension scores, overall score, risk band, recommendation.

Formula (documented):
1. For each rule in a dimension with weight W and severity multiplier S:
   - If triggered: contribution = W * S
   - Max possible per dimension = sum(W) for all active rules in dimension
2. dimension_score = min(100, (sum(triggered contributions) / max_possible) * 100)
3. overall_score = weighted average of dimension scores using policy dimension_weights
4. risk_band = band where overall_score falls in [min_score, max_score]
5. recommendation = REJECT if any CRITICAL severity rule triggered;
   else band_recommendations[risk_band]; critical overrides to REJECT
"""

from app.risk_engine.enums import RiskDimension, Recommendation, RiskLevel, RuleSeverity
from app.risk_engine.models import RiskFactor
from app.risk_engine.policy.models import ScoringPolicy


class PolicyScorer:
    def __init__(self, policy: ScoringPolicy) -> None:
        self._policy = policy

    def dimension_score(
        self,
        factors: list[RiskFactor],
        rule_weights: dict[str, float],
    ) -> float:
        if not factors:
            return 0.0

        max_possible = sum(rule_weights.get(f.rule_id, f.weight or 0) for f in factors)
        if max_possible <= 0:
            return 0.0

        triggered_sum = sum(
            (f.weight or 0) * self._policy.severity_multipliers[f.severity]
            for f in factors
            if f.triggered
        )
        return min(100.0, round((triggered_sum / max_possible) * 100, 2))

    def risk_level_for_score(self, score: float) -> RiskLevel:
        for boundary in self._policy.risk_band_boundaries:
            if boundary.min_score <= score <= boundary.max_score:
                return boundary.level
        return RiskLevel.CRITICAL

    def overall_score(
        self,
        dimension_scores: dict[RiskDimension, float],
    ) -> float:
        total_weight = 0.0
        weighted_sum = 0.0
        for dimension, weight in self._policy.dimension_weights.items():
            if dimension in dimension_scores:
                weighted_sum += dimension_scores[dimension] * weight
                total_weight += weight
        if total_weight <= 0:
            return 0.0
        return round(weighted_sum / total_weight, 2)

    def overall_risk_band(self, overall_score: float) -> RiskLevel:
        return self.risk_level_for_score(overall_score)

    def recommend(
        self,
        factors: list[RiskFactor],
        overall_band: RiskLevel,
    ) -> tuple[Recommendation, list[str]]:
        reasons: list[str] = []

        critical = [f for f in factors if f.triggered and f.severity == RuleSeverity.CRITICAL]
        if critical:
            for f in critical:
                reasons.append(
                    f"Critical factor {f.rule_id} ({f.dimension.value}): {f.explanation}"
                )
            return self._policy.critical_recommendation, reasons

        high = [f for f in factors if f.triggered and f.severity == RuleSeverity.HIGH]
        recommendation = self._policy.band_recommendations.get(
            overall_band, Recommendation.REVIEW
        )

        reasons.append(
            f"Overall risk band {overall_band.value} mapped to {recommendation.value} "
            f"(policy: {self._policy.policy_id})."
        )
        if high:
            reasons.append(
                f"{len(high)} high-severity factor(s) contributed to the assessment."
            )
        triggered_dims = {f.dimension.value for f in factors if f.triggered}
        if triggered_dims:
            reasons.append(f"Triggered dimensions: {', '.join(sorted(triggered_dims))}.")
        else:
            reasons.append("No configured risk rules were triggered.")

        return recommendation, reasons
