from pydantic import BaseModel, ConfigDict, Field

from app.risk_engine.enums import Recommendation, RiskDimension, RiskLevel, RuleSeverity


class RiskBandBoundary(BaseModel):
    model_config = ConfigDict(frozen=True)

    level: RiskLevel
    min_score: float
    max_score: float


class ScoringPolicy(BaseModel):
    """
    Externalized scoring configuration.

    Replace demo values with business-approved policy without changing engine code.
    """

    model_config = ConfigDict(frozen=True)

    policy_id: str
    label: str
    severity_multipliers: dict[RuleSeverity, float]
    dimension_weights: dict[RiskDimension, float]
    risk_band_boundaries: tuple[RiskBandBoundary, ...]
    critical_recommendation: Recommendation = Recommendation.REJECT
    band_recommendations: dict[RiskLevel, Recommendation] = Field(default_factory=dict)
