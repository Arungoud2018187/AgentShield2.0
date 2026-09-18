from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.rbac import require_role
from app.config.settings import settings
from app.database.database import get_db
from app.models.user import User
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
    dependencies=[Depends(require_role("ADMIN", "ANALYST"))],
)


@router.get("/")
def analytics(db: Session = Depends(get_db)):

    # ==========================================
    # REQUEST / USER METRICS
    # ==========================================

    successful_requests = (
        db.query(func.count(PromptLog.id)).scalar()
        or 0
    )

    blocked_requests = (
        db.query(func.count(SecurityEvent.id)).scalar()
        or 0
    )

    total_requests = successful_requests + blocked_requests

    active_users = (
        db.query(func.count(User.id))
        .filter(User.is_active.is_(True))
        .scalar()
        or 0
    )

    # ==========================================
    # DAILY ACTIVITY
    # ==========================================

    successful_daily = (
        db.query(
            func.date(PromptLog.created_at).label("day"),
            func.count(PromptLog.id).label("requests"),
        )
        .group_by(func.date(PromptLog.created_at))
        .order_by(func.date(PromptLog.created_at))
        .all()
    )

    blocked_daily = (
        db.query(
            func.date(SecurityEvent.created_at).label("day"),
            func.count(SecurityEvent.id).label("requests"),
        )
        .group_by(func.date(SecurityEvent.created_at))
        .order_by(func.date(SecurityEvent.created_at))
        .all()
    )

    activity = {}

    for day, count in successful_daily:
        key = str(day)
        activity[key] = activity.get(key, 0) + count

    for day, count in blocked_daily:
        key = str(day)
        activity[key] = activity.get(key, 0) + count

    weekly_activity = [
        {
            "day": day,
            "requests": activity[day],
        }
        for day in sorted(activity)
    ]

    # ==========================================
    # THREAT DISTRIBUTION
    # ==========================================

    threat_distribution = (
        db.query(
            SecurityEvent.event_type,
            func.count(SecurityEvent.id),
        )
        .group_by(SecurityEvent.event_type)
        .order_by(func.count(SecurityEvent.id).desc())
        .all()
    )

    # ==========================================
    # DATABASE STATUS
    # ==========================================

    database_status = "Connected"

    try:
        db.execute(func.now().select())
    except Exception:
        database_status = "Unavailable"

    # ==========================================
    # AI ENGINE
    # ==========================================

    return {
        "cards": {
            "total_requests": total_requests,
            "successful_requests": successful_requests,
            "blocked_threats": blocked_requests,
            "active_users": active_users,
            "ai_provider": "OpenRouter",
            "ai_status": "Connected",
        },

        "weekly_activity": weekly_activity,

        "threat_distribution": [
            {
                "title": title,
                "count": count,
            }
            for title, count in threat_distribution
        ],

        "database": {
            "status": database_status,
        },

        "ai_engine": {
            "provider": "OpenRouter",
            "model": settings.OPENROUTER_MODEL,
            "status": "Running",
        },
    }
