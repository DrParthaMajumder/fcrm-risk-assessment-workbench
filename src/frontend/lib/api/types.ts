export type AiStatus = "not_started" | "running" | "ready";
export type ReviewStatus = "pending" | "approved" | "deferred" | "rejected";
export type DecisionChoice = "Approve" | "Defer" | "Reject";
export type DocCell = "Verified" | "Missing" | "Forged" | "Not_Required";
export type DocumentVerification =
  | "Verified"
  | "Forged_Documents"
  | "Missing_Critical_Docs";
export type LoanStatus = "Approve" | "Defer" | "Reject";
export type DocAggregateStatus = "clear" | "missing" | "forged";
export type StageFilter = "all" | "awaiting_ai" | "pending_review" | "completed";

export const DOCUMENT_FIELDS = [
  "EIN_Letter",
  "Formation_Articles",
  "Governance_Bylaws",
  "Business_License",
  "Commercial_Lease",
  "Tax_Returns_2Yrs",
  "Bank_Statements_6Mo",
  "PnL_YTD",
  "Balance_Sheet",
  "Debt_Schedule",
  "Owner_Gov_ID",
  "Personal_Financial_Statement",
  "Credit_Report_Auth",
  "Business_Plan",
  "SBA_Forms",
  "Collateral_Proof",
] as const;

export type DocumentField = (typeof DOCUMENT_FIELDS)[number];

export type Documents = Record<DocumentField, DocCell>;

export interface Application {
  businessId: string;
  businessName: string;
  ownerName: string;
  usState: string;
  industry: string;
  marketCondition: string;
  loanPurpose: string;
  yearsInBusiness: number;
  ownerOwnershipPercent: number;
  annualRevenue: number;
  monthlyRevenue: number;
  ownerMonthlyIncome: number;
  ebitda: number;
  operatingProfit: number;
  netProfitMargin: number;
  operatingCashFlow: number;
  ownerCreditScore: number;
  previousDefaults: number;
  debtToEquityRatio: number;
  currentRatio: number;
  loanAmountRequested: number;
  lastLoanAmount: number;
  documentVerification: DocumentVerification;
  loanStatus: LoanStatus;
  documents: Documents;
  completenessScore: number;
  nsfLast6Months: number;
  averageDailyBalance: number;
  revenueVolatility: number;
  customerConcentration: number;
  onlineRating: number;
  reviewVolume: number;
  websiteActive: boolean;
  recentHardInquiries90d: number;
  creditUtilizationRatio: number;
  ageOldestTradeLineMonths: number;
  localUnemploymentRate: number;
  industryGrowthForecast: number;
  aiStatus: AiStatus;
  reviewStatus: ReviewStatus;
}

export interface PolicyCitation {
  id: string;
  documentName: string;
  quotedSpan: string;
  relevance: number;
}

export interface Assessment {
  recommendation: DecisionChoice;
  riskBand: string;
  score: number;
  factors: { name: string; detail: string }[];
  citations: PolicyCitation[];
}

export interface Decision {
  choice: DecisionChoice;
  justification: string;
  overridesAi: boolean;
}

export interface AuditEvent {
  id: string;
  at: string;
  type: string;
  summary: string;
}

export interface Metrics {
  pendingReview: number;
  awaitingAi: number;
  completed: number;
}

export interface PaginatedApplications {
  items: Application[];
  page: number;
  limit: number;
  total: number;
}

export interface ApplicationListParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: StageFilter;
  docStatus?: DocAggregateStatus | "all";
  reviewStatus?: ReviewStatus | "all";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: PolicyCitation[];
}

export interface AskResponse {
  reply: string;
  citations: PolicyCitation[];
}
