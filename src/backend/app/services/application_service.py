from typing import Any

from app.core.exceptions import ApplicationNotFoundError
from app.repositories.sme_application_repository import SmeApplicationRepository


class ApplicationService:
    def __init__(self, repository: SmeApplicationRepository) -> None:
        self._repository = repository

    def get_application_by_business_id(self, business_id: str) -> dict[str, Any]:
        row = self._repository.get_by_business_id(business_id)
        if row is None:
            raise ApplicationNotFoundError(business_id)
        return row
