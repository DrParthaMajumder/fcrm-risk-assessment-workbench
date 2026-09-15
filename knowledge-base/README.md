# knowledge-base (synthetic data for the hackathon)

Source documents for stage 3 ingestion (`src/context/knowledge_loaders`). All
content here must be synthetic — no real customer, regulator, or internal bank
documents (see `.claude/steering/security.md`).

- `policies/` — KYC/CDD, Sanctions/PEP, AML/transaction monitoring, fraud/digital
  onboarding, credit card issuance.
- `regulations/` — synthetic regulatory text the policies are meant to satisfy.
- `procedures/` — risk scoring methodology, financial crime control inventory,
  historical assessments.
- `controls/` — the control inventory `control_agent` maps proposed risk factors
  against.

Keep filenames descriptive (`kyc-cdd-policy-v1.md`, not `doc1.md`) — they show up
as citation sources end to end.
