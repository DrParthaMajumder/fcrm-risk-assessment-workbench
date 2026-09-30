# version: 1
# model: n/a (infrastructure prompt)
# author: team
# date: 2026-09-30
# change: initial backend layer 1 — Supabase data access

# SME Loan Workbench — Backend Layer 1 Build Prompt

**Purpose:** Copy-paste prompt to build the first backend layer: modular Supabase data-access foundation.

**Companion:** After building, verify with Postman against live `sme_applications` table.

---

## Addendum — Confirmed Supabase schema (2026-09-30)

Before implementing, note these facts confirmed from the Supabase Table Editor:

| Fact | Detail |
|------|--------|
| Table | `public.sme_applications` |
| Column naming | **PascalCase matching CSV headers** — NOT lowercase snake_case |
| Primary lookup | `Business_ID` (e.g. `SME-10000`) |
| Column count | 53 fields (same as `master_sme_credit_risk_dataset_10k.csv`) |
| Supabase UI type | All columns show as `text` — coerce numerics/booleans in Pydantic if needed |
| Workflow fields | **Not in table** — no `ai_status`, `review_status` yet |
| Response JSON | Use **PascalCase keys** as stored (`Business_ID`, `Business_Name`, …) |

Repository filter example:

```python
.eq("Business_ID", business_id)
```

---

## Build prompt (sections 1–17)

You are working on the backend of this project.

TASK:
Build the FIRST backend layer only: a modular Supabase data-access foundation for the SME loan application system.

IMPORTANT:
Before changing anything, inspect the CURRENT project/folder structure and existing backend code.

1. UNDERSTAND THE CURRENT PROJECT

First inspect:
- current folder structure
- existing backend files
- existing FastAPI setup
- existing dependency files
- existing environment/configuration
- existing API/router patterns
- existing database-related code

Do NOT blindly create a new structure.

If the current backend structure is unsuitable for a modular architecture, you MAY reorganize or modify it.

Preserve useful existing code.

Make only the necessary changes.

Do NOT modify the frontend.

--------------------------------------------------
2. TARGET BACKEND ARCHITECTURE
--------------------------------------------------

The backend will eventually grow into:

FastAPI
   ↓
API Routers
   ↓
Services
   ↓
LangGraph orchestration
   ↓
Risk Engine / RAG / AI Agents
   ↓
Repositories
   ↓
Supabase PostgreSQL

For THIS task, implement only:

FastAPI Router
   ↓
Service
   ↓
Repository
   ↓
Supabase

Do NOT implement yet:
- Risk Engine
- LangGraph workflow
- RAG
- PDF processing
- LLM agents
- Human decision workflow
- Scoring rules
- Frontend changes

--------------------------------------------------
3. SUPABASE CONFIGURATION
--------------------------------------------------

Use environment variables:

SUPABASE_URL=https://fuokhdhwrdxekwzgzvfc.supabase.co
SUPABASE_SECRET_KEY=<secret key>

IMPORTANT:
- Never hardcode the secret key.
- Never expose the secret key to frontend code.
- Never commit .env files.
- Add/update .env.example with variable names only.
- The backend uses the Supabase server-side Secret key.

The Supabase table already exists.

Table:

sme_applications

The CSV has already been imported into this table.

DO NOT:
- recreate the table
- overwrite the table
- modify existing data
- create fake/mock application data

--------------------------------------------------
4. MODULAR FASTAPI ROUTER ARCHITECTURE
--------------------------------------------------

Use FastAPI APIRouter.

Do NOT put all endpoints directly in main.py.

Create/adapt a modular API structure.

For example, conceptually:

app/
├── main.py
├── api/
│   ├── router.py
│   └── routes/
│       ├── health.py
│       └── applications.py
├── services/
│   └── application_service.py
├── repositories/
│   └── sme_application_repository.py
├── core/
│   ├── config.py
│   └── supabase.py
└── schemas/

The exact structure should follow the existing project conventions after inspection.

Use:

app.include_router(...)

and preferably a central API router, for example:

api_router = APIRouter()

api_router.include_router(
    applications.router,
    prefix="/applications",
    tags=["Applications"]
)

Then:

app.include_router(
    api_router,
    prefix="/api/v1"
)

Do NOT hardcode route logic directly in main.py.

--------------------------------------------------
5. APPLICATION ENDPOINT FOR POSTMAN
--------------------------------------------------

Create a real testable GET endpoint:

GET /api/v1/applications/{business_id}

Example Postman request:

GET http://127.0.0.1:8000/api/v1/applications/SME-10000

The endpoint must retrieve the REAL record from:

Supabase → sme_applications

Do NOT use mock data.

Expected flow:

Postman
   ↓
FastAPI
   ↓
APIRouter
   ↓
Application Service
   ↓
SME Application Repository
   ↓
Supabase
   ↓
sme_applications
   ↓
JSON response
   ↓
Postman

--------------------------------------------------
6. APPLICATION SERVICE
--------------------------------------------------

Create/adapt:

services/application_service.py

The service should call the repository.

Example responsibility:

get_application_by_business_id(business_id)

The service must NOT contain raw Supabase queries.

Keep:

Router
  ↓
Service
  ↓
Repository

--------------------------------------------------
7. APPLICATION REPOSITORY
--------------------------------------------------

Create/adapt:

repositories/sme_application_repository.py

The repository is responsible for Supabase database access.

Implement at minimum:

get_application_by_business_id(business_id)

Optionally implement list functionality if it fits the existing architecture, but do not build unnecessary APIs yet.

The repository must:
- communicate with Supabase
- return clean Python data
- handle database errors appropriately
- contain NO risk/scoring logic
- contain NO LangGraph logic
- contain NO LLM logic

--------------------------------------------------
8. RESPONSE
--------------------------------------------------

For:

GET /api/v1/applications/SME-10000

return the real application record.

Use the actual fields returned by the existing `sme_applications` table (PascalCase: `Business_ID`, `Business_Name`, `Annual_Revenue`, `Owner_Credit_Score`, …).

Do not invent fields.

Handle:

200 → application found

404 → Business_ID does not exist

500/appropriate 5xx → Supabase/database failure

Do not expose:
- Supabase credentials
- connection strings
- internal database errors
- stack traces in production responses

--------------------------------------------------
9. HEALTH ROUTER
--------------------------------------------------

If a health endpoint already exists, reuse it.

Otherwise create:

GET /health

Prefer a dedicated health router if that fits the project:

GET /health

It should confirm the FastAPI application is running.

Do not perform an expensive database query just for basic health unless an existing project convention requires it.

--------------------------------------------------
10. PYDANTIC SCHEMAS
--------------------------------------------------

Inspect the actual Supabase table fields.

Create appropriate response schemas if appropriate.

Do not invent a completely different data model.

For this first implementation, avoid excessive validation/model complexity.

The goal is to prove:

Supabase → Backend → Postman

--------------------------------------------------
11. DEPENDENCIES
--------------------------------------------------

Inspect the existing dependency-management system first.

If the Supabase Python SDK is missing, add it using the project's existing package manager.

Do NOT introduce a second package/dependency management system.

--------------------------------------------------
12. ENVIRONMENT CONFIGURATION
--------------------------------------------------

Use the existing configuration pattern if one exists.

Otherwise create a clean environment-based configuration.

Required:

SUPABASE_URL
SUPABASE_SECRET_KEY

Add/update:

.env.example

but NEVER put the real secret key in .env.example.

--------------------------------------------------
13. TESTING
--------------------------------------------------

Add minimal backend tests where appropriate.

At minimum verify:

1. Application exists
   GET /api/v1/applications/SME-10000
   → 200

2. Application does not exist
   GET /api/v1/applications/DOES-NOT-EXIST
   → 404

3. Router is correctly registered using include_router()

Do not create a large test framework yet.

--------------------------------------------------
14. POSTMAN VERIFICATION
--------------------------------------------------

After implementation, actually start the FastAPI backend if possible.

Verify:

GET http://127.0.0.1:8000/health

Then:

GET http://127.0.0.1:8000/api/v1/applications/SME-10000

The second request MUST retrieve data from the real Supabase table:

sme_applications

Also test:

GET http://127.0.0.1:8000/api/v1/applications/INVALID-ID

and confirm it returns 404.

Document the exact Postman requests in the backend README.

--------------------------------------------------
15. IMPORTANT MODULARITY REQUIREMENT
--------------------------------------------------

The backend must be designed so future modules can be added without rewriting the existing application route.

Future modules will include:

/api/v1/applications
/api/v1/assessments
/api/v1/risk
/api/v1/policies
/api/v1/decisions
/api/v1/audit
/api/v1/agents

Each should eventually have its own router.

The architecture should therefore follow:

main.py
   ↓
central API router
   ↓
feature routers
   ↓
services
   ↓
repositories
   ↓
Supabase

--------------------------------------------------
16. DO NOT BUILD THE FOLLOWING YET
--------------------------------------------------

Do NOT implement:

- Risk Engine
- Risk scoring
- Risk thresholds
- LangGraph graph
- Agents
- LLM
- PDF ingestion
- Embeddings
- Vector search
- RAG
- Human-in-the-loop
- Decision engine

Those will be added in later phases.

--------------------------------------------------
17. FINAL VERIFICATION REPORT
--------------------------------------------------

After implementation, report:

1. Existing backend structure discovered
2. Structure changes made, if any
3. Files created
4. Files modified
5. Why each change was made
6. Supabase connection status
7. Exact API endpoint created
8. Exact Postman URL
9. Example successful response
10. Confirmation that the response came from the real `sme_applications` Supabase table

The ONLY goal of this task is:

Postman
   ↓
FastAPI Router
   ↓
Application Service
   ↓
SME Application Repository
   ↓
Supabase
   ↓
sme_applications

Build this cleanly and modularly so that LangGraph, Risk Engine, RAG, and AI agents can be added later without restructuring the foundation.
