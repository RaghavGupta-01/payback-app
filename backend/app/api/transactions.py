from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionOut

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("", response_model=list[TransactionOut])
async def list_transactions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transaction).order_by(Transaction.occurred_at.desc()))
    return result.scalars().all()