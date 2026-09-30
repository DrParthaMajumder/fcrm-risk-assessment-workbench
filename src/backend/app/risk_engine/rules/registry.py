from app.risk_engine.models import RuleDefinition
from app.risk_engine.rules.definitions import RULES_V1_0
from app.risk_engine.versioning import SUPPORTED_RULE_VERSIONS

_REGISTRY: dict[str, tuple[RuleDefinition, ...]] = {
    "1.0": RULES_V1_0,
}


def get_rules_for_version(version: str) -> list[RuleDefinition]:
    if version not in SUPPORTED_RULE_VERSIONS:
        raise ValueError(f"Unsupported rule version: {version}")
    return list(_REGISTRY[version])
