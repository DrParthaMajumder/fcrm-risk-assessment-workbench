"""
Apply assessment table migration to Supabase Postgres.

Requires SUPABASE_DB_URL in .env, e.g.:
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

Run from src/backend:
  python scripts/apply_assessment_migration.py
"""

from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

MIGRATION = (
    Path(__file__).resolve().parents[3] / "database" / "migrations" / "002_sme_assessments.sql"
)


def main() -> None:
    import os

    db_url = os.getenv("SUPABASE_DB_URL")
    if not db_url:
        raise SystemExit(
            "SUPABASE_DB_URL is not set. Add it to src/backend/.env or run the SQL "
            f"manually in Supabase SQL editor:\n  {MIGRATION}"
        )

    try:
        import psycopg2
    except ImportError as exc:
        raise SystemExit("Install psycopg2-binary: pip install psycopg2-binary") from exc

    sql = MIGRATION.read_text(encoding="utf-8")
    with psycopg2.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    print(f"Applied migration: {MIGRATION.name}")


if __name__ == "__main__":
    main()
