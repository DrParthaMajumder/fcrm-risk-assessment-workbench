from typing import Any

from app.risk_engine.models import RiskApplicationFeatures

# PascalCase DB column → snake_case feature field. Loan_Status intentionally excluded.
_FIELD_MAP: dict[str, str] = {
    "Business_ID": "business_id",
    "Business_Name": "business_name",
    "Owner_Name": "owner_name",
    "US_State": "us_state",
    "Industry": "industry",
    "Market_Condition": "market_condition",
    "Loan_Purpose": "loan_purpose",
    "Years_in_Business": "years_in_business",
    "Owner_Ownership_Percent": "owner_ownership_percent",
    "Annual_Revenue": "annual_revenue",
    "Monthly_Revenue": "monthly_revenue",
    "Owner_Monthly_Income": "owner_monthly_income",
    "EBITDA": "ebitda",
    "Operating_Profit": "operating_profit",
    "Net_Profit_Margin": "net_profit_margin",
    "Operating_Cash_Flow": "operating_cash_flow",
    "Owner_Credit_Score": "owner_credit_score",
    "Previous_Defaults": "previous_defaults",
    "Debt_to_Equity_Ratio": "debt_to_equity_ratio",
    "Current_Ratio": "current_ratio",
    "Loan_Amount_Requested": "loan_amount_requested",
    "Last_Loan_Amount": "last_loan_amount",
    "Document_Verification": "document_verification",
    "EIN_Letter": "ein_letter",
    "Formation_Articles": "formation_articles",
    "Governance_Bylaws": "governance_bylaws",
    "Business_License": "business_license",
    "Commercial_Lease": "commercial_lease",
    "Tax_Returns_2Yrs": "tax_returns_2yrs",
    "Bank_Statements_6Mo": "bank_statements_6mo",
    "PnL_YTD": "pnl_ytd",
    "Balance_Sheet": "balance_sheet",
    "Debt_Schedule": "debt_schedule",
    "Owner_Gov_ID": "owner_gov_id",
    "Personal_Financial_Statement": "personal_financial_statement",
    "Credit_Report_Auth": "credit_report_auth",
    "Business_Plan": "business_plan",
    "SBA_Forms": "sba_forms",
    "Collateral_Proof": "collateral_proof",
    "Completeness_Score": "completeness_score",
    "NSF_Last_6_Months": "nsf_last_6_months",
    "Average_Daily_Balance": "average_daily_balance",
    "Revenue_Volatility": "revenue_volatility",
    "Customer_Concentration": "customer_concentration",
    "Online_Rating": "online_rating",
    "Review_Volume": "review_volume",
    "Website_Active": "website_active",
    "Recent_Hard_Inquiries_90D": "recent_hard_inquiries_90d",
    "Credit_Utilization_Ratio": "credit_utilization_ratio",
    "Age_Oldest_Trade_Line_Months": "age_oldest_trade_line_months",
    "Local_Unemployment_Rate": "local_unemployment_rate",
    "Industry_Growth_Forecast": "industry_growth_forecast",
}


def extract_features(raw: dict[str, Any]) -> dict[str, Any]:
    """Map a Supabase application row to snake_case feature dict (excludes Loan_Status)."""
    features: dict[str, Any] = {}
    for db_col, feature_key in _FIELD_MAP.items():
        if db_col in raw:
            features[feature_key] = raw[db_col]
    return features


def _compute_loan_to_revenue_ratio(features: dict[str, Any]) -> float | None:
    loan = features.get("loan_amount_requested")
    revenue = features.get("annual_revenue")
    if loan is None or revenue is None:
        return None
    if revenue <= 0:
        return None
    return round(float(loan) / float(revenue), 4)


def build_feature_model(features: dict[str, Any]) -> RiskApplicationFeatures:
    enriched = dict(features)
    enriched["loan_to_revenue_ratio"] = _compute_loan_to_revenue_ratio(enriched)
    return RiskApplicationFeatures.model_validate(enriched)
