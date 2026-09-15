# Design — Risk Assessment Workbench

Status: draft v0.1. Update this alongside `requirements.md`; get a second reviewer
on any change to data model or agent contracts before implementing.

## Component overview

```
Next.js frontend
      │  REST (JSON)
      ▼
FastAPI backend (src/backend/app)
  api/  → services/  → repositories/  → models/ (Postgres + pgvector)
      │
      ▼
LangGraph orchestrator (src/steering/graph)
      │
      ├─▶ src/agents/change_understanding_agent  (stage 1)
      ├─▶ src/context/retrieval                  (stage 4, over knowledge-base/)
      ├─▶ src/agents/{change_impact,risk,control,evidence}_agent  (stage 5)
      └─▶ src/backend/app/services/risk_engine    (stage 6, deterministic)
      │
      ▼
src/steering/human_gates  →  frontend review UI (stage 7)
```

## Data model (initial)

- **ChangeRequest** — id, submitter, raw_brief, structured_spec (json), status,
  created_at.
- **RetrievedEvidence** — id, change_request_id, source_doc, section, page,
  passage_text, retrieval_query.
- **RiskFactorProposal** — id, change_request_id, description, likelihood,
  impact, citation_ids (→ RetrievedEvidence), agent_version.
- **ControlMapping** — id, risk_factor_id, control_id (→ knowledge-base/controls),
  coverage_assessment, agent_version.
- **RiskAssessment** — id, change_request_id, inherent_risk, control_mitigation,
  residual_risk, risk_band, methodology_version, computed_at (produced only by
  `risk_engine`, never by an agent).
- **Decision** — id, change_request_id, reviewer, decision
  (approve/approve_with_conditions/defer/reject), conditions (nullable), decided_at.
- **AuditLogEntry** — id, change_request_id, stage, actor (agent name / user id /
  "system"), payload_summary, prev_hash, hash.

## Agent I/O contract (shape, not final schema — finalize in `src/backend/app/schemas`)

```json
{
  "proposal": { "...": "agent-specific fields" },
  "citations": [{ "source": "string", "section": "string", "page": 12 }],
  "confidence": "low | medium | high",
  "agent_version": "string"
}
```

Every agent in `src/agents/` must produce this envelope. `citations` may be empty
only if the agent explicitly could not find supporting evidence — never omitted
silently.

## Deterministic risk engine (stage 6) — outline

1. Inherent risk = f(likelihood, impact) per the bank's methodology matrix
   (`knowledge-base/procedures` — risk scoring methodology document).
2. Control mitigation = weighted reduction based on `ControlMapping.coverage_assessment`
   for each risk factor, capped so no single control eliminates a risk category
   entirely.
3. Residual risk = inherent risk − control mitigation, floored at a configurable
   minimum > 0 (residual risk is never zero — see requirements.md).
4. Risk band = threshold lookup on residual risk (e.g., Low/Medium/High/Critical —
   confirm exact bands against the methodology doc before implementing).

This entire calculation is pure, deterministic Python with no external calls —
unit-testable with fixed inputs/outputs.

## Human review workflow (stage 7) — state machine

```
Submitted → Structured (post stage 1 gate) → Assessed (post stage 5/6)
   → In Review (analyst) → Submitted to Committee
   → Decided (approve | approve_with_conditions | defer | reject)
```

`defer` returns the request to "In Review" with committee notes attached, not a
terminal state.

## API surface (sketch — finalize per stage as built)

- `POST /change-requests` — stage 1 submit
- `POST /change-requests/{id}/confirm` — stage 1 human gate
- `GET /change-requests/{id}/assessment` — stages 4–6 results
- `POST /change-requests/{id}/review` — analyst overrides (stage 7)
- `POST /change-requests/{id}/decision` — committee decision (stage 7)
- `GET /change-requests/{id}/audit-trail` — full hash-chained log

Full contract goes in `docs/api.md` once endpoints are implemented.
