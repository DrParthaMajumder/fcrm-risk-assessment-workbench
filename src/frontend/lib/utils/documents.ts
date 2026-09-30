import type {
  Application,
  DocAggregateStatus,
  DocCell,
  DocumentField,
  DocumentVerification,
  Documents,
} from "@/lib/api/types";
import { DOCUMENT_FIELDS } from "@/lib/api/types";

export function getDocAggregateStatus(
  documents: Documents,
  documentVerification: DocumentVerification,
): DocAggregateStatus {
  const values = DOCUMENT_FIELDS.map((field) => documents[field]);

  if (
    values.some((value) => value === "Forged") ||
    documentVerification === "Forged_Documents"
  ) {
    return "forged";
  }

  if (
    values.some((value) => value === "Missing") ||
    documentVerification === "Missing_Critical_Docs"
  ) {
    return "missing";
  }

  return "clear";
}

export function hasDocumentIssue(application: Application): boolean {
  const status = getDocAggregateStatus(
    application.documents,
    application.documentVerification,
  );
  return status !== "clear";
}

export function formatDocumentLabel(field: DocumentField): string {
  return field.replaceAll("_", " ");
}

export function docCellTone(value: DocCell): "green" | "yellow" | "red" | "neutral" {
  switch (value) {
    case "Verified":
      return "green";
    case "Missing":
      return "yellow";
    case "Forged":
      return "red";
    default:
      return "neutral";
  }
}
