# src/frontend

Next.js app (`next-app/`). Covers stage 1 (intake form) and stage 7 (analyst
review + committee decision UI).

Review screens must always show the full evidence trail — citations, individual
agent proposals, and the deterministic score breakdown — never just a final
number. See `.claude/steering/coding-standards.md` for frontend conventions.

Scaffold the actual Next.js app in `next-app/` when frontend work starts
(`npx create-next-app@latest` with TypeScript).
