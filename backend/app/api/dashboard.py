from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database.database import get_db
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.audit_log import AuditLog

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    # ==========================
    # KPI CARDS
    # ==========================

    total_users = db.query(func.count(User.id)).scalar() or 0

    active_users = (
        db.query(func.count(User.id))
        .filter(User.is_active == True)
        .scalar()
        or 0
    )

    inactive_users = (
        db.query(func.count(User.id))
        .filter(User.is_active == False)
        .scalar()
        or 0
    )

    total_roles = db.query(func.count(Role.id)).scalar() or 0

    total_departments = (
        db.query(func.count(Department.id)).scalar() or 0
    )

    total_prompts = (
        db.query(func.count(PromptLog.id)).scalar() or 0
    )

    total_security_events = (
        db.query(func.count(SecurityEvent.id)).scalar() or 0
    )

    total_audit_logs = (
        db.query(func.count(AuditLog.id)).scalar() or 0
    )

    # ==========================
    # RECENT USERS
    # ==========================

    recent_users = (
        db.query(User)
        .options(
            joinedload(User.role),
            joinedload(User.department),
        )
        .order_by(User.created_at.desc())
        .limit(5)
        .all()
    )

    # ==========================
    # USER GROWTH
    # ==========================

    user_growth = (
        db.query(
            func.date(User.created_at),
            func.count(User.id),
        )
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
        .all()
    )

    # ==========================
    # DEPARTMENT DISTRIBUTION
    # ==========================

    department_distribution = (
        db.query(
            Department.department_name,
            func.count(User.id),
        )
        .outerjoin(User)
        .group_by(Department.department_name)
        .all()
    )

    # ==========================
    # SECURITY DISTRIBUTION
    # ==========================

    security_distribution = (
        db.query(
            SecurityEvent.severity,
            func.count(SecurityEvent.id),
        )
        .group_by(SecurityEvent.severity)
        .all()
    )

    return {
        "cards": {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": inactive_users,
            "total_roles": total_roles,
            "total_departments": total_departments,
            "total_prompts": total_prompts,
            "total_security_events": total_security_events,
            "total_audit_logs": total_audit_logs,
            "system_status": "Healthy",
            "ai_agents": 4,
            "threat_level": "Low",
        },

        "recent_users": [
            {
                "id": user.id,
                "employee_id": user.employee_id,
                "full_name": user.full_name,
                "email": user.email,
                "role_id": user.role_id,
                "role_name": user.role.role_name if user.role else "N/A",
                "department_id": user.department_id,
                "department_name": (
                    user.department.department_name
                    if user.department
                    else "N/A"
                ),
                "is_active": user.is_active,
                "created_at": user.created_at,
            }
            for user in recent_users
        ],

        "user_growth": [
            {
                "date": str(date),
                "users": total,
            }
            for date, total in user_growth
        ],

        "department_distribution": [
            {
                "department": department,
                "users": total,
            }
            for department, total in department_distribution
        ],

        "security_distribution": [
            {
                "severity": severity,
                "count": total,
            }
            for severity, total in security_distribution
        ],
    }