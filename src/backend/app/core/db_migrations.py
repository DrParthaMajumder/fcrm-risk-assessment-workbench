import logging
from pathlib import Path

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[4]
MIGRATIONS = (
    REPO_ROOT / "database" / "migrations" / "002_sme_assessments.sql",
    REPO_ROOT / "database" / "migrations" / "003_assessment_scoring_v2.sql",
)


def apply_migrations(db_url: str) -> None:
    """Apply assessment table DDL via direct Postgres connection."""
    try:
        import psycopg2
    except ImportError as exc:
        raise RuntimeError("Install psycopg2-binary to run database migrations") from exc

    with psycopg2.connect(db_url) as conn:
        with conn.cursor() as cur:
            for migration in MIGRATIONS:
                if not migration.exists():
                    logger.warning("Migration file not found: %s", migration)
                    continue
                sql = migration.read_text(encoding="utf-8")
                logger.info("Applying migration %s", migration.name)
                cur.execute(sql)
        conn.commit()
    logger.info("Assessment migrations applied successfully")


def ensure_assessment_tables(db_url: str | None) -> None:
    if not db_url:
        logger.info(
            "SUPABASE_DB_URL not set — skip auto-migration. "
            "Run database/migrations/002 and 003 in Supabase SQL editor "
            "or set SUPABASE_DB_URL."
        )
        return
    try:
        apply_migrations(db_url)
    except Exception:
        logger.exception("Failed to apply assessment migrations on startup")
