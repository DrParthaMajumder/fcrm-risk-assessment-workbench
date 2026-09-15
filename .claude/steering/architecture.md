# Architecture

## The 7-stage pipeline

| # | Stage | Folder(s) | Nature |
|---|-------|-----------|--------|
| 1 | Product Design & Intake | `src/frontend/next-app` (intake form), `src/agents/change_understanding_agent`, `src/prompts/change_understanding` | AI-assisted (structures the brief), **human-gated** — analyst confirms before proceeding |
| 2 | Agent Control Panel | `src/steering/graph`, `src/steering/routers` | Deterministic orchestration (LangGraph) — routes tasks, manages retries/checkpoints, never skips a required approval |
| 3 | FCRM Knowledge Layer | `src/context/knowledge_loaders`, `src/context/embeddings`, `knowledge-base/` | Deterministic ingest pipeline (parse → chunk → embed → store in pgvector) |
| 4 | Policy & Evidence Retrieval | `src/context/retrieval` | RAG — retrieval is deterministic (vector search), the passages it returns are real, cited source text, not generated |
| 5 | Assessment Agents (Hypothesis) | `src/agents/change_impact_agent`, `risk_agent`, `control_agent`, `evidence_agent` | Probabilistic (LLM) — **proposals only**, structured JSON output, never a final score |
| 6 | Deterministic Risk Engine | `src/backend/app/services/risk_engine*` | Deterministic — plain Python, applies the bank's approved methodology, no LLM involved |
| 7 | Human Review & Decision | `src/frontend/next-app` (review UI), `src/steering/human_gates` | **Human-gated** — analyst review + committee decision; generates the final report |

## Why the pipeline is split this way

The core engineering judgment call in this project is: **which stages are
deterministic and which are probabilistic, and never let the two blur.**

- Stages 2, 3, 6 are deterministic by design — orchestration, retrieval mechanics,
  and scoring are all traditional logic. They must be reliable, reproducible, and
  auditable on their own, with no dependency on an LLM's behavior that day.
- Stages 1 and 5 are where LLMs add real value — turning a vague brief into a
  structured spec, and proposing risk factors/control mappings a human might miss.
  Their output is always a *hypothesis*, structured and cited, headed for either
  stage 6 (deterministic scoring) or stage 7 (human judgment) — never treated as a
  final answer.
- Stage 4 sits in between: retrieval mechanics are deterministic (pgvector similarity
  search), but the thing being retrieved (policy text) informs probabilistic stage 5.
  Only verified, citable content is allowed to cross that boundary — see
  `ai-guidelines.md`.

## Two "steering" folders, on purpose

- `.claude/steering/` (this folder) — static project-context documents. Read by
  people and by any Claude session for shared context. Not executed.
- `src/steering/` — actual orchestration *code*: the LangGraph graph definition,
  routing between agents, checkpoint/retry handling, and enforcement of human
  approval gates at runtime. Executed.

They're named the same because they do the same conceptual job (keep the process on
rails) at two different layers — one for the humans/AI building the system, one for
the system itself at runtime.

## Tech stack

- **Backend:** Python, FastAPI
- **Agent orchestration:** LangGraph
- **Database:** PostgreSQL + pgvector
- **Frontend:** Next.js
- **Model providers:** OpenAI / Groq / Gemini (agent-dependent, see ai-guidelines.md)
- **Deployment target:** containerized (Vercel/AWS/GCP-compatible), see `docker-compose.yml`

## Data flow (happy path)

Change request (1) → orchestrator picks it up (2) → relevant knowledge already
ingested and searchable (3) → orchestrator pulls cited policy/regulatory evidence
(4) → assessment agents propose risk factors + draft control mapping (5) →
deterministic engine computes inherent risk, applies control mitigation, enforces
the residual-risk floor, assigns a risk band (6) → analyst reviews, committee
decides, final report + audit trail generated (7).

## Audit trail

Every stage transition, agent output, retrieval result, and human decision is
logged and hash-chained so the full path from "vague business change" to
"audit-ready risk decision" can be reconstructed and verified — this is a
deterministic logging concern, not an LLM concern, and lives alongside the
orchestration code in `src/steering/`.
