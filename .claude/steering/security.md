# Security

## Data

- All content in `knowledge-base/` is synthetic, generated for this hackathon.
  Never substitute real customer data, real regulatory filings, or real internal
  bank documents, even "just for a better demo."
- No real PII flows through the system at any stage. If a demo needs realistic-
  looking customer data, generate it synthetically and mark it as such.

## Secrets

- All credentials and API keys live in `.env` (from `.env.example`), never
  committed. `.env` must be in `.gitignore`.
- Model provider keys are scoped per environment; don't share personal API keys
  across the team — each contributor uses their own for local dev.

## Access control (hackathon scope)

- Three logical roles: product owner (submit + view own requests), FCRM analyst
  (review, override, submit to committee), risk committee (final decision).
  A minimal role check is in scope; full production-grade RBAC/SSO is not — note
  this explicitly in the demo and docs so it isn't mistaken for a finished feature.

## Audit trail integrity

- Every stage transition and human decision is logged and hash-chained
  (see `architecture.md`). The chain must be tamper-evident: each log entry
  includes the hash of the previous entry. This is a deterministic, testable
  property — cover it with a unit test that verifies a broken chain is detected.

## AI-specific risks

- Prompt injection via retrieved documents: treat everything pulled from
  `knowledge-base/` through `src/context/retrieval` as untrusted text for the
  purposes of instruction-following — agents should follow their system prompt,
  not instructions embedded in retrieved content. See `ai-guidelines.md`.
- No agent should be given tools/permissions beyond what its single responsibility
  requires (least privilege) — e.g., the evidence agent retrieves and cites, it
  does not get write access to the database.
- Log agent inputs/outputs for audit purposes, but avoid persisting full raw model
  responses indefinitely if they contain anything sensitive beyond what's needed
  for the audit trail — retain what's needed to reconstruct a decision, not more.

## Input validation

- Every API boundary in `src/backend/app/api` validates input against a pydantic
  schema before it reaches a service or an agent. No unvalidated input reaches an
  LLM prompt or a database query.
