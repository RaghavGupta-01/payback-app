from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionOut
from typing import Optional
from datetime import datetime
from uuid import UUID

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("", response_model=list[TransactionOut])
async def list_transactions(
    q: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    amount_min: Optional[float] = None,
    amount_max: Optional[float] = None,
    limit: int = 10000,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Transaction)
    if q:
        stmt = stmt.where(Transaction.merchant.ilike(f"%{q}%"))
    if category:
        stmt = stmt.where(Transaction.category == category)
    if status:
        stmt = stmt.where(Transaction.status == status)
    if date_from:
        stmt = stmt.where(Transaction.occurred_at >= date_from)
    if date_to:
        stmt = stmt.where(Transaction.occurred_at <= date_to)
    if amount_min is not None:
        stmt = stmt.where(Transaction.amount >= amount_min)
    if amount_max is not None:
        stmt = stmt.where(Transaction.amount <= amount_max)

    stmt = stmt.order_by(Transaction.occurred_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{transaction_id}", response_model=TransactionOut)
async def get_transaction(transaction_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transaction).where(Transaction.id == transaction_id))
    txn = result.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn