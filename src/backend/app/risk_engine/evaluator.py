from typing import Any

from app.risk_engine.enums import RuleOperator, RuleStatus
from app.risk_engine.models import (
    RiskApplicationFeatures,
    RuleDefinition,
    RuleEvaluationResult,
)


class RuleEvaluator:
    """Deterministic rule evaluator — no LLM, no database access."""

    def evaluate(
        self,
        features: RiskApplicationFeatures,
        rule: RuleDefinition,
    ) -> RuleEvaluationResult:
        if rule.status != RuleStatus.ACTIVE:
            return RuleEvaluationResult(
                rule_id=rule.rule_id,
                version=rule.version,
                dimension=rule.dimension,
                field=rule.field,
                input_value=None,
                triggered=False,
                severity=rule.severity,
                weight=rule.weight,
                reason=f"Rule {rule.rule_id} is {rule.status}; skipped.",
            )

        input_value = self._get_field_value(features, rule.field)
        triggered = self._apply_operator(rule.operator, input_value, rule.threshold)
        reason = self._build_reason(rule, input_value, triggered)

        return RuleEvaluationResult(
            rule_id=rule.rule_id,
            version=rule.version,
            dimension=rule.dimension,
            field=rule.field,
            input_value=input_value,
            triggered=triggered,
            severity=rule.severity,
            weight=rule.weight,
            reason=reason,
        )

    def evaluate_all(
        self,
        features: RiskApplicationFeatures,
        rules: list[RuleDefinition],
    ) -> list[RuleEvaluationResult]:
        return [self.evaluate(features, rule) for rule in rules]

    @staticmethod
    def _get_field_value(features: RiskApplicationFeatures, field: str) -> Any:
        if not hasattr(features, field):
            raise ValueError(f"Unknown feature field: {field}")
        return getattr(features, field)

    @staticmethod
    def _apply_operator(operator: RuleOperator, value: Any, threshold: Any) -> bool:
        if operator == RuleOperator.IS_NULL:
            return value is None
        if operator == RuleOperator.IS_NOT_NULL:
            return value is not None
        if value is None:
            return False

        if operator == RuleOperator.EQUALS:
            return value == threshold
        if operator == RuleOperator.NOT_EQUALS:
            return value != threshold
        if operator == RuleOperator.IN:
            return value in (threshold or [])
        if operator == RuleOperator.NOT_IN:
            return value not in (threshold or [])
        if operator == RuleOperator.LESS_THAN:
            return value < threshold
        if operator == RuleOperator.LESS_THAN_OR_EQUAL:
            return value <= threshold
        if operator == RuleOperator.GREATER_THAN:
            return value > threshold
        if operator == RuleOperator.GREATER_THAN_OR_EQUAL:
            return value >= threshold

        raise ValueError(f"Unsupported operator: {operator}")

    @staticmethod
    def _build_reason(rule: RuleDefinition, input_value: Any, triggered: bool) -> str:
        state = "triggered" if triggered else "not triggered"
        if input_value is None:
            return (
                f"Rule '{rule.name}' ({rule.rule_id} v{rule.version}) {state}: "
                f"field '{rule.field}' is missing — rule not applied."
            )
        return (
            f"Rule '{rule.name}' ({rule.rule_id} v{rule.version}) {state}: "
            f"field '{rule.field}' value {input_value!r} "
            f"{rule.operator.value} {rule.threshold!r}."
        )
