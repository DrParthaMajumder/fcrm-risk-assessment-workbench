class ApplicationNotFoundError(Exception):
    def __init__(self, business_id: str) -> None:
        self.business_id = business_id
        super().__init__(f"Application not found: {business_id}")


class DatabaseError(Exception):
    def __init__(self, message: str = "Database unavailable") -> None:
        self.message = message
        super().__init__(message)


class AssessmentStorageNotConfiguredError(Exception):
    def __init__(
        self,
        message: str = (
            "Assessment storage tables are not configured. "
            "Run database/migrations/002_sme_assessments.sql and "
            "003_assessment_scoring_v2.sql in Supabase."
        ),
    ) -> None:
        self.message = message
        super().__init__(message)
