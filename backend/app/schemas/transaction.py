from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class TransactionOut(BaseModel):
    id: UUID
    external_id: str
    occurred_at: datetime
    merchant: str
    category: str
    amount: float
    currency: str
    status: str
    payment_method: str
    coins_earned: int

    class Config:
        from_attributes = True