from pydantic import BaseModel
from uuid import UUID

class RewardOut(BaseModel):
    id: UUID
    name: str
    description: str
    coin_cost: int
    active: bool

    class Config:
        from_attributes = True


class BalanceOut(BaseModel):
    coin_balance: int


class RedeemRequest(BaseModel):
    reward_id: UUID


class RedeemResponse(BaseModel):
    coin_balance: int
    redemption_id: UUID