from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.auth.rbac import require_role
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
    dependencies=[Depends(require_role("ADMIN"))],
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

    high_threats = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.severity.in_(["HIGH", "CRITICAL"]))
        .scalar()
        or 0
    )
    threat_level = "High" if high_threats >= 5 else ("Medium" if high_threats > 0 else "Low")

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

    # ==========================
    # SECURITY BREAKDOWN
    # ==========================

    from sqlalchemy import or_

    prompt_injections = (
        db.query(func.count(SecurityEvent.id))
        .filter(or_(SecurityEvent.event_type.ilike("%PromptInjection%"), SecurityEvent.description.ilike("%injection%")))
        .scalar()
        or 0
    )

    jailbreaks = (
        db.query(func.count(SecurityEvent.id))
        .filter(or_(SecurityEvent.event_type.ilike("%Jailbreak%"), SecurityEvent.description.ilike("%jailbreak%")))
        .scalar()
        or 0
    )

    output_violations = (
        db.query(func.count(SecurityEvent.id))
        .filter(or_(SecurityEvent.event_type.ilike("%Output%"), SecurityEvent.description.ilike("%output%")))
        .scalar()
        or 0
    )

    other_threats = (
        db.query(func.count(SecurityEvent.id))
        .filter(
            ~SecurityEvent.event_type.ilike("%PromptInjection%"),
            ~SecurityEvent.event_type.ilike("%Jailbreak%"),
            ~SecurityEvent.event_type.ilike("%Output%"),
        )
        .scalar()
        or 0
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
            "ai_agents": 3,
            "threat_level": threat_level,
        },

        "security_panel": [
            {
                "id": 1,
                "title": "Prompt Injection",
                "count": prompt_injections,
                "status": "Detected" if prompt_injections > 0 else "Protected",
                "severity": "High" if prompt_injections > 0 else "Low",
                "color": "text-red-400" if prompt_injections > 0 else "text-emerald-400",
                "bg": "bg-red-500/10" if prompt_injections > 0 else "bg-emerald-500/10",
                "border": "border-red-500/20" if prompt_injections > 0 else "border-emerald-500/20",
            },
            {
                "id": 2,
                "title": "Jailbreak Attempts",
                "count": jailbreaks,
                "status": "Blocked" if jailbreaks > 0 else "Protected",
                "severity": "Medium" if jailbreaks > 0 else "Low",
                "color": "text-orange-400" if jailbreaks > 0 else "text-emerald-400",
                "bg": "bg-orange-500/10" if jailbreaks > 0 else "bg-emerald-500/10",
                "border": "border-orange-500/20" if jailbreaks > 0 else "border-emerald-500/20",
            },
            {
                "id": 3,
                "title": "Output Violations",
                "count": output_violations,
                "status": "Filtered" if output_violations > 0 else "Secure",
                "severity": "Medium" if output_violations > 0 else "Low",
                "color": "text-yellow-400" if output_violations > 0 else "text-emerald-400",
                "bg": "bg-yellow-500/10" if output_violations > 0 else "bg-emerald-500/10",
                "border": "border-yellow-500/20" if output_violations > 0 else "border-emerald-500/20",
            },
            {
                "id": 4,
                "title": "Policy Violations",
                "count": other_threats,
                "status": "Monitored",
                "severity": "Low",
                "color": "text-cyan-400",
                "bg": "bg-cyan-500/10",
                "border": "border-cyan-500/20",
            },
        ],

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


@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    return [
        {
            "id": r.id,
            "role_name": r.role_name,
            "user_count": db.query(func.count(User.id)).filter(User.role_id == r.id).scalar() or 0,
        }
        for r in roles
    ]


@router.get("/departments")
def get_departments(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    return [
        {
            "id": d.id,
            "department_name": d.department_name,
            "user_count": db.query(func.count(User.id)).filter(User.department_id == d.id).scalar() or 0,
        }
        for d in depts
    ]


@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .order_by(AuditLog.created_at.desc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": l.id,
            "user_id": l.user_id,
            "user_name": l.user.full_name if l.user else "System",
            "user_email": l.user.email if l.user else "system@agentshield.local",
            "action": l.action,
            "details": l.details,
            "created_at": l.created_at,
        }
        for l in logs
    ]