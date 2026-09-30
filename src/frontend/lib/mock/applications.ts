import type {
  Application,
  Assessment,
  AuditEvent,
  DecisionChoice,
  Metrics,
  PaginatedApplications,
  PolicyCitation,
} from "@/lib/api/types";
import type { ApplicationListParams } from "@/lib/api/types";

const mockAssessments = new Map<string, Assessment>();
const mockAuditEvents = new Map<string, AuditEvent[]>();
const mockChatHistory = new Map<string, { role: "user" | "assistant"; content: string }[]>();

function seedAudit(application: Application): AuditEvent[] {
  return [
    {
      id: `${application.businessId}-seed`,
      at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      type: "case_opened",
      summary: `Case opened for ${application.businessName}.`,
    },
  ];
}

const baseApplications: Application[] = [
  {
    businessId: "SME-10000",
    businessName: "Cruz Inc",
    ownerName: "Jacob Williamson",
    usState: "Kentucky",
    industry: "Logistics",
    marketCondition: "Stable",
    loanPurpose: "Equipment Purchase",
    yearsInBusiness: 8,
    ownerOwnershipPercent: 59,
    annualRevenue: 8644502,
    monthlyRevenue: 720375.17,
    ownerMonthlyIncome: 95127.5,
    ebitda: 781648.01,
    operatingProfit: 615613.14,
    netProfitMargin: 0.05,
    operatingCashFlow: 497442.88,
    ownerCreditScore: 627,
    previousDefaults: 1,
    debtToEquityRatio: 3.41,
    currentRatio: 1.16,
    loanAmountRequested: 520208,
    lastLoanAmount: 0,
    documentVerification: "Verified",
    loanStatus: "Defer",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Verified",
      SBA_Forms: "Verified",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 1.0,
    nsfLast6Months: 0,
    averageDailyBalance: 128346.97,
    revenueVolatility: 0.143,
    customerConcentration: 0.85,
    onlineRating: 4.2,
    reviewVolume: 63,
    websiteActive: true,
    recentHardInquiries90d: 1,
    creditUtilizationRatio: 0.13,
    ageOldestTradeLineMonths: 23,
    localUnemploymentRate: 6.1,
    industryGrowthForecast: 0.026,
    aiStatus: "ready",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10001",
    businessName: "Campbell Ltd",
    ownerName: "Melinda Jimenez",
    usState: "Arkansas",
    industry: "Healthcare",
    marketCondition: "Stable",
    loanPurpose: "Working Capital",
    yearsInBusiness: 3,
    ownerOwnershipPercent: 72,
    annualRevenue: 3982240,
    monthlyRevenue: 331853.33,
    ownerMonthlyIncome: 43822.14,
    ebitda: -56136.79,
    operatingProfit: -51275.88,
    netProfitMargin: -0.009,
    operatingCashFlow: -52444.24,
    ownerCreditScore: 539,
    previousDefaults: 1,
    debtToEquityRatio: 5.49,
    currentRatio: 0.78,
    loanAmountRequested: 421668,
    lastLoanAmount: 51648,
    documentVerification: "Verified",
    loanStatus: "Reject",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Not_Required",
      SBA_Forms: "Verified",
      Collateral_Proof: "Verified",
    },
    completenessScore: 1.0,
    nsfLast6Months: 2,
    averageDailyBalance: 113729.17,
    revenueVolatility: 0.222,
    customerConcentration: 0.25,
    onlineRating: 1.2,
    reviewVolume: 38,
    websiteActive: true,
    recentHardInquiries90d: 1,
    creditUtilizationRatio: 0.18,
    ageOldestTradeLineMonths: 205,
    localUnemploymentRate: 8.3,
    industryGrowthForecast: 0.021,
    aiStatus: "ready",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10003",
    businessName: "Miller, Rice and Oneill",
    ownerName: "Renee Barber",
    usState: "Mississippi",
    industry: "Manufacturing",
    marketCondition: "Stable",
    loanPurpose: "Equipment Purchase",
    yearsInBusiness: 10,
    ownerOwnershipPercent: 83,
    annualRevenue: 4539692,
    monthlyRevenue: 378307.67,
    ownerMonthlyIncome: 49956.56,
    ebitda: 471576.52,
    operatingProfit: 425266.34,
    netProfitMargin: 0.066,
    operatingCashFlow: 347664.78,
    ownerCreditScore: 680,
    previousDefaults: 1,
    debtToEquityRatio: 3.4,
    currentRatio: 1.37,
    loanAmountRequested: 1343558,
    lastLoanAmount: 388914,
    documentVerification: "Verified",
    loanStatus: "Defer",
    documents: {
      EIN_Letter: "Missing",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Missing",
      Business_Plan: "Not_Required",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 0.85,
    nsfLast6Months: 0,
    averageDailyBalance: 86676.39,
    revenueVolatility: 0.244,
    customerConcentration: 0.88,
    onlineRating: 2.3,
    reviewVolume: 49,
    websiteActive: true,
    recentHardInquiries90d: 0,
    creditUtilizationRatio: 0.1,
    ageOldestTradeLineMonths: 271,
    localUnemploymentRate: 5.9,
    industryGrowthForecast: -0.04,
    aiStatus: "not_started",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10004",
    businessName: "Fleming, Carter and Lewis",
    ownerName: "Amy Duarte",
    usState: "Washington",
    industry: "Hospitality",
    marketCondition: "Stable",
    loanPurpose: "Debt Consolidation",
    yearsInBusiness: 8,
    ownerOwnershipPercent: 45,
    annualRevenue: 9330233,
    monthlyRevenue: 777519.42,
    ownerMonthlyIncome: 102673.56,
    ebitda: 2733213.66,
    operatingProfit: 2098610.5,
    netProfitMargin: 0.157,
    operatingCashFlow: 1951667.12,
    ownerCreditScore: 779,
    previousDefaults: 0,
    debtToEquityRatio: 0.56,
    currentRatio: 3.7,
    loanAmountRequested: 395795,
    lastLoanAmount: 212298,
    documentVerification: "Verified",
    loanStatus: "Approve",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Verified",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 1.0,
    nsfLast6Months: 0,
    averageDailyBalance: 21224.14,
    revenueVolatility: 0.389,
    customerConcentration: 0.5,
    onlineRating: 2.7,
    reviewVolume: 47,
    websiteActive: true,
    recentHardInquiries90d: 1,
    creditUtilizationRatio: 0.48,
    ageOldestTradeLineMonths: 40,
    localUnemploymentRate: 6.4,
    industryGrowthForecast: 0.115,
    aiStatus: "ready",
    reviewStatus: "approved",
  },
  {
    businessId: "SME-10007",
    businessName: "Smith-Bell",
    ownerName: "Kimberly Heath",
    usState: "Illinois",
    industry: "Construction",
    marketCondition: "Recession",
    loanPurpose: "Equipment Purchase",
    yearsInBusiness: 2,
    ownerOwnershipPercent: 80,
    annualRevenue: 187746,
    monthlyRevenue: 15645.5,
    ownerMonthlyIncome: 2066.03,
    ebitda: -18199.4,
    operatingProfit: -13985.02,
    netProfitMargin: -0.052,
    operatingCashFlow: -13952.2,
    ownerCreditScore: 573,
    previousDefaults: 4,
    debtToEquityRatio: 5.45,
    currentRatio: 0.59,
    loanAmountRequested: 1869512,
    lastLoanAmount: 205890,
    documentVerification: "Verified",
    loanStatus: "Reject",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Not_Required",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Verified",
    },
    completenessScore: 1.0,
    nsfLast6Months: 2,
    averageDailyBalance: 99157.62,
    revenueVolatility: 0.412,
    customerConcentration: 0.58,
    onlineRating: 1.4,
    reviewVolume: 46,
    websiteActive: true,
    recentHardInquiries90d: 0,
    creditUtilizationRatio: 0.38,
    ageOldestTradeLineMonths: 93,
    localUnemploymentRate: 3.2,
    industryGrowthForecast: 0.085,
    aiStatus: "ready",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10061",
    businessName: "Mercer Inc",
    ownerName: "Jeffrey Johnson",
    usState: "Indiana",
    industry: "Technology",
    marketCondition: "Recession",
    loanPurpose: "Payroll",
    yearsInBusiness: 9,
    ownerOwnershipPercent: 61,
    annualRevenue: 4150432,
    monthlyRevenue: 345869.33,
    ownerMonthlyIncome: 45672.99,
    ebitda: 699469.68,
    operatingProfit: 543796.3,
    netProfitMargin: 0.092,
    operatingCashFlow: 540201.77,
    ownerCreditScore: 809,
    previousDefaults: 0,
    debtToEquityRatio: 0.25,
    currentRatio: 2.19,
    loanAmountRequested: 198656,
    lastLoanAmount: 177614,
    documentVerification: "Verified",
    loanStatus: "Approve",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Forged",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Verified",
      SBA_Forms: "Verified",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 0.93,
    nsfLast6Months: 2,
    averageDailyBalance: 45833.8,
    revenueVolatility: 0.154,
    customerConcentration: 0.44,
    onlineRating: 3.6,
    reviewVolume: 49,
    websiteActive: true,
    recentHardInquiries90d: 0,
    creditUtilizationRatio: 0.8,
    ageOldestTradeLineMonths: 191,
    localUnemploymentRate: 4.7,
    industryGrowthForecast: 0.006,
    aiStatus: "running",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10069",
    businessName: "Banks-Hendricks",
    ownerName: "Hannah Jordan",
    usState: "Iowa",
    industry: "Technology",
    marketCondition: "Stable",
    loanPurpose: "Working Capital",
    yearsInBusiness: 8,
    ownerOwnershipPercent: 98,
    annualRevenue: 178272,
    monthlyRevenue: 14856.0,
    ownerMonthlyIncome: 1961.78,
    ebitda: -8026.05,
    operatingProfit: -7296.36,
    netProfitMargin: -0.029,
    operatingCashFlow: -7117.07,
    ownerCreditScore: 539,
    previousDefaults: 2,
    debtToEquityRatio: 4.03,
    currentRatio: 2.72,
    loanAmountRequested: 735803,
    lastLoanAmount: 11259,
    documentVerification: "Missing_Critical_Docs",
    loanStatus: "Reject",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Not_Required",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 1.0,
    nsfLast6Months: 2,
    averageDailyBalance: 104420.54,
    revenueVolatility: 0.035,
    customerConcentration: 0.71,
    onlineRating: 1.3,
    reviewVolume: 44,
    websiteActive: true,
    recentHardInquiries90d: 1,
    creditUtilizationRatio: 0.16,
    ageOldestTradeLineMonths: 237,
    localUnemploymentRate: 7.3,
    industryGrowthForecast: 0.044,
    aiStatus: "ready",
    reviewStatus: "pending",
  },
  {
    businessId: "SME-10154",
    businessName: "Turner-Mcdaniel",
    ownerName: "Robert Sanders",
    usState: "North Carolina",
    industry: "Hospitality",
    marketCondition: "Stable",
    loanPurpose: "Payroll",
    yearsInBusiness: 13,
    ownerOwnershipPercent: 33,
    annualRevenue: 668022,
    monthlyRevenue: 55668.5,
    ownerMonthlyIncome: 7351.18,
    ebitda: -48851.61,
    operatingProfit: -35049.51,
    netProfitMargin: -0.037,
    operatingCashFlow: -31561.69,
    ownerCreditScore: 641,
    previousDefaults: 0,
    debtToEquityRatio: 4.91,
    currentRatio: 2.08,
    loanAmountRequested: 1036293,
    lastLoanAmount: 0,
    documentVerification: "Forged_Documents",
    loanStatus: "Reject",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Missing",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Missing",
      Business_Plan: "Not_Required",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Verified",
    },
    completenessScore: 0.86,
    nsfLast6Months: 0,
    averageDailyBalance: 136942.63,
    revenueVolatility: 0.301,
    customerConcentration: 0.64,
    onlineRating: 3.9,
    reviewVolume: 58,
    websiteActive: true,
    recentHardInquiries90d: 2,
    creditUtilizationRatio: 0.96,
    ageOldestTradeLineMonths: 256,
    localUnemploymentRate: 7.2,
    industryGrowthForecast: -0.015,
    aiStatus: "ready",
    reviewStatus: "deferred",
  },
  {
    businessId: "SME-10020",
    businessName: "Harris Inc",
    ownerName: "Michelle Peterson MD",
    usState: "Missouri",
    industry: "Technology",
    marketCondition: "Stable",
    loanPurpose: "Equipment Purchase",
    yearsInBusiness: 13,
    ownerOwnershipPercent: 93,
    annualRevenue: 3236329,
    monthlyRevenue: 269694.08,
    ownerMonthlyIncome: 35613.84,
    ebitda: 187065.56,
    operatingProfit: 172940.82,
    netProfitMargin: 0.037,
    operatingCashFlow: 170701.65,
    ownerCreditScore: 642,
    previousDefaults: 0,
    debtToEquityRatio: 2.19,
    currentRatio: 1.25,
    loanAmountRequested: 1211877,
    lastLoanAmount: 0,
    documentVerification: "Verified",
    loanStatus: "Defer",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Missing",
      SBA_Forms: "Verified",
      Collateral_Proof: "Missing",
    },
    completenessScore: 0.88,
    nsfLast6Months: 1,
    averageDailyBalance: 41009.02,
    revenueVolatility: 0.032,
    customerConcentration: 0.59,
    onlineRating: 4.8,
    reviewVolume: 36,
    websiteActive: false,
    recentHardInquiries90d: 3,
    creditUtilizationRatio: 0.77,
    ageOldestTradeLineMonths: 109,
    localUnemploymentRate: 8.3,
    industryGrowthForecast: -0.043,
    aiStatus: "not_started",
    reviewStatus: "pending",
  },
];

for (const application of baseApplications) {
  mockAuditEvents.set(application.businessId, seedAudit(application));
}

function matchesStage(application: Application, stage: ApplicationListParams["stage"]): boolean {
  if (!stage || stage === "all") return true;
  if (stage === "awaiting_ai") {
    return (
      application.reviewStatus === "pending" &&
      (application.aiStatus === "not_started" || application.aiStatus === "running")
    );
  }
  if (stage === "pending_review") {
    return application.reviewStatus === "pending" && application.aiStatus === "ready";
  }
  return ["approved", "deferred", "rejected"].includes(application.reviewStatus);
}

function buildAssessment(application: Application): Assessment {
  const recommendation = application.loanStatus;
  const score =
    recommendation === "Approve" ? 78 : recommendation === "Defer" ? 54 : 31;

  return {
    recommendation,
    riskBand: recommendation === "Approve" ? "Moderate" : recommendation === "Defer" ? "Elevated" : "High",
    score,
    factors: [
      {
        name: "Owner credit score",
        detail: `${application.ownerCreditScore} with ${application.previousDefaults} prior default(s).`,
      },
      {
        name: "Document verification",
        detail: application.documentVerification.replaceAll("_", " "),
      },
      {
        name: "Revenue volatility",
        detail: `${(application.revenueVolatility * 100).toFixed(1)}% over the last 12 months.`,
      },
      {
        name: "Customer concentration",
        detail: `${(application.customerConcentration * 100).toFixed(0)}% of revenue from top customers.`,
      },
    ],
    citations: buildPolicyCitations(application.businessId),
  };
}

function buildPolicyCitations(businessId: string): PolicyCitation[] {
  return [
    {
      id: `${businessId}-reg-b`,
      documentName: "Regulation B — Equal Credit Opportunity",
      quotedSpan:
        "A creditor shall not discriminate against any applicant on a prohibited basis regarding any aspect of a credit transaction.",
      relevance: 0.91,
    },
    {
      id: `${businessId}-nist`,
      documentName: "NIST AI RMF — Govern",
      quotedSpan:
        "Human oversight and accountability mechanisms should be established for AI-assisted decisions.",
      relevance: 0.84,
    },
  ];
}

export function listMockApplications(
  params: ApplicationListParams = {},
): PaginatedApplications {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const search = params.search?.trim().toLowerCase() ?? "";

  let items = [...baseApplications];

  if (search) {
    items = items.filter(
      (application) =>
        application.businessId.toLowerCase().includes(search) ||
        application.businessName.toLowerCase().includes(search),
    );
  }

  if (params.reviewStatus && params.reviewStatus !== "all") {
    items = items.filter(
      (application) => application.reviewStatus === params.reviewStatus,
    );
  }

  if (params.docStatus && params.docStatus !== "all") {
    items = items.filter((application) => {
      const { getDocAggregateStatus } = require("@/lib/utils/documents");
      return (
        getDocAggregateStatus(
          application.documents,
          application.documentVerification,
        ) === params.docStatus
      );
    });
  }

  if (params.stage && params.stage !== "all") {
    items = items.filter((application) => matchesStage(application, params.stage));
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const pagedItems = items.slice(start, start + limit);

  return { items: pagedItems, page, limit, total };
}

export function getMockMetrics(): Metrics {
  const items = baseApplications;
  return {
    awaitingAi: items.filter((application) =>
      matchesStage(application, "awaiting_ai"),
    ).length,
    pendingReview: items.filter((application) =>
      matchesStage(application, "pending_review"),
    ).length,
    completed: items.filter((application) => matchesStage(application, "completed"))
      .length,
  };
}

export function getMockApplication(id: string): Application | undefined {
  return baseApplications.find((application) => application.businessId === id);
}

export function getMockAssessment(id: string): Assessment | undefined {
  if (mockAssessments.has(id)) {
    return mockAssessments.get(id);
  }

  const application = getMockApplication(id);
  if (!application || application.aiStatus !== "ready") {
    return undefined;
  }

  const assessment = buildAssessment(application);
  mockAssessments.set(id, assessment);
  return assessment;
}

export function runMockAssessment(id: string): Assessment | undefined {
  const application = getMockApplication(id);
  if (!application) return undefined;

  application.aiStatus = "ready";
  const assessment = buildAssessment(application);
  mockAssessments.set(id, assessment);

  const events = mockAuditEvents.get(id) ?? [];
  events.unshift({
    id: `${id}-run-${Date.now()}`,
    at: new Date().toISOString(),
    type: "assessment_run",
    summary: `AI recommendation: ${assessment.recommendation} (score ${assessment.score}).`,
  });
  mockAuditEvents.set(id, events);

  return assessment;
}

export function submitMockDecision(
  id: string,
  choice: DecisionChoice,
  justification: string,
): Application | undefined {
  const application = getMockApplication(id);
  if (!application) return undefined;

  application.reviewStatus =
    choice === "Approve"
      ? "approved"
      : choice === "Defer"
        ? "deferred"
        : "rejected";

  const events = mockAuditEvents.get(id) ?? [];
  events.unshift({
    id: `${id}-decision-${Date.now()}`,
    at: new Date().toISOString(),
    type: "human_decision",
    summary: `Underwriter selected ${choice}. ${justification}`,
  });
  mockAuditEvents.set(id, events);

  return application;
}

export function getMockAuditEvents(id: string): AuditEvent[] {
  return mockAuditEvents.get(id) ?? [];
}

export function askMockQuestion(id: string, message: string) {
  const application = getMockApplication(id);
  if (!application) return undefined;

  const assessment = getMockAssessment(id);
  const citations = buildPolicyCitations(id);
  const history = mockChatHistory.get(id) ?? [];

  history.push({ role: "user", content: message });
  const reply = assessment
    ? `The AI recommendation for ${application.businessName} is ${assessment.recommendation} because credit score (${application.ownerCreditScore}), document status (${application.documentVerification.replaceAll("_", " ")}), and revenue volatility (${(application.revenueVolatility * 100).toFixed(1)}%) drive the current risk band.`
    : `Run an AI assessment first to ground a recommendation for ${application.businessName}.`;

  history.push({ role: "assistant", content: reply });
  mockChatHistory.set(id, history);

  const events = mockAuditEvents.get(id) ?? [];
  events.unshift({
    id: `${id}-ask-${Date.now()}`,
    at: new Date().toISOString(),
    type: "chat_question",
    summary: message,
  });
  mockAuditEvents.set(id, events);

  return { reply, citations };
}

export function createMockApplication(payload: {
  businessName: string;
  industry: string;
  loanAmountRequested: number;
  loanPurpose: string;
}): Application {
  const nextId = `SME-${10000 + baseApplications.length}`;
  const application: Application = {
    businessId: nextId,
    businessName: payload.businessName,
    ownerName: "Pending Owner",
    usState: "New York",
    industry: payload.industry,
    marketCondition: "Stable",
    loanPurpose: payload.loanPurpose,
    yearsInBusiness: 3,
    ownerOwnershipPercent: 100,
    annualRevenue: payload.loanAmountRequested * 2,
    monthlyRevenue: (payload.loanAmountRequested * 2) / 12,
    ownerMonthlyIncome: 12000,
    ebitda: payload.loanAmountRequested * 0.1,
    operatingProfit: payload.loanAmountRequested * 0.08,
    netProfitMargin: 0.05,
    operatingCashFlow: payload.loanAmountRequested * 0.07,
    ownerCreditScore: 680,
    previousDefaults: 0,
    debtToEquityRatio: 1.2,
    currentRatio: 1.5,
    loanAmountRequested: payload.loanAmountRequested,
    lastLoanAmount: 0,
    documentVerification: "Verified",
    loanStatus: "Defer",
    documents: {
      EIN_Letter: "Verified",
      Formation_Articles: "Verified",
      Governance_Bylaws: "Verified",
      Business_License: "Verified",
      Commercial_Lease: "Verified",
      Tax_Returns_2Yrs: "Verified",
      Bank_Statements_6Mo: "Verified",
      PnL_YTD: "Verified",
      Balance_Sheet: "Verified",
      Debt_Schedule: "Verified",
      Owner_Gov_ID: "Verified",
      Personal_Financial_Statement: "Verified",
      Credit_Report_Auth: "Verified",
      Business_Plan: "Missing",
      SBA_Forms: "Not_Required",
      Collateral_Proof: "Not_Required",
    },
    completenessScore: 0.9,
    nsfLast6Months: 0,
    averageDailyBalance: 50000,
    revenueVolatility: 0.12,
    customerConcentration: 0.4,
    onlineRating: 4.0,
    reviewVolume: 20,
    websiteActive: true,
    recentHardInquiries90d: 0,
    creditUtilizationRatio: 0.2,
    ageOldestTradeLineMonths: 48,
    localUnemploymentRate: 5.0,
    industryGrowthForecast: 0.02,
    aiStatus: "not_started",
    reviewStatus: "pending",
  };

  baseApplications.unshift(application);
  mockAuditEvents.set(application.businessId, seedAudit(application));
  return application;
}
