-- SME risk assessment persistence (run in Supabase SQL editor or via migration tooling)
-- Does NOT modify sme_applications.

CREATE TABLE IF NOT EXISTS sme_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL,
    rule_version TEXT NOT NULL,
    status TEXT NOT NULL,
    scoring_status TEXT NOT NULL,
    overall_score DOUBLE PRECISION NULL,
    risk_band TEXT NULL,
    recommendation TEXT NULL,
    validation_valid BOOLEAN NOT NULL DEFAULT TRUE,
    validation_errors JSONB NULL,
    dimension_results JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES sme_assessments(id) ON DELETE CASCADE,
    factor_id TEXT NOT NULL,
    rule_id TEXT NOT NULL,
    rule_version TEXT NOT NULL,
    dimension TEXT NOT NULL,
    field TEXT NOT NULL,
    input_value TEXT NULL,
    triggered BOOLEAN NOT NULL,
    severity TEXT NOT NULL,
    explanation TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sme_assessments_business_id
    ON sme_assessments (business_id);

CREATE INDEX IF NOT EXISTS idx_sme_assessments_created_at
    ON sme_assessments (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_factors_assessment_id
    ON assessment_factors (assessment_id);
