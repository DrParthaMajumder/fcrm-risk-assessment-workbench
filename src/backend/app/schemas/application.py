from pydantic import BaseModel, ConfigDict


class SmeApplicationResponse(BaseModel):
    """Mirrors public.sme_applications columns (PascalCase, stored as text in Supabase)."""

    model_config = ConfigDict(extra="forbid")

    Business_ID: str
    Business_Name: str
    Owner_Name: str
    US_State: str
    Industry: str
    Market_Condition: str
    Loan_Purpose: str
    Years_in_Business: str
    Owner_Ownership_Percent: str
    Annual_Revenue: str
    Monthly_Revenue: str
    Owner_Monthly_Income: str
    EBITDA: str
    Operating_Profit: str
    Net_Profit_Margin: str
    Operating_Cash_Flow: str
    Owner_Credit_Score: str
    Previous_Defaults: str
    Debt_to_Equity_Ratio: str
    Current_Ratio: str
    Loan_Amount_Requested: str
    Last_Loan_Amount: str
    Document_Verification: str
    Loan_Status: str
    EIN_Letter: str
    Formation_Articles: str
    Governance_Bylaws: str
    Business_License: str
    Commercial_Lease: str
    Tax_Returns_2Yrs: str
    Bank_Statements_6Mo: str
    PnL_YTD: str
    Balance_Sheet: str
    Debt_Schedule: str
    Owner_Gov_ID: str
    Personal_Financial_Statement: str
    Credit_Report_Auth: str
    Business_Plan: str
    SBA_Forms: str
    Collateral_Proof: str
    Completeness_Score: str
    NSF_Last_6_Months: str
    Average_Daily_Balance: str
    Revenue_Volatility: str
    Customer_Concentration: str
    Online_Rating: str
    Review_Volume: str
    Website_Active: str
    Recent_Hard_Inquiries_90D: str
    Credit_Utilization_Ratio: str
    Age_Oldest_Trade_Line_Months: str
    Local_Unemployment_Rate: str
    Industry_Growth_Forecast: str
