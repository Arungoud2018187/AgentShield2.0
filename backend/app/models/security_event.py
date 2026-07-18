from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    event_type = Column(String(100), nullable=False)

    severity = Column(String(50), nullable=False)

    description = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship(
    "User",
    back_populates="security_events",
)