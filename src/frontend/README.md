# SME Risk Workbench — Frontend

Next.js App Router UI for the SME loan underwriting workbench.

## Setup

```powershell
cd src/frontend
npm install
```

Copy `env.example` to `.env.local` and add your Clerk keys from [dashboard.clerk.com](https://dashboard.clerk.com):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Both keys are required. The secret key is shown once in the Clerk dashboard under **API keys**.

## Run

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/sign-in`.

## Auth routes

| Route | Purpose |
| --- | --- |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/` | Protected home queue |
| `/about` | Protected about page |
| `/applications/[id]` | Protected case detail |

## API

Authenticated requests to the FastAPI backend include `Authorization: Bearer <clerk-session-token>` when a user is signed in.
