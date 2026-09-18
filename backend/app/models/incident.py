from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Incident(Base):
	__tablename__ = "incidents"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
	title = Column(String(200), nullable=False)
	description = Column(Text, nullable=False)
	severity = Column(String(20), nullable=False, default="Medium")
	status = Column(String(20), nullable=False, default="Open")
	log_file_name = Column(String(255), nullable=True)
	log_file_content = Column(Text, nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now())

	user = relationship("User", lazy="joined")
