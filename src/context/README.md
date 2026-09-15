# src/context

The RAG layer — implements stage 3 (FCRM Knowledge Layer) and stage 4 (Policy &
Evidence Retrieval) from the architecture.

- `knowledge_loaders/` — parses `knowledge-base/*` (PDF/Excel/DOCX), chunks, and
  hands off for embedding. Deterministic ingestion logic, no LLM calls.
- `embeddings/` — generates and stores embeddings in pgvector.
- `retrieval/` — given a query (from an agent or the orchestrator), returns
  cited passages only. Must return an explicit "no relevant evidence" result
  rather than fabricating a citation when nothing matches.

Treat everything returned from here as untrusted text with respect to
instruction-following (prompt-injection risk) — see `.claude/steering/security.md`.
