import logging
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from app.risk_engine.aggregator import RiskAggregator
from app.risk_engine.evaluator import RuleEvaluator
from app.risk_engine.features import build_feature_model, extract_features
from app.risk_engine.models import AssessmentResult, ScoringStatus
from app.risk_engine.policy.demo_policy import get_demo_policy
from app.risk_engine.rules.registry import get_rules_for_version
from app.risk_engine.validator import InputValidator
from app.risk_engine.versioning import CURRENT_RULE_VERSION

logger = logging.getLogger(__name__)


class RiskEngine:
    """
    Deterministic risk assessment engine.

    Callable independently of LangGraph:
        RiskEngine().assess(application_row)
    """

    def __init__(
        self,
        rule_version: str = CURRENT_RULE_VERSION,
        validator: InputValidator | None = None,
        evaluator: RuleEvaluator | None = None,
        aggregator: RiskAggregator | None = None,
        use_demo_policy: bool = True,
    ) -> None:
        self._rule_version = rule_version
        self._validator = validator or InputValidator()
        self._evaluator = evaluator or RuleEvaluator()
        policy = get_demo_policy() if use_demo_policy else None
        self._aggregator = aggregator or RiskAggregator(policy=policy)
        self._scoring_policy_version = policy.policy_id if policy else None

    @property
    def rule_version(self) -> str:
        return self._rule_version

    def assess(self, application_row: dict[str, Any]) -> AssessmentResult:
        logger.info(
            "Starting risk assessment for Business_ID=%s rule_version=%s",
            application_row.get("Business_ID"),
            self._rule_version,
        )

        raw_features = extract_features(application_row)
        validation = self._validator.validate_raw(raw_features)

        if not validation.valid:
            logger.warning(
                "Validation failed for Business_ID=%s: %d errors",
                application_row.get("Business_ID"),
                len(validation.errors),
            )
            return AssessmentResult(
                assessment_id=uuid4(),
                business_id=str(application_row.get("Business_ID", "")),
                rule_version=self._rule_version,
                scoring_policy_version=self._scoring_policy_version,
                status=self._aggregator.assessment_status(False),
                scoring_status=ScoringStatus.POLICY_NOT_CONFIGURED,
                validation=validation,
                risk_factors=[],
                dimension_results=[],
                overall_score=None,
                risk_band=None,
                recommendation=None,
                recommendation_reasons=[],
                evaluated_at=datetime.now(UTC),
            )

        features = build_feature_model(raw_features)
        rules = get_rules_for_version(self._rule_version)
        evaluations = self._evaluator.evaluate_all(features, rules)
        factors = self._aggregator.build_factors(evaluations)
        dimension_results = self._aggregator.build_dimension_results(factors)

        overall_score: float | None = None
        risk_band: str | None = None
        recommendation: str | None = None
        recommendation_reasons: list[str] = []

        if self._aggregator.scoring_status() == ScoringStatus.COMPLETED:
            overall_score, risk_band, recommendation, recommendation_reasons = (
                self._aggregator.score_assessment(factors, dimension_results)
            )

        logger.info(
            "Assessment complete for business_id=%s: %d rules evaluated, %d triggered, score=%s",
            features.business_id,
            len(evaluations),
            sum(1 for e in evaluations if e.triggered),
            overall_score,
        )

        return AssessmentResult(
            assessment_id=uuid4(),
            business_id=features.business_id,
            rule_version=self._rule_version,
            scoring_policy_version=self._scoring_policy_version,
            status=self._aggregator.assessment_status(True),
            scoring_status=self._aggregator.scoring_status(),
            validation=validation,
            risk_factors=factors,
            dimension_results=dimension_results,
            overall_score=overall_score,
            risk_band=risk_band,
            recommendation=recommendation,
            recommendation_reasons=recommendation_reasons,
            evaluated_at=datetime.now(UTC),
        )
