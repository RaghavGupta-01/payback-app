# PayBack

PayBack is a credit-card bill payment dashboard that rewards you with coins on every payment
and gives you a clear view of your spending — built with Next.js, FastAPI, and PostgreSQL.

## Tech Stack

- Frontend: Next.js + TypeScript
- Backend: FastAPI + Python
- Database: PostgreSQL
- ORM: SQLAlchemy (async)
- Schema: `schema.sql` + seed script
- Database Hosting: Neon

## Project Structure

```text
payback-app/
├── backend/
│   ├── app/
│   │   ├── api/        # Routers (endpoints for transactions, balance, rewards)
│   │   ├── core/       # Configurations (CORS middleware, app config)
│   │   ├── data/       # Seed source files (transactions.json)
│   │   ├── db/         # DB connection, schema.sql, and data seed.py
│   │   ├── models/     # SQLAlchemy database entities
│   │   ├── schemas/    # Pydantic serialization/validation schemas
│   │   └── main.py     # FastAPI entry point
│   ├── .env            # Environment configurations
│   └── requirements.txt# Python package dependencies
├── frontend/
│   ├── app/            # Next.js App Router (routes, layout, and global styling)
│   ├── components/     # Reusable React components (UI, table, layout, rewards, chart)
│   ├── lib/            # API clients, React Query hooks, Zustand store, styling tokens
│   ├── public/         # Static visual assets
│   ├── .env            # Frontend environment configurations
│   ├── package.json    # NPM workspace dependencies and scripts
│   └── tsconfig.json   # TypeScript configurations
├── AI-USAGE.md         # AI tools usage
├── ASSUMPTIONS.md      # Project assumptions
├── DECISIONS.md        # Architecture decisions
└── README.md           # Getting started guide
```

## Local Setup

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

# create .env with:
# DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<db>

python -m app.db.seed          # creates schema + seeds ~10k transactions
uvicorn app.main:app --reload  # runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install

# create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev                    # runs on http://localhost:3000
```

## Live URLs

- **Frontend:** [https://payback-app-roan.vercel.app/dashboard](https://payback-app-roan.vercel.app/dashboard)
- **Backend:** [https://payback-app-5la9.onrender.com](https://payback-app-5la9.onrender.com)

## Status (Done / Not Done / Known Issues)

### Completed (Done)
- **Backend & Database:**
  - REST API built with **FastAPI** featuring CORS support for seamless local and production integrations.
  - **SQLAlchemy (async)** and **PostgreSQL** schema configured with index optimizations on common query fields (merchant, status, occurred date).
  - Idempotent **Seeding Script** processing ~10,000 transactions, featuring amount normalization (absolute values) and reward coins aggregation.
  - Reset script for restoring balance/redemption state during testing.
  - Rewards endpoints (balance, catalog, redeem) with atomic balance updates and proper 400/404 error handling.
- **Frontend Core & State:**
  - Next.js application using **TypeScript**, **Tailwind CSS v4**, **Zustand** global stores, and **TanStack Query** hooks.
  - Custom unified design system tokens in `tokens.css` with clean, professional light mode styling.
- **Components & Features:**
  - **Unified Transactions Card:** Merged filters and table elements inside a single card wrapper with a clean uppercase header.
  - **Virtualized Grid:** Rendered up to 10k rows with zero lag using `react-window` supporting multi-key search and sorting.
  - **Expenditure Analysis Chart:** Donut chart visualizer with active hover details projected in the center (avoiding overlay collisions) and a toggleable **CSS Progress Bar List** mode. Click-to-filter wired into the transaction table.
  - **Transaction Details Drawer:** Smooth CSS-driven slide-in/slide-out panel with cached state transitions.
  - **Rewards Catalogue:** Clean gift cards grid with redemption validation, confirmation prompts, and optimistic query invalidations with rollback on failure.

### Not Done
- **Server-side pagination/filtering/sorting** — implemented client-side instead, given the fixed ~10k-row dataset size (see DECISIONS.md).
- **Second chart (monthly spend trend)** — only the category breakdown chart was built.
- **Two-way cross-filtering** — chart-to-table filtering is one-way only; table filters do not reshape the chart.
- **Redemption history view** — `redemptions` table captures full history in the database, but no UI surfaces it (out of scope per the brief's "select, confirm, done" flow).
- **Automated tests** — none included.
- **Accessibility pass** — beyond basic focus states on the table and drawer, no dedicated a11y audit (ARIA labeling, screen reader pass) was done.
- **Auth / multi-user support** — single seeded demo user only, no login.

### Known Issues & Constraints
- Column sizing: Symmetrical layout requires a minimum screen width of 768px; smaller resolutions will render table records in a scrollable horizontal container to prevent vertical text wrapping.
- Negative transaction amounts in the source data were normalized to their absolute value (treated as data-entry inconsistencies rather than refunds/credits) — see ASSUMPTIONS.md.
- Coin balance and rewards are scoped to a single hardcoded demo user; no per-user isolation exists.
- Reward redemption has no per-user limit — a reward can be redeemed repeatedly as long as balance allows (see ASSUMPTIONS.md).