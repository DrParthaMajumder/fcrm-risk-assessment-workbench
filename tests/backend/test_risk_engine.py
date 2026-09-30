from datetime import UTC, datetime

import pytest

from app.risk_engine.engine import RiskEngine
from app.risk_engine.evaluator import RuleEvaluator
from app.risk_engine.features import build_feature_model, extract_features
from app.risk_engine.enums import (
    AssessmentStatus,
    RiskDimension,
    RuleOperator,
    RuleSeverity,
    RuleStatus,
    ScoringStatus,
)
from app.risk_engine.models import RiskApplicationFeatures, RuleDefinition
from app.risk_engine.policy.demo_policy import DEMO_POLICY_VERSION, DEMO_SCORING_POLICY, get_demo_policy
from app.risk_engine.rules.registry import get_rules_for_version
from app.risk_engine.scoring import PolicyScorer
from app.risk_engine.validator import InputValidator
from app.risk_engine.versioning import CURRENT_RULE_VERSION


def _sample_features(**overrides: object) -> RiskApplicationFeatures:
    base = {
        "business_id": "SME-TEST",
        "business_name": "Test Co",
        "owner_name": "Owner",
        "us_state": "Ohio",
        "industry": "Retail",
        "market_condition": "Stable",
        "loan_purpose": "Working Capital",
        "years_in_business": 5,
        "owner_ownership_percent": 80,
        "annual_revenue": 1_000_000,
        "monthly_revenue": 83333.33,
        "owner_monthly_income": 10000.0,
        "ebitda": 100000.0,
        "operating_profit": 80000.0,
        "net_profit_margin": 0.08,
        "operating_cash_flow": 75000.0,
        "owner_credit_score": 700,
        "previous_defaults": 0,
        "debt_to_equity_ratio": 1.2,
        "current_ratio": 1.5,
        "loan_amount_requested": 100000,
        "last_loan_amount": 0,
        "document_verification": "Verified",
        "ein_letter": "Verified",
        "formation_articles": "Verified",
        "governance_bylaws": "Verified",
        "business_license": "Verified",
        "commercial_lease": "Verified",
        "tax_returns_2yrs": "Verified",
        "bank_statements_6mo": "Verified",
        "pnl_ytd": "Verified",
        "balance_sheet": "Verified",
        "debt_schedule": "Verified",
        "owner_gov_id": "Verified",
        "personal_financial_statement": "Verified",
        "credit_report_auth": "Verified",
        "business_plan": "Not_Required",
        "sba_forms": "Not_Required",
        "collateral_proof": "Not_Required",
        "completeness_score": 1.0,
        "nsf_last_6_months": 0,
        "average_daily_balance": 50000.0,
        "revenue_volatility": 0.1,
        "customer_concentration": 0.5,
        "online_rating": 4.0,
        "review_volume": 50,
        "website_active": True,
        "recent_hard_inquiries_90d": 0,
        "credit_utilization_ratio": 0.2,
        "age_oldest_trade_line_months": 120,
        "local_unemployment_rate": 5.0,
        "industry_growth_forecast": 0.02,
    }
    base.update(overrides)
    return build_feature_model(base)


def _sample_db_row(**overrides: object) -> dict:
    features = _sample_features(**overrides)
    row = {
        "Business_ID": features.business_id,
        "Business_Name": features.business_name,
        "Owner_Name": features.owner_name,
        "US_State": features.us_state,
        "Industry": features.industry,
        "Market_Condition": features.market_condition,
        "Loan_Purpose": features.loan_purpose,
        "Years_in_Business": features.years_in_business,
        "Owner_Ownership_Percent": features.owner_ownership_percent,
        "Annual_Revenue": features.annual_revenue,
        "Monthly_Revenue": features.monthly_revenue,
        "Owner_Monthly_Income": features.owner_monthly_income,
        "EBITDA": features.ebitda,
        "Operating_Profit": features.operating_profit,
        "Net_Profit_Margin": features.net_profit_margin,
        "Operating_Cash_Flow": features.operating_cash_flow,
        "Owner_Credit_Score": features.owner_credit_score,
        "Previous_Defaults": features.previous_defaults,
        "Debt_to_Equity_Ratio": features.debt_to_equity_ratio,
        "Current_Ratio": features.current_ratio,
        "Loan_Amount_Requested": features.loan_amount_requested,
        "Last_Loan_Amount": features.last_loan_amount,
        "Document_Verification": features.document_verification,
        "Loan_Status": "Defer",
        "EIN_Letter": features.ein_letter,
        "Formation_Articles": features.formation_articles,
        "Governance_Bylaws": features.governance_bylaws,
        "Business_License": features.business_license,
        "Commercial_Lease": features.commercial_lease,
        "Tax_Returns_2Yrs": features.tax_returns_2yrs,
        "Bank_Statements_6Mo": features.bank_statements_6mo,
        "PnL_YTD": features.pnl_ytd,
        "Balance_Sheet": features.balance_sheet,
        "Debt_Schedule": features.debt_schedule,
        "Owner_Gov_ID": features.owner_gov_id,
        "Personal_Financial_Statement": features.personal_financial_statement,
        "Credit_Report_Auth": features.credit_report_auth,
        "Business_Plan": features.business_plan,
        "SBA_Forms": features.sba_forms,
        "Collateral_Proof": features.collateral_proof,
        "Completeness_Score": features.completeness_score,
        "NSF_Last_6_Months": features.nsf_last_6_months,
        "Average_Daily_Balance": features.average_daily_balance,
        "Revenue_Volatility": features.revenue_volatility,
        "Customer_Concentration": features.customer_concentration,
        "Online_Rating": features.online_rating,
        "Review_Volume": features.review_volume,
        "Website_Active": features.website_active,
        "Recent_Hard_Inquiries_90D": features.recent_hard_inquiries_90d,
        "Credit_Utilization_Ratio": features.credit_utilization_ratio,
        "Age_Oldest_Trade_Line_Months": features.age_oldest_trade_line_months,
        "Local_Unemployment_Rate": features.local_unemployment_rate,
        "Industry_Growth_Forecast": features.industry_growth_forecast,
    }
    row.update(overrides)
    return row


def test_feature_extraction_excludes_loan_status() -> None:
    row = _sample_db_row()
    features = extract_features(row)
    assert "loan_status" not in features
    assert features["business_id"] == "SME-TEST"


def test_loan_status_does_not_affect_assessment() -> None:
    engine = RiskEngine()
    row_a = _sample_db_row(Loan_Status="Approve")
    row_b = _sample_db_row(Loan_Status="Reject")
    result_a = engine.assess(row_a)
    result_b = engine.assess(row_b)
    assert result_a.overall_score == result_b.overall_score
    assert result_a.risk_band == result_b.risk_band
    assert result_a.recommendation == result_b.recommendation
    assert [f.triggered for f in result_a.risk_factors] == [
        f.triggered for f in result_b.risk_factors
    ]


def test_validation_blocking_missing_business_id() -> None:
    raw = extract_features(_sample_db_row())
    del raw["business_id"]
    result = InputValidator().validate_raw(raw)
    assert result.valid is False
    assert any(e.field == "business_id" for e in result.errors)


def test_validation_warnings_for_missing_credit_score() -> None:
    raw = extract_features(_sample_db_row())
    del raw["owner_credit_score"]
    result = InputValidator().validate_raw(raw)
    assert result.valid is True
    assert any(w.field == "owner_credit_score" for w in result.warnings)


def test_missing_value_not_converted_to_zero() -> None:
    raw = extract_features(_sample_db_row())
    del raw["owner_credit_score"]
    model = build_feature_model(raw)
    assert model.owner_credit_score is None


def test_rule_triggered_credit_low_score() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "CREDIT_001")
    features = _sample_features(owner_credit_score=550)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_rule_not_triggered_healthy_credit() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "CREDIT_001")
    features = _sample_features(owner_credit_score=720)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is False


def test_financial_negative_cash_flow() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "FIN_001")
    features = _sample_features(operating_cash_flow=-5000.0)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_business_limited_history() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "BUS_001")
    features = _sample_features(years_in_business=1)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_document_forged_critical() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "DOC_001")
    features = _sample_features(document_verification="Forged_Documents")
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True
    assert result.severity == RuleSeverity.CRITICAL


def test_document_missing_tax_returns() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "DOC_007")
    features = _sample_features(tax_returns_2yrs="Missing")
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_market_adverse_condition() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "MKT_001")
    features = _sample_features(market_condition="Recession")
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_reputation_poor_rating() -> None:
    rule = next(r for r in get_rules_for_version("1.0") if r.rule_id == "REP_001")
    features = _sample_features(online_rating=2.0)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is True


def test_inactive_rule_skipped() -> None:
    rule = RuleDefinition(
        rule_id="TEST_003",
        name="Inactive",
        dimension=RiskDimension.CREDIT,
        field="owner_credit_score",
        operator=RuleOperator.LESS_THAN,
        threshold=999,
        severity=RuleSeverity.HIGH,
        weight=10,
        description="test",
        version="1.0",
        status=RuleStatus.INACTIVE,
    )
    features = _sample_features(owner_credit_score=500)
    result = RuleEvaluator().evaluate(features, rule)
    assert result.triggered is False


def test_rule_version_registry_has_six_dimensions() -> None:
    rules = get_rules_for_version("1.0")
    dimensions = {r.dimension for r in rules}
    assert RiskDimension.CREDIT in dimensions
    assert RiskDimension.FINANCIAL in dimensions
    assert RiskDimension.BUSINESS in dimensions
    assert RiskDimension.DOCUMENT_COMPLIANCE in dimensions
    assert RiskDimension.MARKET_INDUSTRY in dimensions
    assert RiskDimension.REPUTATION_OPERATIONAL in dimensions
    assert len(rules) == 27


def test_rule_version_unsupported() -> None:
    with pytest.raises(ValueError, match="Unsupported rule version"):
        get_rules_for_version("9.9")


def test_assessment_deterministic() -> None:
    engine = RiskEngine(rule_version=CURRENT_RULE_VERSION)
    row = _sample_db_row(previous_defaults=1, operating_cash_flow=-1000.0)
    first = engine.assess(row)
    second = engine.assess(row)
    assert first.overall_score == second.overall_score
    assert first.risk_band == second.risk_band
    assert first.recommendation == second.recommendation


def test_assessment_completed_with_demo_policy() -> None:
    engine = RiskEngine()
    result = engine.assess(_sample_db_row())
    assert result.status == AssessmentStatus.COMPLETED
    assert result.scoring_status == ScoringStatus.COMPLETED
    assert result.scoring_policy_version == DEMO_POLICY_VERSION
    assert result.overall_score is not None
    assert result.risk_band is not None
    assert result.recommendation is not None
    assert len(result.recommendation_reasons) > 0
    assert len(result.dimension_results) == 6


def test_healthy_profile_low_score() -> None:
    engine = RiskEngine()
    result = engine.assess(_sample_db_row())
    assert result.overall_score == 0.0
    assert result.risk_band == "LOW"
    assert result.recommendation == "APPROVE"


def test_risky_credit_profile() -> None:
    engine = RiskEngine()
    result = engine.assess(
        _sample_db_row(
            Owner_Credit_Score=540,
            Previous_Defaults=1,
            Credit_Utilization_Ratio=0.9,
            Recent_Hard_Inquiries_90D=5,
            Age_Oldest_Trade_Line_Months=12,
        )
    )
    credit = next(d for d in result.dimension_results if d.dimension == RiskDimension.CREDIT)
    assert credit.rules_triggered >= 3
    assert credit.dimension_score > 0
    assert result.overall_score > 0


def test_critical_forged_document_rejects() -> None:
    engine = RiskEngine()
    result = engine.assess(
        _sample_db_row(Document_Verification="Forged_Documents")
    )
    assert result.recommendation == "REJECT"
    critical = [f for f in result.risk_factors if f.triggered and f.severity == RuleSeverity.CRITICAL]
    assert len(critical) >= 1


def test_validation_failure_stops_scoring() -> None:
    engine = RiskEngine()
    row = _sample_db_row()
    del row["Business_Name"]
    result = engine.assess(row)
    assert result.status == AssessmentStatus.VALIDATION_FAILED
    assert result.overall_score is None
    assert result.risk_band is None
    assert result.recommendation is None
    assert result.risk_factors == []


def test_dimension_scoring_from_policy() -> None:
    from app.risk_engine.models import RiskFactor

    scorer = PolicyScorer(get_demo_policy())
    factor = RiskFactor(
        factor_id="CREDIT_001:0",
        rule_id="CREDIT_001",
        dimension=RiskDimension.CREDIT,
        field="owner_credit_score",
        input_value=550,
        triggered=True,
        severity=RuleSeverity.HIGH,
        weight=25.0,
        contribution=37.5,
        explanation="test",
    )
    score = scorer.dimension_score([factor], {"CREDIT_001": 25.0})
    assert score == 100.0


def test_overall_score_weighted_average() -> None:
    scorer = PolicyScorer(DEMO_SCORING_POLICY)
    scores = {
        RiskDimension.CREDIT: 40.0,
        RiskDimension.FINANCIAL: 20.0,
        RiskDimension.BUSINESS: 0.0,
        RiskDimension.DOCUMENT_COMPLIANCE: 0.0,
        RiskDimension.MARKET_INDUSTRY: 0.0,
        RiskDimension.REPUTATION_OPERATIONAL: 0.0,
    }
    overall = scorer.overall_score(scores)
    expected = round(40 * 0.25 + 20 * 0.25, 2)
    assert overall == expected


def test_csv_style_row_sme_10004_like() -> None:
    """Integration-style test using a representative clean application profile."""
    engine = RiskEngine()
    row = _sample_db_row(
        Business_ID="SME-10004",
        Business_Name="Clean Case LLC",
        Owner_Credit_Score=780,
        Previous_Defaults=0,
        Operating_Cash_Flow=1_950_000.0,
        Document_Verification="Verified",
        Annual_Revenue=5_000_000,
        Loan_Amount_Requested=250_000,
        Loan_Status="Approve",
    )
    result = engine.assess(row)
    assert result.business_id == "SME-10004"
    assert result.scoring_status == ScoringStatus.COMPLETED
    assert sum(1 for f in result.risk_factors if f.triggered) == 0
