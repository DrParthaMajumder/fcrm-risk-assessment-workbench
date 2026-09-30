-- Risk Engine v2 assessment fields (DEMO scoring policy support)
-- Run after 002_sme_assessments.sql

ALTER TABLE sme_assessments
    ADD COLUMN IF NOT EXISTS scoring_policy_version TEXT NULL,
    ADD COLUMN IF NOT EXISTS recommendation_reasons JSONB NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS validation_warnings JSONB NULL DEFAULT '[]'::jsonb;

ALTER TABLE assessment_factors
    ADD COLUMN IF NOT EXISTS weight DOUBLE PRECISION NULL,
    ADD COLUMN IF NOT EXISTS contribution DOUBLE PRECISION NULL;
