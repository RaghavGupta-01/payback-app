import uuid
from sqlalchemy import Column, String, Integer, Boolean, text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    coin_cost = Column(Integer, nullable=False)
    active = Column(Boolean, nullable=False, default=True)