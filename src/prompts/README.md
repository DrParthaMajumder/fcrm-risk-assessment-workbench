# src/prompts

Versioned prompt templates, one folder per agent, reviewed like code (see
`.claude/steering/coding-standards.md`).

## Convention

- One file per prompt version. Never silently edit a live prompt — add a new
  version and update the header:
  ```
  # version: 2
  # model: <model used to develop/tune this prompt>
  # author: <name>
  # date: <yyyy-mm-dd>
  # change: <one line>
  ```
- `shared/` holds cross-agent system instructions: tone, the required JSON output
  envelope, and the citation requirement. Agent-specific prompts reference it
  rather than duplicating it.
- Any prompt change should be re-run against the eval set
  (`.claude/steering/ai-guidelines.md` → Evaluation) before merging.

## Folders

`change_understanding/`, `change_impact/`, `risk/`, `control/`, `evidence/`, `shared/`
— mirrors `src/agents/`.
