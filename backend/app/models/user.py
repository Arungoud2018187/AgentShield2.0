from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        String(30),
        unique=True,
        nullable=False,
    )

    full_name = Column(
        String(150),
        nullable=False,
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
    )

    password_hash = Column(
        String,
        nullable=False,
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id"),
        nullable=False,
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False,
    )

    prompt_logs = relationship(
        "PromptLog",
        back_populates="user",
    )

    security_events = relationship(
        "SecurityEvent",
        back_populates="user",
    )

    audit_logs = relationship(
        "AuditLog",
        back_populates="user",
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    last_login = Column(
        DateTime,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    role = relationship(
        "Role",
        back_populates="users",
    )

    department = relationship(
        "Department",
        back_populates="users",
    )