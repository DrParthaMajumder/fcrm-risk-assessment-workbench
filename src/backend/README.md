# src/backend

FastAPI app (`app/`). Layering: `api/` → `services/` → `repositories/` → `models/`,
request/response shapes in `schemas/`. See `.claude/steering/coding-standards.md`.

The deterministic risk engine (stage 6) belongs in `app/services/` as plain
Python with no LLM calls — this is the one component allowed to assign a final
risk score (see `.claude/steering/ai-guidelines.md`).

Scaffold the FastAPI app (`app/main.py` + dependencies) when backend work starts.
