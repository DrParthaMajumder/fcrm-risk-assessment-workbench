# database

- `migrations/` — schema migrations for the data model in
  `.claude/specs/risk-assessment-workbench/design.md` (ChangeRequest,
  RetrievedEvidence, RiskFactorProposal, ControlMapping, RiskAssessment, Decision,
  AuditLogEntry). Also mounted into the `db` container in `docker-compose.yml`.
- `seed/` — synthetic seed data for local dev/demo (sample change requests,
  historical assessments) — never real data, see `.claude/steering/security.md`.
