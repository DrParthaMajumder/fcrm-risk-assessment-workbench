# src/backend

FastAPI SME loan underwriting API. Layering: `api/` → `services/` → `repositories/` → Supabase.

## Risk Engine v2 (deterministic)

Multi-dimensional scoring engine in `app/risk_engine/`:

```
Application row → Validation → Feature preparation → Rule evaluation
  → Dimension aggregation → Overall score → Risk band → Recommendation
```

- **Six dimensions:** CREDIT, FINANCIAL, BUSINESS, DOCUMENT_COMPLIANCE, MARKET_INDUSTRY, REPUTATION_OPERATIONAL
- **27 rules** in `rules/definitions.py` (rule version `1.0`)
- **DEMO scoring policy:** `app/risk_engine/policy/demo_policy.py` (`scoring_policy_version: demo-1.0`)
  - **NOT production underwriting policy** — replace thresholds/weights/bands before live use
- **Scoring formula:** `app/risk_engine/scoring.py`
- **`Loan_Status` is never used** as an engine input

### Assessment endpoint

```
POST /api/v1/applications/{business_id}/assessment
```

### Run locally

```bash
cd src/backend
pip install -r requirements.txt
python run.py
```

Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `src/backend/.env`.

Optional: `SUPABASE_DB_URL` auto-applies migrations `002` and `003` on startup.

### Migrations

1. `database/migrations/002_sme_assessments.sql`
2. `database/migrations/003_assessment_scoring_v2.sql`

With `REQUIRE_ASSESSMENT_PERSISTENCE=false` (default), assessments return even if tables are missing (`persisted: false`).

### Tests

```bash
cd src/backend
python -m pytest ../../tests/backend -q
```
