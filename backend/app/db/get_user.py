from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

async def get_user(db: AsyncSession) -> User:
    result = await db.execute(select(User).limit(1))
    user = result.scalar_one_or_none()
    if not user:
        raise RuntimeError("No users found")
    return user