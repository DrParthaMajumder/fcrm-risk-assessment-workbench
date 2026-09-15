# FCRM Risk Assessment Workbench — Context Entry Point

Read this file first, in any Claude session, before touching code. It exists so every
team member's Claude session starts from the same shared understanding of the project,
regardless of who is driving.

## What this project is

An AI-assisted financial-crime risk assessment tool for banking change requests.
Full pitch and demo scenario: `.claude/steering/product.md`.
Full 7-stage architecture and tech stack: `.claude/steering/architecture.md`.

## Before you write anything

1. Read `.claude/steering/*.md` — these five files are the standing rules for this
   project (product intent, architecture, coding standards, security, AI guidelines).
   They do not change per task; treat them as load-bearing context, not suggestions.
2. Read `.claude/specs/risk-assessment-workbench/requirements.md`, `design.md`, and
   `tasks.md` — these are the current spec for what's being built. If a task isn't
   covered by them, stop and update the spec first (see workflow below), don't
   improvise silently.
3. Only then look at the relevant `src/` folder for the task at hand.

## Spec-driven workflow (why there's no Kiro here)

We are not using Kiro. We're reproducing the *pattern* it enforces — write the spec,
get it human-reviewed, then implement against it — using plain Markdown in `.claude/`
that any Claude session (or person) can read and edit. The discipline that matters is:

- `requirements.md` changes → reviewed by whoever owns the affected stage.
- `design.md` changes → reviewed by at least one other engineer before implementation starts.
- `tasks.md` is the live checklist; update it as work lands, don't let it drift from reality.

Treat a spec edit the same as a code change: propose it, get eyes on it, then build.

## Folder map (see `.claude/steering/architecture.md` for the full rationale)

- `src/frontend/` — Next.js app (analyst UI, review/decision screens).
- `src/backend/` — FastAPI app: API, DB models/schemas, services, repositories.
  The **deterministic risk engine** lives in `src/backend/app/services/` as plain
  Python — no LLM calls. This is intentional; see ai-guidelines.md.
- `src/agents/` — one subpackage per AI agent (LangGraph nodes). Agents propose,
  they never decide.
- `src/prompts/` — versioned prompt templates, one folder per agent, reviewed like code.
- `src/context/` — retrieval/embeddings/knowledge-loading (the RAG layer over
  `knowledge-base/`).
- `src/steering/` — runtime orchestration: the LangGraph graph definition, routing,
  and human-approval-gate enforcement (the "Agent Control Panel" in the architecture
  diagram). **Not to be confused with `.claude/steering/`** above, which is static
  project-context docs, not code. Two different "steering" concepts, kept apart on
  purpose — see architecture.md for why both exist.

## Non-negotiables

- No agent in `src/agents/` computes a final risk score. Only
  `src/backend/app/services/risk_engine*` does, deterministically.
- No stage skips its human review gate (see architecture.md, stage 7, and
  ai-guidelines.md).
- All knowledge-base content is synthetic for this hackathon — never introduce real
  customer or regulator data.
