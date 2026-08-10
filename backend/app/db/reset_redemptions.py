import asyncio
from app.core.config import settings
import asyncpg

async def main():
    dsn = settings.database_url.replace("postgresql+asyncpg://", "postgresql://")
    conn = await asyncpg.connect(dsn)
    await conn.execute("TRUNCATE redemptions")
    await conn.execute("""
        UPDATE users SET coin_balance = (
            SELECT COALESCE(SUM(coins_earned), 0) FROM transactions
        )
    """)
    print("Redemptions cleared, balance recalculated.")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(main())