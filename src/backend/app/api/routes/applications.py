from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_application_service
from app.core.config import get_settings
from app.core.exceptions import ApplicationNotFoundError, DatabaseError
from app.schemas.application import SmeApplicationResponse
from app.services.application_service import ApplicationService

router = APIRouter(tags=["Applications"])


@router.get("/{business_id}", response_model=SmeApplicationResponse)
def get_application(
    business_id: str,
    service: ApplicationService = Depends(get_application_service),
) -> SmeApplicationResponse:
    try:
        row = service.get_application_by_business_id(business_id)
    except ApplicationNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Application not found") from exc
    except DatabaseError as exc:
        settings = get_settings()
        detail = (
            exc.message
            if settings.env == "development"
            else "Database unavailable"
        )
        raise HTTPException(status_code=500, detail=detail) from exc

    return SmeApplicationResponse.model_validate(row)
