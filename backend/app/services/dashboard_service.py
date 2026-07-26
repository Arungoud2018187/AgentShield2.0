from collections import defaultdict

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.audit_log import AuditLog


def get_dashboard_cards(db: Session):
    return {
        "total_users": db.query(func.count(User.id)).scalar() or 0,

        "active_users": (
            db.query(func.count(User.id))
            .filter(User.is_active == True)
            .scalar()
            or 0
        ),

        "inactive_users": (
            db.query(func.count(User.id))
            .filter(User.is_active == False)
            .scalar()
            or 0
        ),

        "roles": db.query(func.count(Role.id)).scalar() or 0,

        "departments": (
            db.query(func.count(Department.id)).scalar()
            or 0
        ),

        "ai_prompts": (
            db.query(func.count(PromptLog.id)).scalar()
            or 0
        ),

        "security_events": (
            db.query(func.count(SecurityEvent.id)).scalar()
            or 0
        ),

        "audit_logs": (
            db.query(func.count(AuditLog.id)).scalar()
            or 0
        ),

        "system_status": "Healthy",
    }


def get_recent_users(db: Session, limit: int = 5):

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": u.id,
            "employee_id": u.employee_id,
            "full_name": u.full_name,
            "email": u.email,
            "is_active": u.is_active,
            "created_at": u.created_at,
        }
        for u in users
    ]


def get_recent_prompts(db: Session, limit: int = 5):

    prompts = (
        db.query(PromptLog)
        .order_by(PromptLog.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "prompt": p.prompt[:100],
            "created_at": p.created_at,
        }
        for p in prompts
    ]


def get_recent_security_events(db: Session, limit: int = 5):

    events = (
        db.query(SecurityEvent)
        .order_by(SecurityEvent.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": e.id,
            "event_type": e.event_type,
            "severity": e.severity,
            "description": e.description,
            "created_at": e.created_at,
        }
        for e in events
    ]


def get_recent_audit_logs(db: Session, limit: int = 5):

    logs = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": a.id,
            "action": a.action,
            "details": a.details,
            "created_at": a.created_at,
        }
        for a in logs
    ]