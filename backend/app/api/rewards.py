from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.get_user import get_user
from app.schemas.reward import BalanceOut, RewardOut, RedeemRequest, RedeemResponse
from app.models.redemption import Redemption
from app.models.reward import Reward
from app.models.user import User

router = APIRouter(prefix="/api/rewards", tags=["rewards"])

@router.get("/balance", response_model=BalanceOut)
async def get_balance(db: AsyncSession = Depends(get_db)):
    user = await get_user(db)
    return BalanceOut(coin_balance=user.coin_balance)

@router.get("/catalog", response_model=list[RewardOut])
async def get_catalog(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reward).where(Reward.active == True))
    return result.scalars().all()

@router.post("/redeem", response_model=RedeemResponse)
async def redeem_reward(payload: RedeemRequest, db: AsyncSession = Depends(get_db)):
    # Lock the user row for the duration of this transaction
    user_result = await db.execute(
        select(User).with_for_update().limit(1)
    )
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=500, detail="No user found")

    reward_result = await db.execute(
        select(Reward).where(Reward.id == payload.reward_id, Reward.active == True)
    )
    reward = reward_result.scalar_one_or_none()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    if user.coin_balance < reward.coin_cost:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")

    user.coin_balance -= reward.coin_cost

    redemption = Redemption(
        user_id=user.id,
        reward_id=reward.id,
        coin_cost=reward.coin_cost,
    )
    db.add(redemption)

    await db.commit()
    await db.refresh(user)
    await db.refresh(redemption)

    return RedeemResponse(coin_balance=user.coin_balance, redemption_id=redemption.id)