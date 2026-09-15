# src/steering

Runtime orchestration code — this is stage 2 (Agent Control Panel) plus the
enforcement side of stage 7's human gates. **Not the same as `.claude/steering/`**,
which is static project-context docs; see `.claude/steering/architecture.md` for
why both exist under the same name.

- `graph/` — the LangGraph graph definition: nodes, edges, state schema,
  checkpointing/retry behavior.
- `human_gates/` — enforcement of mandatory approval points (intake confirmation,
  committee decision) at the backend/orchestration level, not just the UI. A
  request must not be able to advance past a gate without a recorded approval.
- `routers/` — routing logic between agents and stages within the graph.

This layer is deterministic control flow around probabilistic agent calls — it
should be as boring and predictable as possible.
