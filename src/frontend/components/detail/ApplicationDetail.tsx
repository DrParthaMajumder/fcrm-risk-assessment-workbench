"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  exportPackage,
  getApplication,
  getAssessment,
  getAuditEvents,
  runAssessment,
} from "@/lib/api/client";
import type { Application, Assessment, AuditEvent } from "@/lib/api/types";
import { AiChatBar } from "@/components/detail/AiChatBar";
import { AssessmentTab } from "@/components/detail/AssessmentTab";
import { AuditTab } from "@/components/detail/AuditTab";
import { DecisionTab } from "@/components/detail/DecisionTab";
import { DocumentsTab } from "@/components/detail/DocumentsTab";
import { PolicyTab } from "@/components/detail/PolicyTab";
import { SummaryTab } from "@/components/detail/SummaryTab";
import {
  formatReviewStatus,
  reviewStatusTone,
  StatusBadge,
} from "@/components/ui/StatusBadge";

const tabs = [
  "Summary",
  "Documents",
  "Assessment",
  "Policy",
  "Decision",
  "Audit",
] as const;

type TabName = (typeof tabs)[number];

export function ApplicationDetail({ id }: { id: string }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<TabName>("Summary");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadCase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [applicationResult, assessmentResult, auditResult] = await Promise.all([
        getApplication(id),
        getAssessment(id),
        getAuditEvents(id),
      ]);

      if (!applicationResult) {
        setError("Application not found.");
        setApplication(null);
        return;
      }

      setApplication(applicationResult);
      setAssessment(assessmentResult);
      setAuditEvents(auditResult);
    } catch {
      setError("Could not load this application.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCase();
  }, [loadCase]);

  const citations = useMemo(
    () => assessment?.citations ?? [],
    [assessment],
  );

  async function handleRunAssessment() {
    if (!application) return;
    setRunning(true);
    setError(null);

    try {
      const result = await runAssessment(application.businessId);
      setAssessment(result);
      setApplication({ ...application, aiStatus: "ready" });
      setActiveTab("Assessment");
      const auditResult = await getAuditEvents(application.businessId);
      setAuditEvents(auditResult);
    } catch {
      setError("Assessment failed. Try again.");
    } finally {
      setRunning(false);
    }
  }

  async function handleFindPolicy() {
    setPolicyLoading(true);
    try {
      await handleRunAssessment();
      setActiveTab("Policy");
    } finally {
      setPolicyLoading(false);
    }
  }

  async function handleExport() {
    if (!application) return;
    setExporting(true);
    try {
      const blob = await exportPackage(application.businessId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${application.businessId}-package.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed.");
    } finally {
      setExporting(false);
    }
  }

  function handleCitationClick(citationId: string) {
    setActiveTab("Policy");
    requestAnimationFrame(() => {
      document.getElementById(citationId)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading application...</div>
    );
  }

  if (error && !application) {
    return (
      <div className="space-y-4 p-6">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          ← Back to Home
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col">
      <div className="flex-1 space-y-4 p-4 pb-28 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
              ← Back to Home
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                {application.businessId} · {application.businessName}
              </h2>
              <StatusBadge
                label={formatReviewStatus(application.reviewStatus)}
                tone={reviewStatusTone(application.reviewStatus)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleRunAssessment()}
              disabled={running}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {running ? "Running..." : "Run AI Assessment"}
            </button>
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exporting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              {exporting ? "Exporting..." : "Export package"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          AI recommendation is not final. Underwriter must confirm the decision.
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex min-w-max border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Summary" ? <SummaryTab application={application} /> : null}
        {activeTab === "Documents" ? <DocumentsTab application={application} /> : null}
        {activeTab === "Assessment" ? (
          <AssessmentTab
            application={application}
            assessment={assessment}
            loading={running}
            onRun={() => void handleRunAssessment()}
          />
        ) : null}
        {activeTab === "Policy" ? (
          <PolicyTab
            citations={citations}
            loading={policyLoading || running}
            onFindPolicy={() => void handleFindPolicy()}
          />
        ) : null}
        {activeTab === "Decision" ? (
          <DecisionTab
            application={application}
            assessment={assessment}
            onSubmitted={(updated) => {
              setApplication(updated);
              void getAuditEvents(updated.businessId).then(setAuditEvents);
            }}
          />
        ) : null}
        {activeTab === "Audit" ? (
          <AuditTab events={auditEvents} loading={loading} />
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 md:left-56">
        <AiChatBar
          applicationId={application.businessId}
          onCitationClick={handleCitationClick}
        />
      </div>
    </div>
  );
}
