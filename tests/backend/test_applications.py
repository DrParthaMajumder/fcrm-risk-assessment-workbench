from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_application_service
from app.core.exceptions import DatabaseError
from app.main import app
from app.services.application_service import ApplicationService


@pytest.fixture
def mock_service() -> MagicMock:
    return MagicMock(spec=ApplicationService)


@pytest.fixture
def client_with_mock(mock_service: MagicMock) -> TestClient:
    app.dependency_overrides[get_application_service] = lambda: mock_service
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_get_application_found(client_with_mock: TestClient, mock_service: MagicMock) -> None:
    mock_service.get_application_by_business_id.return_value = {
        "Business_ID": "SME-10000",
        "Business_Name": "Cruz Inc",
        "Owner_Name": "Jacob Williamson",
        "US_State": "Kentucky",
        "Industry": "Logistics",
        "Market_Condition": "Stable",
        "Loan_Purpose": "Equipment Purchase",
        "Years_in_Business": "8",
        "Owner_Ownership_Percent": "59",
        "Annual_Revenue": "8644502",
        "Monthly_Revenue": "720375.17",
        "Owner_Monthly_Income": "95127.5",
        "EBITDA": "781648.01",
        "Operating_Profit": "615613.14",
        "Net_Profit_Margin": "0.05",
        "Operating_Cash_Flow": "497442.88",
        "Owner_Credit_Score": "627",
        "Previous_Defaults": "1",
        "Debt_to_Equity_Ratio": "3.41",
        "Current_Ratio": "1.16",
        "Loan_Amount_Requested": "520208",
        "Last_Loan_Amount": "0",
        "Document_Verification": "Verified",
        "Loan_Status": "Defer",
        "EIN_Letter": "Verified",
        "Formation_Articles": "Verified",
        "Governance_Bylaws": "Verified",
        "Business_License": "Verified",
        "Commercial_Lease": "Verified",
        "Tax_Returns_2Yrs": "Verified",
        "Bank_Statements_6Mo": "Verified",
        "PnL_YTD": "Verified",
        "Balance_Sheet": "Verified",
        "Debt_Schedule": "Verified",
        "Owner_Gov_ID": "Verified",
        "Personal_Financial_Statement": "Verified",
        "Credit_Report_Auth": "Verified",
        "Business_Plan": "Verified",
        "SBA_Forms": "Verified",
        "Collateral_Proof": "Not_Required",
        "Completeness_Score": "1.0",
        "NSF_Last_6_Months": "0",
        "Average_Daily_Balance": "128346.97",
        "Revenue_Volatility": "0.143",
        "Customer_Concentration": "0.85",
        "Online_Rating": "4.2",
        "Review_Volume": "63",
        "Website_Active": "True",
        "Recent_Hard_Inquiries_90D": "1",
        "Credit_Utilization_Ratio": "0.13",
        "Age_Oldest_Trade_Line_Months": "23",
        "Local_Unemployment_Rate": "6.1",
        "Industry_Growth_Forecast": "0.026",
    }

    response = client_with_mock.get("/api/v1/applications/SME-10000")

    assert response.status_code == 200
    assert response.json()["Business_ID"] == "SME-10000"
    mock_service.get_application_by_business_id.assert_called_once_with("SME-10000")


def test_get_application_not_found(client_with_mock: TestClient, mock_service: MagicMock) -> None:
    from app.core.exceptions import ApplicationNotFoundError

    mock_service.get_application_by_business_id.side_effect = ApplicationNotFoundError(
        "DOES-NOT-EXIST"
    )

    response = client_with_mock.get("/api/v1/applications/DOES-NOT-EXIST")

    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}


def test_database_error_maps_to_500(client_with_mock: TestClient, mock_service: MagicMock) -> None:
    mock_service.get_application_by_business_id.side_effect = DatabaseError()

    response = client_with_mock.get("/api/v1/applications/SME-10000")

    assert response.status_code == 500
    assert "detail" in response.json()


def test_router_registered(client: TestClient) -> None:
    paths = client.app.openapi()["paths"]
    assert "/api/v1/applications/{business_id}" in paths
