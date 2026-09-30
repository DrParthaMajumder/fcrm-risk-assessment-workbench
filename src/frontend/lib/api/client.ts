import {
  askMockQuestion,
  createMockApplication,
  getMockApplication,
  getMockAssessment,
  getMockAuditEvents,
  getMockMetrics,
  listMockApplications,
  runMockAssessment,
  submitMockDecision,
} from "@/lib/mock/applications";
import type {
  Application,
  ApplicationListParams,
  AskResponse,
  Assessment,
  AuditEvent,
  Decision,
  DecisionChoice,
  Metrics,
  PaginatedApplications,
} from "@/lib/api/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== "all") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 503) {
    throw new ApiError("Service unavailable", 503);
  }

  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function getApplications(
  params: ApplicationListParams = {},
): Promise<PaginatedApplications> {
  try {
    return await request<PaginatedApplications>(
      `/api/v1/applications${buildQuery({
        page: params.page,
        limit: params.limit,
        search: params.search,
        stage: params.stage,
        docStatus: params.docStatus,
        reviewStatus: params.reviewStatus,
      })}`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) {
      return listMockApplications(params);
    }
    return listMockApplications(params);
  }
}

export async function getMetrics(): Promise<Metrics> {
  try {
    return await request<Metrics>("/api/v1/metrics");
  } catch {
    return getMockMetrics();
  }
}

export async function getApplication(id: string): Promise<Application | null> {
  try {
    return await request<Application>(`/api/v1/applications/${id}`);
  } catch {
    return getMockApplication(id) ?? null;
  }
}

export async function createApplication(payload: {
  businessName: string;
  industry: string;
  loanAmountRequested: number;
  loanPurpose: string;
}): Promise<Application> {
  try {
    return await request<Application>("/api/v1/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return createMockApplication(payload);
  }
}

export async function runAssessment(id: string): Promise<Assessment> {
  try {
    return await request<Assessment>(`/api/v1/applications/${id}/run`, {
      method: "POST",
    });
  } catch {
    const assessment = runMockAssessment(id);
    if (!assessment) {
      throw new Error("Application not found");
    }
    return assessment;
  }
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  try {
    return await request<Assessment>(`/api/v1/applications/${id}/assessment`);
  } catch {
    return getMockAssessment(id) ?? null;
  }
}

export async function submitDecision(
  id: string,
  decision: Decision,
): Promise<Application> {
  try {
    return await request<Application>(`/api/v1/applications/${id}/decisions`, {
      method: "POST",
      body: JSON.stringify(decision),
    });
  } catch {
    const application = submitMockDecision(
      id,
      decision.choice,
      decision.justification,
    );
    if (!application) {
      throw new Error("Application not found");
    }
    return application;
  }
}

export async function askQuestion(
  id: string,
  message: string,
): Promise<AskResponse> {
  try {
    return await request<AskResponse>(`/api/v1/applications/${id}/ask`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  } catch {
    const response = askMockQuestion(id, message);
    if (!response) {
      throw new Error("Application not found");
    }
    return response;
  }
}

export async function getAuditEvents(id: string): Promise<AuditEvent[]> {
  try {
    return await request<AuditEvent[]>(`/api/v1/applications/${id}/audit`);
  } catch {
    return getMockAuditEvents(id);
  }
}

export async function exportPackage(id: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/applications/${id}/package`);
    if (!response.ok) {
      throw new ApiError("Export failed", response.status);
    }
    return response.blob();
  } catch {
    const application = getMockApplication(id);
    const assessment = getMockAssessment(id);
    const payload = JSON.stringify({ application, assessment }, null, 2);
    return new Blob([payload], { type: "application/json" });
  }
}

export function reviewChoiceFromStatus(
  status: Application["reviewStatus"],
): DecisionChoice | null {
  switch (status) {
    case "approved":
      return "Approve";
    case "deferred":
      return "Defer";
    case "rejected":
      return "Reject";
    default:
      return null;
  }
}
