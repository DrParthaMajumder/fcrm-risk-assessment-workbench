from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_assessment_service
from app.core.exceptions import (
    ApplicationNotFoundError,
    AssessmentStorageNotConfiguredError,
    DatabaseError,
)
from app.schemas.assessment import AssessmentResponse
from app.services.assessment_service import AssessmentService

router = APIRouter(tags=["Assessments"])


@router.post("/{business_id}/assessment", response_model=AssessmentResponse)
def run_assessment(
    business_id: str,
    service: AssessmentService = Depends(get_assessment_service),
) -> AssessmentResponse:
    try:
        run = service.run_assessment(business_id)
    except ApplicationNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Application not found") from exc
    except AssessmentStorageNotConfiguredError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except DatabaseError as exc:
        raise HTTPException(status_code=500, detail="Database unavailable") from exc

    return AssessmentResponse.from_run(run)
