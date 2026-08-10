import uuid
from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Redemption(Base):
    __tablename__ = "redemptions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reward_id = Column(UUID(as_uuid=True), ForeignKey("rewards.id"), nullable=False)
    coin_cost = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="COMPLETED")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))