from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    action = Column(String(255), nullable=False)

    details = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship(
    "User",
    back_populates="audit_logs",
)