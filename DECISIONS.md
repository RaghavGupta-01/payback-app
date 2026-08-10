# Technical Decisions

## Frontend
<!-- TODO -->

## Backend
- **FastAPI + async SQLAlchemy (asyncpg)** for non-blocking DB access under load.
- Route handlers query SQLAlchemy models directly.
- **Plain `schema.sql` + seed script** instead of Alembic migrations —  a one-shot
  seed, not an evolving schema.
- **Redeem endpoint is atomic**: balance check, redemption insert, and balance decrement
  happen inside a single DB transaction (`SELECT ... FOR UPDATE` on the user row) so a
  failed or concurrent redeem can never leave the coin balance in an inconsistent state.
- Transactions are returned ordered by `occurred_at DESC` by   default, so the most recent transaction appears first in the table.
- `/api/transactions` accepts `limit` and `offset`, with a default `limit=10000`,
  so the endpoint can serve both broad fetches and narrower server-side slices.
- Redeem endpoint returns `400` for insufficient balance and `404` when the requested
  reward cannot be redeemed because it was not found in the active catalog, rather than
  a generic `422`, so the frontend can distinguish and message each case differently.
- `reward.active` flag used instead of hard-deleting rewards, so redemption history stays valid even if a reward is retired later.

## Data handling (seed script)
- **Timestamp normalization**: source data mixes ISO 8601 strings and epoch-millisecond
  integers for `timestamp`, and the seed script also tolerates `DD/MM/YYYY HH:MM:SS`;
  these are normalized to a single `TIMESTAMPTZ` (`occurred_at`) at seed time.
- **Amount coercion**: source data mixes numeric and numeric-string values for `amount`
  (e.g. `"5234.2"`); coerced to `float` at seed time via a single `parse_amount()` helper.
- **Status normalization**: `status` values are uppercased at seed time to guard against
  inconsistent casing before the `CHECK` constraint is applied.
- **Category normalization**: missing/empty/whitespace-only categories fall back to
  `"Uncategorized"` rather than being dropped or left blank.

## Schema
- `occurred_at` (business time, from source data) is kept separate from `created_at`
  (system/audit time, defaults to `now()` at insert) — standard practice, and useful if
  rows are ever updated or re-seeded incrementally.
- `coins_earned` is precomputed and stored per transaction row at seed time (rather than
  calculated on every read) so balance reconciliation (`SUM(coins_earned)`) is cheap and
  the earning rule only has to be evaluated once.
- `redemptions` table doubles as an audit trail and makes "reject invalid/unaffordable
  redeem" straightforward to test and verify against.
- Indexes added on `category`, `status`, `occurred_at`, and a trigram index on `merchant`
  for search — chosen based on the filter/search/sort fields.
