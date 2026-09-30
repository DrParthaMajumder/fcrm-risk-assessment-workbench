from datetime import UTC, datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_assessment_service
from app.main import app
from app.risk_engine.enums import (
    AssessmentStatus,
    RiskDimension,
    RuleSeverity,
    ScoringStatus,
)
from app.risk_engine.models import AssessmentResult, RiskFactor, ValidationResult
from app.services.assessment_service import AssessmentRunResult, AssessmentService


@pytest.fixture
def mock_assessment_service() -> MagicMock:
    return MagicMock(spec=AssessmentService)


@pytest.fixture
def client_with_mock(mock_assessment_service: MagicMock) -> TestClient:
    app.dependency_overrides[get_assessment_service] = lambda: mock_assessment_service
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_post_assessment_success(
    client_with_mock: TestClient, mock_assessment_service: MagicMock
) -> None:
    mock_assessment_service.run_assessment.return_value = AssessmentRunResult(
        result=AssessmentResult(
            assessment_id=uuid4(),
            business_id="SME-10000",
            rule_version="1.0",
            scoring_policy_version="demo-1.0",
            status=AssessmentStatus.COMPLETED,
            scoring_status=ScoringStatus.COMPLETED,
            validation=ValidationResult(valid=True),
            risk_factors=[
                RiskFactor(
                    factor_id="CREDIT_002:0",
                    rule_id="CREDIT_002",
                    dimension=RiskDimension.CREDIT,
                    field="previous_defaults",
                    input_value=1,
                    triggered=True,
                    severity=RuleSeverity.HIGH,
                    weight=30.0,
                    contribution=45.0,
                    explanation="test",
                )
            ],
            dimension_results=[],
            overall_score=12.5,
            risk_band="LOW",
            recommendation="REVIEW",
            recommendation_reasons=["test reason"],
            evaluated_at=datetime.now(UTC),
        ),
        persisted=False,
        storage_message="tables missing",
    )

    response = client_with_mock.post("/api/v1/applications/SME-10000/assessment")

    assert response.status_code == 200
    body = response.json()
    assert body["business_id"] == "SME-10000"
    assert body["rule_version"] == "1.0"
    assert body["scoring_policy_version"] == "demo-1.0"
    assert body["scoring_status"] == "COMPLETED"
    assert body["overall_score"] == 12.5
    assert body["recommendation"] == "REVIEW"
    assert body["persisted"] is False
    assert len(body["risk_factors"]) == 1
    mock_assessment_service.run_assessment.assert_called_once_with("SME-10000")


def test_post_assessment_not_found(
    client_with_mock: TestClient, mock_assessment_service: MagicMock
) -> None:
    from app.core.exceptions import ApplicationNotFoundError

    mock_assessment_service.run_assessment.side_effect = ApplicationNotFoundError(
        "INVALID"
    )

    response = client_with_mock.post("/api/v1/applications/INVALID/assessment")

    assert response.status_code == 404


def test_assessment_router_registered(client_with_mock: TestClient) -> None:
    paths = client_with_mock.app.openapi()["paths"]
    assert "/api/v1/applications/{business_id}/assessment" in paths
