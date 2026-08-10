from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import async_session

app = FastAPI(
    title="Project API",
    version="0.1.0",
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/health/db")
async def database_health():
    async with async_session() as session:
        result = await session.execute(text("SELECT 1"))
        return {"database": result.scalar_one()}