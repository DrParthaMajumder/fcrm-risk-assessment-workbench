# FCRM Risk Assessment Workbench

AI-powered, governed, evidence-driven financial-crime risk assessment for banking
change requests. See `.claude/steering/product.md` for the full pitch and demo
scenario (instant digital card issuance).

## Start here

- **New to the project?** Read `CLAUDE.md`, then `.claude/steering/*.md`.
- **Picking up a task?** Check `.claude/specs/risk-assessment-workbench/tasks.md`.
- **Working with an AI agent?** Read `.claude/steering/ai-guidelines.md` first —
  it defines what agents are and aren't allowed to do.

## Structure

```
fcrm-risk-assessment-workbench/
├── CLAUDE.md                     # context entry point for any Claude session
├── .claude/
│   ├── specs/risk-assessment-workbench/
│   │   ├── requirements.md       # what we're building, stage by stage
│   │   ├── design.md             # how it's built: data model, contracts, algorithms
│   │   └── tasks.md              # live task board, mapped to owners
│   └── steering/                 # standing project context (read-only rules, not code)
│       ├── product.md
│       ├── architecture.md
│       ├── coding-standards.md
│       ├── security.md
│       └── ai-guidelines.md
├── src/
│   ├── frontend/next-app/        # Next.js UI (intake form, review/decision screens)
│   ├── backend/app/              # FastAPI: api, core, models, schemas, services, repositories
│   ├── agents/                   # one LangGraph agent per subpackage (proposals only)
│   ├── prompts/                  # versioned prompt templates, one folder per agent
│   ├── context/                  # RAG layer: retrieval, embeddings, knowledge loaders
│   └── steering/                 # runtime orchestration: graph, human gates, routers
├── database/{migrations,seed}/
├── knowledge-base/{policies,regulations,procedures,controls}/   # synthetic FCRM docs
├── tests/{backend,frontend,agents,e2e}/
├── docs/{architecture,api,demo-script}.md   # judge/reader-facing docs
├── docker-compose.yml
├── INSTALL.md                    # software required + how to install it (server or local)
└── .env.example
```

## How the team works on this together

1. **Own a stage, not just a file.** The architecture has 7 stages (see
   architecture.md). Each stage maps to specific folders — pick one up end-to-end
   (agent + prompt + context/steering wiring + backend service + tests) rather than
   splitting purely by frontend/backend.
2. **Spec before code.** Any new capability gets a paragraph in `requirements.md`
   and a design note in `design.md` before an agent or endpoint is built. Small
   fixes don't need this; new agents, new API contracts, and schema changes do.
3. **Prompts are reviewed like code.** They live in `src/prompts/`, are versioned,
   and go through the same PR review as `src/agents/` code — see coding-standards.md.
4. **Deterministic vs. AI stays visible.** Anything in `src/backend/app/services/`
   that computes a final number does so in plain Python, no LLM. If you're tempted
   to have an agent "just calculate" something, stop and read ai-guidelines.md.
5. **Human gates are not optional.** The intake confirmation gate and the final
   committee-decision gate must never be bypassed, including in demos — see
   architecture.md and security.md.
6. **Git flow:** branch per stage/agent (`stage-5/risk-agent`, `stage-7/review-ui`),
   conventional commits, one reviewer minimum, prompts and specs reviewed with the
   same rigor as application code.

## Local setup

See `INSTALL.md` for the full software list and install steps (Docker path or
manual path). Quick version:

```bash
cp .env.example .env        # fill in model API keys
docker compose up -d db     # start Postgres + pgvector
# backend and frontend dev servers: see src/backend/README.md and
# src/frontend/README.md respectively once scaffolded
```
