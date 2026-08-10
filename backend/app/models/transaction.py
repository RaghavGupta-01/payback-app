from sqlalchemy import Column, String, Numeric, TIMESTAMP, Integer, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    external_id = Column(String, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    occurred_at = Column(TIMESTAMP(timezone=True), nullable=False)
    merchant = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String, nullable=False, default="INR")
    status = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    coins_earned = Column(Integer, nullable=False, default=0)