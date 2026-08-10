# Assumptions

- Single demo user: all transactions are attributed to one seeded user; no auth or
  multi-user support in this build.
- Transactions with a missing or empty `category` were normalized to `Uncategorized`
  rather than dropped, so they remain visible and filterable in the dashboard.
- Coins are earned only on `SUCCESS` transactions — `FAILED`/`PENDING` earn zero.
- Coin earning rate is 1 coin per ₹100 spent, capped at 50 coins per transaction
  (`COIN_CAP_PER_TXN`). The cap value itself is an assumption.
- Reward catalogue (vouchers, cashback, movie ticket) and their coin costs are invented
  for this build — the brief left the specific rewards undefined.
- Currency is assumed INR throughout even where the `currency` field is missing;
  defaulted to `"INR"` at seed time.
- `transaction_status` values are normalized to uppercase (`SUCCESS`, `FAILED`, `PENDING`)
  to guard against inconsistent casing in the source data.