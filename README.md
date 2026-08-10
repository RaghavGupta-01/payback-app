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
project/
├── frontend/       # Next.js frontend
├── backend/
│   └── app/
│       ├── api/        # routers
│       ├── models/     # SQLAlchemy models
│       ├── schemas/    # Pydantic schemas
│       ├── services/   # business logic
│       ├── db/         # session, schema.sql, seed.py
│       ├── data/       # transactions.json
│       └── core/       # config.py
├── .gitignore
└── README.md
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
<!-- TODO -->

## Status (Done / Not Done / Known Issues)
<!-- TODO -->