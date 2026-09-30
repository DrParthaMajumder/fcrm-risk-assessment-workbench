import logging
from typing import Any

from supabase import Client

from app.core.exceptions import DatabaseError

logger = logging.getLogger(__name__)

TABLE_NAME = "sme_applications"
BUSINESS_ID_COLUMN = "Business_ID"


class SmeApplicationRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_by_business_id(self, business_id: str) -> dict[str, Any] | None:
        try:
            response = (
                self._client.table(TABLE_NAME)
                .select("*")
                .eq(BUSINESS_ID_COLUMN, business_id)
                .maybe_single()
                .execute()
            )
        except Exception as exc:
            logger.exception("Supabase query failed for Business_ID=%s", business_id)
            raise DatabaseError() from exc

        return response.data
