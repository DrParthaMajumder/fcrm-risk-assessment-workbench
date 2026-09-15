# Requirements — Risk Assessment Workbench

Status: draft v0.1 — update as scope firms up. Every checked box needs a
corresponding entry in `design.md` and `tasks.md`.

## Stage 1 — Product Design & Intake

- [ ] Product owner can submit a free-text change request through the frontend.
- [ ] Change Understanding Agent converts it into a structured spec (scope,
      affected systems, customer impact, assumptions, missing info flagged).
- [ ] Analyst can edit/confirm the structured spec before it proceeds.
- Acceptance: a vague brief ("let customers get a digital card instantly") produces
  a structured spec with explicit assumptions and a list of missing info, and
  nothing proceeds until an analyst confirms it.

## Stage 2 — Agent Control Panel

- [ ] Orchestrator (LangGraph) manages the full pipeline as a stateful graph.
- [ ] Checkpointing: a failed run can resume from the last completed stage, not
      from scratch.
- [ ] Human approval gates are enforced at the graph level, not just the UI level
      (i.e., the backend refuses to advance past a gate without a recorded approval).

## Stage 3 — FCRM Knowledge Layer

- [ ] Ingest pipeline: PDF/Excel/DOCX → parse → chunk → embed → store in pgvector.
- [ ] Knowledge base covers: KYC/CDD, Sanctions/PEP, AML/transaction monitoring,
      fraud/digital onboarding, credit card issuance, financial crime control
      inventory, risk scoring methodology, historical assessments (all synthetic).
- Acceptance: a document dropped into `knowledge-base/` is searchable via the
  retrieval layer within one ingestion run, with correct source metadata.

## Stage 4 — Policy & Evidence Retrieval

- [ ] Given a change spec, retrieve relevant policy/regulatory passages with
      citations (section, page, source).
- [ ] Returns "no relevant evidence found" rather than fabricating a citation when
      retrieval comes up empty.

## Stage 5 — Assessment Agents (Hypothesis)

- [ ] Change Impact Agent drafts an impact assessment from the confirmed spec.
- [ ] Risk Agent proposes risk factors, each with a citation.
- [ ] Control Agent maps proposed risk factors to existing controls (from
      `knowledge-base/controls`).
- [ ] Evidence Agent supplies/validates citations used by the other agents.
- [ ] All four output structured JSON, no free-text-only responses.
- Acceptance: every risk factor and control mapping presented to a human has at
  least one citation; none are treated as final — they're inputs to stage 6/7.

## Stage 6 — Deterministic Risk Engine

- [ ] Applies the bank's approved methodology (plain Python, versioned, testable).
- [ ] Calculates inherent risk from risk factors (likelihood × impact).
- [ ] Applies control mitigation, capped appropriately.
- [ ] Enforces a residual-risk floor (residual risk is never zero).
- [ ] Assigns a risk band from the resulting score.
- Acceptance: given fixed inputs, the engine always returns the same output — no
  LLM call anywhere in this stage, verified by a unit test with mocked/absent
  model clients.

## Stage 7 — Human Review & Decision

- [ ] Analyst can review AI proposals, evidence, and the deterministic score
      breakdown, and override any of it.
- [ ] Risk committee records one of: approve, approve with conditions, defer,
      reject.
- [ ] System generates a final report and complete, hash-chained audit trail.
- Acceptance: the audit trail reconstructs the full path from initial submission
  to final decision, including every AI proposal and every human override.

## Non-functional requirements

- **Explainability:** every number in the final report traces back to a visible
  input (cited evidence, agent proposal, or deterministic calculation step).
- **Auditability:** hash-chained log covering all stage transitions and decisions.
- **Latency:** end-to-end stage 1→6 (excluding human review time) should complete
  within a demo-friendly window (target: under 2 minutes for a typical change
  request against the synthetic knowledge base) — refine this target once stage 5/6
  are built and measured.
- **Data:** synthetic only for this build; no real customer or regulator data.

## Out of scope (hackathon)

- Real core-banking system integration.
- Production-grade SSO/RBAC (see `security.md`).
- Multi-tenant support.
- Non-English documents/policies.
