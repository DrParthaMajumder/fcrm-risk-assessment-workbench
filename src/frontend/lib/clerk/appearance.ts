import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#1d4ed8",
    colorText: "#0f172a",
    colorBackground: "#ffffff",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-lg border border-slate-200",
    headerTitle: "text-slate-900",
    headerSubtitle: "text-slate-600",
  },
};
