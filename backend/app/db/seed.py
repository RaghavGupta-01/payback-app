import asyncio
import json
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

import asyncpg
from app.core.config import settings

COIN_CAP_PER_TXN = 50
TXN_JSON_PATH = Path(__file__).resolve().parent.parent / "data" / "transactions.json"
REWARDS = [
    ("₹50 Amazon Voucher", "Redeemable on amazon.in", 500),
    ("₹100 Amazon Voucher", "Redeemable on amazon.in", 1000),
    ("₹100 Cashback", "Credited to your linked bank account", 1000),
    ("Movie Ticket Voucher", "Valid at PVR/INOX", 750),
    ("₹250 Cashback", "Credited to your linked bank account", 2500),
]


def normalize_timestamp(ts) -> datetime:
    value = str(ts).strip()

    # Unix timestamp in milliseconds
    if value.isdigit():
        return datetime.fromtimestamp(
            int(value) / 1000,
            tz=timezone.utc,
        )

    # ISO 8601
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))

        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)

        return dt.astimezone(timezone.utc)

    except ValueError:
        pass

    # DD/MM/YYYY HH:MM:SS
    try:
        dt = datetime.strptime(value, "%d/%m/%Y %H:%M:%S")
        return dt.replace(tzinfo=timezone.utc)

    except ValueError:
        raise ValueError(f"Unsupported timestamp format: {value}")


def parse_amount(raw) -> float:
    clean = str(raw).replace("-", "").strip()
    return float(clean)


def compute_coins(amount: float, status: str) -> int:
    if status != "SUCCESS":
        return 0
    return min(int(amount // 100), COIN_CAP_PER_TXN)


async def main():
    dsn = settings.database_url.replace("postgresql+asyncpg://", "postgresql://")
    conn = await asyncpg.connect(dsn)

    schema_sql = (Path(__file__).parent / "schema.sql").read_text()
    await conn.execute(schema_sql)

    user_id = await conn.fetchval(
        "INSERT INTO users (name) VALUES ($1) RETURNING id", "Demo User"
    )

    data = json.loads(TXN_JSON_PATH.read_text())

    rows = []
    for t in data:
        occurred_at = normalize_timestamp(t["timestamp"])
        amount = parse_amount(t["amount"])
        status = str(t["status"]).strip().upper()
        coins = compute_coins(amount, status)
        category = (t.get("category") or "").strip() or "Uncategorized"
        rows.append((
            t["id"], user_id, occurred_at, t["merchant"], category,
            amount, t.get("currency", "INR"), status,
            t["payment_method"], coins,
        ))

    await conn.executemany(
        """
        INSERT INTO transactions
            (external_id, user_id, occurred_at, merchant, category,
             amount, currency, status, payment_method, coins_earned)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (external_id) DO NOTHING
        """,
        rows,
    )

    total_coins = sum(r[-1] for r in rows)
    await conn.execute(
        "UPDATE users SET coin_balance = $1 WHERE id = $2", total_coins, user_id
    )

    for name, desc, cost in REWARDS:
        await conn.execute(
            "INSERT INTO rewards (name, description, coin_cost) VALUES ($1,$2,$3)",
            name, desc, cost,
        )

    print(f"Seeded {len(rows)} transactions. User {user_id} balance: {total_coins}")
    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())