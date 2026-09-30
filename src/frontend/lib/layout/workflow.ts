import type { Application } from "@/lib/api/types";

export const workflowSteps = [
  "Queue intake",
  "Document review",
  "AI assessment",
  "Policy check",
  "Human decision",
] as const;

export function workflowStepIndex(application: Application | null): number {
  if (!application) return 0;

  if (application.reviewStatus !== "pending") {
    return 4;
  }

  if (application.aiStatus === "ready") {
    return 3;
  }

  if (application.aiStatus === "running") {
    return 2;
  }

  if (application.completenessScore >= 80) {
    return 1;
  }

  return 0;
}
