# Tasks — Risk Assessment Workbench

Live checklist. Keep in sync with reality — if it's done, check it; if scope
changed, edit `requirements.md`/`design.md` first, then reflect it here.

## Suggested ownership (map to your actual team size/skills)

| Owner | Stages | Primary folders |
|---|---|---|
| Backend/data lead | 3, 6 | `src/context/knowledge_loaders`, `database/`, `src/backend/app/services/risk_engine*` |
| Agent/orchestration lead | 2, 5 | `src/steering/graph`, `src/agents/*`, `src/prompts/*` |
| Retrieval/RAG lead | 4 | `src/context/retrieval`, `src/context/embeddings` |
| Frontend/UX lead | 1 (intake UI), 7 (review UI) | `src/frontend/next-app` |
| Backend/API lead | cross-cutting | `src/backend/app/api`, `schemas`, `repositories` |

Adjust freely — the point is one clear owner per stage, not a rigid org chart.

## Suggested hackathon sprint plan

**Day 1 — foundation + stages 1–3**
- [ ] Repo scaffold reviewed by whole team (this structure), `.env` set up, docker
      compose running Postgres+pgvector.
- [ ] Data model (`design.md`) implemented as SQLAlchemy models + migrations.
- [ ] Synthetic knowledge base drafted (`knowledge-base/*`) — enough to demo, not
      exhaustive.
- [ ] Ingestion pipeline (stage 3) working end-to-end into pgvector.
- [ ] Change Understanding Agent (stage 1) + intake form + confirm gate.

**Day 2 — stages 4–6**
- [ ] Retrieval layer (stage 4) returning cited passages for a real query.
- [ ] Orchestrator graph (stage 2) wired with checkpointing.
- [ ] Risk/Control/Evidence/Change Impact agents (stage 5) producing schema-valid
      output against real retrieved evidence.
- [ ] Deterministic risk engine (stage 6) implemented + unit tested against fixed
      inputs.

**Day 3 — stage 7, eval, demo polish**
- [ ] Review UI: evidence trail, agent proposals, score breakdown, override
      controls.
- [ ] Committee decision flow + final report generation.
- [ ] Audit trail hash-chaining implemented + verified with a tamper test.
- [ ] Eval set run against agents (see `ai-guidelines.md`); fix worst offenders.
- [ ] Demo script written (`docs/demo-script.md`) and rehearsed end-to-end.

## Definition of done (per task category)

- **Agent work:** schema-valid output, unit test with mocked LLM, at least one
  eval-set example passing, prompt version-noted.
- **Backend/service work:** type-hinted, unit tested, no business logic in API
  layer.
- **Frontend work:** matches the review workflow state machine in `design.md`,
  shows evidence/citations, no unexplained numbers.
- **Any spec change:** reviewed by a second person before implementation starts.
