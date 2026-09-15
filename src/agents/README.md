# src/agents

One subpackage per AI agent, each a single-responsibility LangGraph node used in
stage 5 (Assessment Agents) and stage 1 (Change Understanding). See
`.claude/steering/ai-guidelines.md` for the full contract — the short version:

- Agents propose, they never decide, and none of them computes a final risk score.
- Every agent consumes/produces the schemas defined in `src/backend/app/schemas`,
  including a `citations` field — no uncited claims.
- One owner per agent subpackage; keep them independent so team members can work
  in parallel without merge conflicts.

## Subpackages

- `change_understanding_agent/` — stage 1: raw brief → structured change spec.
- `change_impact_agent/` — stage 5: drafts the impact assessment.
- `risk_agent/` — stage 5: proposes cited risk factors.
- `control_agent/` — stage 5: maps risk factors to `knowledge-base/controls`.
- `evidence_agent/` — stage 5: supplies/validates citations for the others.

Each subpackage should contain the agent's LangGraph node implementation and
import its prompt from the matching folder in `src/prompts/`. Tests live in
`tests/agents/`, one test module per agent, with LLM calls mocked.
