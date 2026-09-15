# Coding Standards

## Backend (`src/backend`)

- Python 3.11+, type hints everywhere, `pydantic` for all request/response schemas
  (`app/schemas/`) — never pass raw dicts across layer boundaries.
- Layering is one-directional: `api/` → `services/` → `repositories/` → `models/`.
  API route handlers contain no business logic; that belongs in `services/`.
  `repositories/` are the only layer that talks to the database.
- Formatting/linting: `black` + `ruff`. Run before every commit.
- Every service in `app/services/` that computes a risk-relevant number must have a
  unit test with fixed inputs and an exact expected output — these are deterministic
  functions and must be tested as such (no "close enough" assertions).

## Agents (`src/agents`)

- One agent = one subpackage = one responsibility (matches the stage-5 agents in
  architecture.md). No agent should need to know about another agent's internals —
  they communicate only through the schemas defined in `src/backend/app/schemas`.
- Every agent takes structured input and returns structured JSON output validated
  against a schema. No free-text-only outputs.
- Every agent has at least one test in `tests/agents/` that mocks the LLM call and
  asserts the agent handles malformed/partial model output without crashing the
  pipeline.

## Prompts (`src/prompts`)

- One file per prompt version, per agent subfolder. Never edit a prompt in place
  without bumping a version marker in the file header (model used, date, author,
  one-line summary of the change).
- `src/prompts/shared/` holds cross-agent system instructions (tone, output-schema
  reminders, citation requirements) — agent-specific prompts should reference it
  rather than duplicate it.
- Prompt changes go through the same PR review as code changes, and should be run
  against the eval set (see the evaluation approach in `ai-guidelines.md`) before
  merging.

## Frontend (`src/frontend/next-app`)

- TypeScript, functional components. API calls go through a single typed client
  layer, not scattered `fetch` calls.
- Review screens (stage 7) must render the full evidence trail (citations, agent
  proposals, deterministic score breakdown) — never just the final number.

## Git

- Branch per stage/agent, e.g. `stage-5/risk-agent`, `stage-7/review-ui`.
- Conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).
- One reviewer minimum on every PR. Prompt-only and spec-only changes still need
  review — they change system behavior as much as code does.

## Testing

- `pytest` for backend and agents, mocking LLM calls in agent tests.
- `tests/e2e/` covers the full stage 1→7 happy path plus at least one rejection
  path and one "insufficient evidence" path.
- No PR merges with failing tests; no test is deleted to make a build pass without
  a reviewed explanation in the PR description.
