"""
DEMO / NOT PRODUCTION POLICY

All thresholds, weights, bands, and recommendation mappings in this file are
for demonstration and testing only. Replace with business-approved values
before any production underwriting use.
"""

from app.risk_engine.enums import Recommendation, RiskDimension, RiskLevel, RuleSeverity
from app.risk_engine.policy.models import RiskBandBoundary, ScoringPolicy

DEMO_POLICY_VERSION = "demo-1.0"

# --- Rule thresholds (DEMO only) --------------------------------------------

DEMO_THRESHOLDS = {
    "CREDIT_001": 580,
    "CREDIT_002": 0,
    "CREDIT_003": 0.75,
    "CREDIT_004": 3,
    "CREDIT_005": 24,
    "FIN_001": 0,
    "FIN_002": -0.01,
    "FIN_003": 1.0,
    "FIN_004": 3.0,
    "FIN_005": 2,
    "FIN_006": 0.25,
    "FIN_007": 0.50,
    "BUS_001": 2,
    "BUS_002": 0.80,
    "DOC_004": 0.85,
    "MKT_002": 7.0,
    "MKT_003": 0.0,
    "REP_001": 2.5,
    "REP_002": 10,
}

DEMO_CATEGORICAL = {
    "DOC_001": "Forged_Documents",
    "DOC_002": "Missing_Critical_Docs",
    "DOC_003": "Forged",
    "DOC_005": "Missing",
    "DOC_006": "Missing",
    "DOC_007": "Missing",
    "MKT_001": ["Volatile", "Recession"],
    "REP_003": False,
}

DEMO_RULE_WEIGHTS: dict[str, float] = {
    "CREDIT_001": 25,
    "CREDIT_002": 30,
    "CREDIT_003": 15,
    "CREDIT_004": 10,
    "CREDIT_005": 10,
    "FIN_001": 20,
    "FIN_002": 15,
    "FIN_003": 15,
    "FIN_004": 15,
    "FIN_005": 20,
    "FIN_006": 10,
    "FIN_007": 15,
    "BUS_001": 15,
    "BUS_002": 20,
    "DOC_001": 40,
    "DOC_002": 30,
    "DOC_003": 25,
    "DOC_004": 15,
    "DOC_005": 20,
    "DOC_006": 15,
    "DOC_007": 15,
    "MKT_001": 20,
    "MKT_002": 15,
    "MKT_003": 15,
    "REP_001": 10,
    "REP_002": 8,
    "REP_003": 5,
}

DEMO_SCORING_POLICY = ScoringPolicy(
    policy_id=DEMO_POLICY_VERSION,
    label="DEMO / NOT PRODUCTION POLICY",
    severity_multipliers={
        RuleSeverity.INFO: 0.25,
        RuleSeverity.LOW: 0.50,
        RuleSeverity.MEDIUM: 1.00,
        RuleSeverity.HIGH: 1.50,
        RuleSeverity.CRITICAL: 2.00,
    },
    dimension_weights={
        RiskDimension.CREDIT: 0.25,
        RiskDimension.FINANCIAL: 0.25,
        RiskDimension.BUSINESS: 0.15,
        RiskDimension.DOCUMENT_COMPLIANCE: 0.20,
        RiskDimension.MARKET_INDUSTRY: 0.10,
        RiskDimension.REPUTATION_OPERATIONAL: 0.05,
    },
    risk_band_boundaries=(
        RiskBandBoundary(level=RiskLevel.LOW, min_score=0, max_score=25),
        RiskBandBoundary(level=RiskLevel.MEDIUM, min_score=26, max_score=50),
        RiskBandBoundary(level=RiskLevel.HIGH, min_score=51, max_score=75),
        RiskBandBoundary(level=RiskLevel.CRITICAL, min_score=76, max_score=100),
    ),
    critical_recommendation=Recommendation.REJECT,
    band_recommendations={
        RiskLevel.LOW: Recommendation.APPROVE,
        RiskLevel.MEDIUM: Recommendation.REVIEW,
        RiskLevel.HIGH: Recommendation.REVIEW,
        RiskLevel.CRITICAL: Recommendation.REJECT,
    },
)


def get_demo_policy() -> ScoringPolicy:
    return DEMO_SCORING_POLICY
