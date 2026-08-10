from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db.get_user import get_user
from app.schemas.reward import BalanceOut

router = APIRouter(prefix="/api/rewards", tags=["rewards"])

@router.get("/balance", response_model=BalanceOut)
async def get_balance(db: AsyncSession = Depends(get_db)):
    user = await get_user(db)
    return BalanceOut(coin_balance=user.coin_balance)