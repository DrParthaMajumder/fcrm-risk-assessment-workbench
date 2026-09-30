from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.risk_engine.enums import (
    AssessmentStatus,
    RiskDimension,
    RiskLevel,
    RuleOperator,
    RuleSeverity,
    RuleStatus,
    ScoringStatus,
)


class ValidationErrorDetail(BaseModel):
    field: str
    code: str
    message: str


class ValidationResult(BaseModel):
    valid: bool
    errors: list[ValidationErrorDetail] = Field(default_factory=list)
    warnings: list[ValidationErrorDetail] = Field(default_factory=list)


class RuleDefinition(BaseModel):
    model_config = ConfigDict(frozen=True)

    rule_id: str
    name: str
    dimension: RiskDimension
    field: str
    operator: RuleOperator
    threshold: Any | None = None
    severity: RuleSeverity
    weight: float
    description: str
    version: str
    status: RuleStatus = RuleStatus.ACTIVE
    effective_from: datetime | None = None
    effective_to: datetime | None = None


class RuleEvaluationResult(BaseModel):
    rule_id: str
    version: str
    dimension: RiskDimension
    field: str
    input_value: Any | None
    triggered: bool
    severity: RuleSeverity
    weight: float
    reason: str


class RiskFactor(BaseModel):
    factor_id: str
    rule_id: str
    dimension: RiskDimension
    field: str
    input_value: Any | None
    triggered: bool
    severity: RuleSeverity
    weight: float
    contribution: float
    explanation: str


class DimensionResult(BaseModel):
    dimension: RiskDimension
    rules_evaluated: int
    rules_triggered: int
    dimension_score: float
    risk_level: RiskLevel
    factors: list[RiskFactor] = Field(default_factory=list)


class RiskApplicationFeatures(BaseModel):
    """Internal feature model for the rule engine. Loan_Status is never included."""

    model_config = ConfigDict(frozen=True)

    business_id: str
    business_name: str
    owner_name: str | None = None
    us_state: str | None = None
    industry: str | None = None
    market_condition: str | None = None
    loan_purpose: str | None = None
    years_in_business: int | None = None
    owner_ownership_percent: int | None = None
    annual_revenue: int | None = None
    monthly_revenue: float | None = None
    owner_monthly_income: float | None = None
    ebitda: float | None = None
    operating_profit: float | None = None
    net_profit_margin: float | None = None
    operating_cash_flow: float | None = None
    owner_credit_score: int | None = None
    previous_defaults: int | None = None
    debt_to_equity_ratio: float | None = None
    current_ratio: float | None = None
    loan_amount_requested: int | None = None
    last_loan_amount: int | None = None
    document_verification: str | None = None
    ein_letter: str | None = None
    formation_articles: str | None = None
    governance_bylaws: str | None = None
    business_license: str | None = None
    commercial_lease: str | None = None
    tax_returns_2yrs: str | None = None
    bank_statements_6mo: str | None = None
    pnl_ytd: str | None = None
    balance_sheet: str | None = None
    debt_schedule: str | None = None
    owner_gov_id: str | None = None
    personal_financial_statement: str | None = None
    credit_report_auth: str | None = None
    business_plan: str | None = None
    sba_forms: str | None = None
    collateral_proof: str | None = None
    completeness_score: float | None = None
    nsf_last_6_months: int | None = None
    average_daily_balance: float | None = None
    revenue_volatility: float | None = None
    customer_concentration: float | None = None
    online_rating: float | None = None
    review_volume: int | None = None
    website_active: bool | None = None
    recent_hard_inquiries_90d: int | None = None
    credit_utilization_ratio: float | None = None
    age_oldest_trade_line_months: int | None = None
    local_unemployment_rate: float | None = None
    industry_growth_forecast: float | None = None
    loan_to_revenue_ratio: float | None = None


class AssessmentResult(BaseModel):
    assessment_id: UUID
    business_id: str
    rule_version: str
    scoring_policy_version: str | None = None
    status: AssessmentStatus
    scoring_status: ScoringStatus
    validation: ValidationResult
    risk_factors: list[RiskFactor] = Field(default_factory=list)
    dimension_results: list[DimensionResult] = Field(default_factory=list)
    overall_score: float | None = None
    risk_band: str | None = None
    recommendation: str | None = None
    recommendation_reasons: list[str] = Field(default_factory=list)
    evaluated_at: datetime
