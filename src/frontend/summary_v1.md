# SME Risk Workbench — Frontend Summary (v1)

Status snapshot of the Next.js frontend in `src/frontend/`. Last updated to reflect the current implementation.

---

## Purpose

Internal **SME loan underwriting workbench** for analysts. Users queue loan applications, review document evidence, run AI assessments (recommendations only), check policy citations, record **human** Approve / Defer / Reject decisions, and view an audit trail.

The frontend **does not** compute risk scores or call LLMs directly. It displays data from the API (or mock fallback) and sends authenticated requests to the backend when available.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Auth | Clerk (`@clerk/nextjs`) |
| Styling | Tailwind only (`globals.css` imports Tailwind + dark variant) |
| Data | API client with mock fallback until FastAPI is connected |

---

## Project structure

```
src/frontend/
├── app/
│   ├── layout.tsx                 # Root: ClerkProvider, ThemeProvider, fonts
│   ├── globals.css
│   ├── (app)/                     # Protected routes (auth.protect)
│   │   ├── layout.tsx             # AppShell + AuthTokenBridge
│   │   ├── page.tsx               # Home / application queue
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── applications/[id]/page.tsx
│   └── (auth)/                    # Public auth routes
│       ├── sign-in/[[...sign-in]]/page.tsx
│       └── sign-up/[[...sign-up]]/page.tsx
├── components/
│   ├── layout/                    # Shell, header, footer, sidebar
│   ├── home/                      # Queue dashboard
│   ├── detail/                    # Case detail + tabs + chat
│   ├── contact/                   # Contact form
│   ├── auth/                      # Clerk token bridge
│   ├── theme/                     # Dark/light toggle
│   └── ui/                        # Badges, doc icons
├── lib/
│   ├── api/                       # client, types, auth-token
│   ├── mock/                      # Demo data (CSV-shaped)
│   ├── layout/                    # Route helpers, workflow steps
│   ├── ui/classes.ts              # Shared Tailwind class tokens
│   ├── clerk/appearance.ts
│   └── utils/                     # documents, format
└── proxy.ts                       # Clerk middleware
```

---

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Protected | Application queue (filters, stats, new application modal) |
| `/applications/[id]` | Protected | Case detail with 6 tabs + AI chat bar |
| `/about` | Protected | Platform overview |
| `/contact` | Protected | Risk ops contact form |
| `/sign-in` | Public | Clerk sign-in |
| `/sign-up` | Public | Clerk sign-up |

Unauthenticated users hitting protected routes are redirected to sign-in via `auth.protect()` in `(app)/layout.tsx`.

---

## Layout & navigation

### App shell (`AppShell.tsx`)

- **Header** — always visible, dark zinc bar (`zinc-950`): logo, center nav (Home, About, Contact), “Open queue” CTA, theme toggle, Clerk user / sign-in links
- **Sidebar** — only on workbench routes (`/` and `/applications/*`): full-height dark panel flush left, queue shortcuts, workflow stepper, help link, **Log out**
- **Main** — page content
- **Footer** — full-width dark multi-column footer + back-to-top button

About and Contact use **no sidebar**; content is centered (`contentPage` / `contentPageNarrow` tokens).

### Sidebar (workbench only)

**Home (`/`):**
- New application button
- Queue shortcuts: Pending review, Awaiting AI, Completed (URL query params)
- Case workflow stepper
- Need help? + Log out

**Application detail (`/applications/[id]`):**
- Back to queue
- Active case card (business name, ID)
- Workflow stepper (current step from application state)
- Need help? + Log out

---

## Pages

### Home — `WorkbenchHome.tsx`

- Stat cards: pending review, awaiting AI, completed
- Search + filters (stage, doc status, review status)
- Paginated application table (links to detail)
- **New application** modal
- Demo banner when using mock data
- Reads `?stage=` and `?action=new` from URL (sidebar links)

### Application detail — `ApplicationDetail.tsx`

Six tabs:

| Tab | Component | Purpose |
|-----|-----------|---------|
| Summary | `SummaryTab` | Business, loan, financial overview |
| Documents | `DocumentsTab` | 16 document fields + verification status |
| Assessment | `AssessmentTab` | Run assessment, score, risk factors, AI recommendation |
| Policy | `PolicyTab` | Regulatory / policy citations |
| Decision | `DecisionTab` | Human Approve / Defer / Reject + justification |
| Audit | `AuditTab` | Event log (assessment runs, decisions) |

Actions: **Run assessment**, **Export package**, **AI chat bar** (bottom).

### About / Contact

Marketing-style content pages with compact headers; no workbench sidebar.

---

## Authentication

- **Clerk** for sign-in, sign-up, session, user profile in header
- `AuthTokenBridge` attaches Clerk session token for API calls
- `proxy.ts` runs `clerkMiddleware()` on matched routes
- API client sends `Authorization: Bearer <token>` when signed in

Required env (see `env.example` → `.env.local`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- Optional: `NEXT_PUBLIC_API_BASE_URL`

---

## API integration

### Client (`lib/api/client.ts`)

Tries FastAPI first; on failure or 503, falls back to **mock data** in `lib/mock/applications.ts`.

| Function | Endpoint | Mock fallback |
|----------|----------|---------------|
| `getApplications` | `GET /api/v1/applications` | `listMockApplications` |
| `getMetrics` | `GET /api/v1/metrics` | `getMockMetrics` |
| `getApplication` | `GET /api/v1/applications/{id}` | `getMockApplication` |
| `createApplication` | `POST /api/v1/applications` | `createMockApplication` |
| `runAssessment` | `POST /api/v1/applications/{id}/run` | `runMockAssessment` |
| `getAssessment` | `GET /api/v1/applications/{id}/assessment` | `getMockAssessment` |
| `submitDecision` | `POST /api/v1/applications/{id}/decisions` | `submitMockDecision` |
| `askQuestion` | `POST /api/v1/applications/{id}/ask` | `askMockQuestion` |
| `getAuditEvents` | `GET /api/v1/applications/{id}/audit` | `getMockAuditEvents` |
| `exportPackage` | `GET /api/v1/applications/{id}/package` | JSON blob from mock |

### Data model (`lib/api/types.ts`)

`Application` mirrors SME CSV columns (camelCase): business info, financials, 16 document fields, `aiStatus`, `reviewStatus`, etc.

`Assessment`: recommendation, risk band, score, factors, policy citations.

---

## Mock data (current demo)

- ~9 hardcoded applications in `lib/mock/applications.ts` (shape matches `master_sme_credit_risk_dataset_10k.csv`)
- Mock assessment **reads `loanStatus`** from the row as recommendation (placeholder until backend rule engine exists)
- Mock policy citations: Regulation B, NIST AI RMF (static text)
- In-memory audit events and chat history per case

**Not yet wired:** loading the full 10k CSV from backend.

---

## Theming

- `ThemeProvider` + `ThemeToggle` (light / dark)
- Header, footer, sidebar are **always dark** (zinc-950) for consistent chrome
- Main content area respects light/dark toggle
- Shared UI tokens in `lib/ui/classes.ts` (`ui.page`, `ui.card`, `ui.btnPrimary`, etc.)

---

## Key design rules (frontend)

1. **No client-side risk scoring** — score comes from API payload only
2. **AI output is labeled as recommendation**, not final approval
3. **Human decision is mandatory** — Decision tab records underwriter choice
4. **Tailwind only** — no separate CSS component libraries
5. **Protected app routes** — all workbench pages require Clerk auth

---

## Run locally

```powershell
cd src/frontend
npm install
# Copy env.example → .env.local and add Clerk keys
npm run dev
```

Open http://localhost:3000 — redirects to `/sign-in` if not authenticated.

Build: `npm run build`

---

## Not implemented (frontend scope — waiting on backend)

- Live FastAPI connection (uses mock when backend unavailable)
- Real CSV / Postgres data (10k applications)
- Real deterministic scoring display from rule engine
- Real RAG policy retrieval (Policy tab uses mock citations)
- Real LLM chat (mock responses in `askMockQuestion`)

---

## Related repo assets (outside frontend)

| Asset | Role |
|-------|------|
| `0_others/materials/*.csv` | Source loan application data (10k rows) |
| `0_others/materials/*.pdf` | Regulatory docs for future RAG |
| `src/backend/` | FastAPI (planned, not built) |

---

## Version note

**v1** — documents the frontend as a complete UI shell with Clerk auth, contextual sidebar, Paravision-inspired header/footer, and mock-driven underwriting workflow. Backend integration is the next major step.
