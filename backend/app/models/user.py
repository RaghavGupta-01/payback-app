import uuid
from sqlalchemy import Column, String, Integer, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    coin_balance = Column(Integer, nullable=False, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))