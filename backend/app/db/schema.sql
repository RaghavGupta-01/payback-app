CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    coin_balance  INTEGER NOT NULL DEFAULT 0 CHECK (coin_balance >= 0),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     TEXT NOT NULL UNIQUE,
    user_id         UUID NOT NULL REFERENCES users(id),
    occurred_at     TIMESTAMPTZ NOT NULL,
    merchant        TEXT NOT NULL,
    category        TEXT NOT NULL,
    amount          NUMERIC(12,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'INR',
    status          TEXT NOT NULL CHECK (status IN ('SUCCESS','FAILED','PENDING')),
    payment_method  TEXT NOT NULL CHECK (payment_method IN ('UPI','Credit Card','Debit Card','Netbanking')),
    coins_earned    INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_txn_user     ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_txn_occurred ON transactions(occurred_at);
CREATE INDEX IF NOT EXISTS idx_txn_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_txn_status   ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_txn_merchant ON transactions USING gin (merchant gin_trgm_ops);

CREATE TABLE IF NOT EXISTS rewards (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    description  TEXT NOT NULL,
    coin_cost    INTEGER NOT NULL CHECK (coin_cost > 0),
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS redemptions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id),
    reward_id    UUID NOT NULL REFERENCES rewards(id),
    coin_cost    INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);