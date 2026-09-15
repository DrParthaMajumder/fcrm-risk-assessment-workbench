# tests

- `backend/` — pytest for API, services (including the deterministic risk engine —
  fixed-input/fixed-output tests), and repositories.
- `agents/` — one module per agent in `src/agents/`, LLM calls mocked, includes the
  eval-set run described in `.claude/steering/ai-guidelines.md`.
- `frontend/` — component/unit tests for the Next.js app.
- `e2e/` — full stage 1→7 happy path, plus at least one rejection path and one
  "insufficient evidence" path.
