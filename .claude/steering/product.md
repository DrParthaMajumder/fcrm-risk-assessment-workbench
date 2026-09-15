# Product — FCRM Risk Assessment Workbench

## One-line pitch

AI-powered, governed, evidence-driven, human-centric risk assessment for financial-crime
risk on banking product/process changes.

## Demo scenario

Instant digital issuance of credit cards for newly onboarded customers — moving from
"physical card later" to "instant digital card now." The workbench assesses the
financial-crime risk of *making that change*, not the risk of an individual customer.

Outcome framing for the demo: **safer, faster, smarter, more compliant** than the
manual process it replaces.

## Problem

Financial-crime risk assessment for banking changes today is manual, slow, and
inconsistent: a product owner writes a vague change brief, an FCRM analyst has to
chase down applicable policies, reconstruct risk factors from memory or precedent,
and manually map controls — with no consistent audit trail. Reviews take days, and
quality varies by who does them.

## Users

- **Product owner** — submits the change request, provides context and documents at
  the intake gate.
- **FCRM analyst** — reviews AI-drafted risk factors, evidence, and control mappings;
  can override anything before it reaches committee.
- **Risk committee** — makes the final call (approve / approve with conditions /
  defer / reject) using the generated report and audit trail.
- **Examiner/regulator** (downstream) — consumes the final audit-ready report as
  evidence of a defensible, repeatable process.

## Success metrics (for this project, not the bank)

- Every AI-proposed risk factor and control mapping is traceable to a cited source
  document (policy, regulation, or historical assessment) — no un-sourced claims.
- No risk score is ever assigned by an LLM — only by the deterministic risk engine.
- Every assessment produces a complete, hash-chained audit trail from intake to
  decision.
- Time from change request submission to a committee-ready report is materially
  shorter than a manual process, without removing the human decision points.

## Explicit non-goals (hackathon scope)

- Not integrated with a real core banking system or real customer data — the
  knowledge base is synthetic (see `knowledge-base/`).
- Not a replacement for the risk committee's judgment — it is a decision-support
  tool with mandatory human gates (see `architecture.md`, `ai-guidelines.md`).
- Not attempting full production auth/RBAC hardening — see `security.md` for what
  is and isn't in scope for the hackathon build.
