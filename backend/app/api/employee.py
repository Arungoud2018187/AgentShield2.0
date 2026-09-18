from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.incident import Incident
from app.models.notification import Notification

router = APIRouter(
    prefix="/api/employee",
    tags=["Employee"],
)


@router.get("/dashboard")
def employee_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ai_requests = (
        db.query(func.count(PromptLog.id))
        .filter(PromptLog.user_id == current_user.id)
        .scalar()
        or 0
    )

    security_alerts = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.user_id == current_user.id)
        .scalar()
        or 0
    )

    incidents_count = (
        db.query(func.count(Incident.id))
        .filter(Incident.user_id == current_user.id)
        .scalar()
        or 0
    )

    unread_notifications = (
        db.query(func.count(Notification.id))
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
        .scalar()
        or 0
    )

    total_notifications = (
        db.query(func.count(Notification.id))
        .filter(Notification.user_id == current_user.id)
        .scalar()
        or 0
    )

    recent_prompts = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == current_user.id)
        .order_by(PromptLog.created_at.desc())
        .limit(5)
        .all()
    )

    recent_events = (
        db.query(SecurityEvent)
        .filter(SecurityEvent.user_id == current_user.id)
        .order_by(SecurityEvent.created_at.desc())
        .limit(3)
        .all()
    )

    return {
        "user": {
            "id": current_user.id,
            "employee_id": current_user.employee_id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role.role_name if current_user.role else "EMPLOYEE",
            "department": current_user.department.department_name if current_user.department else "General",
        },
        "stats": {
            "ai_requests": ai_requests,
            "security_alerts": security_alerts,
            "incidents": incidents_count,
            "unread_notifications": unread_notifications,
            "total_notifications": total_notifications,
        },
        "recent_prompts": [
            {
                "id": p.id,
                "prompt": p.prompt[:60] + ("..." if len(p.prompt) > 60 else ""),
                "created_at": p.created_at,
                "status": "Verified",
            }
            for p in recent_prompts
        ],
        "recent_events": [
            {
                "id": e.id,
                "event_type": e.event_type,
                "severity": e.severity,
                "description": e.description,
                "created_at": e.created_at,
            }
            for e in recent_events
        ],
        "system_status": {
            "ai_provider": "OpenRouter",
            "ai_guardrails": "Active (Jailbreak, Prompt Injection, Output Validation)",
            "status": "Healthy",
        },
    }
