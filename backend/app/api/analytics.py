from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get("/")
def analytics(db: Session = Depends(get_db)):

    total_requests = (
        db.query(func.count(PromptLog.id)).scalar() or 0
    )

    active_users = (
        db.query(func.count(User.id))
        .filter(User.is_active == True)
        .scalar()
        or 0
    )

    blocked_threats = (
        db.query(func.count(SecurityEvent.id)).scalar() or 0
    )

    weekly_activity = (
        db.query(
            func.date(PromptLog.created_at),
            func.count(PromptLog.id),
        )
        .group_by(func.date(PromptLog.created_at))
        .order_by(func.date(PromptLog.created_at))
        .all()
    )

    threat_distribution = (
        db.query(
            SecurityEvent.event_type,
            func.count(SecurityEvent.id),
        )
        .group_by(SecurityEvent.event_type)
        .all()
    )

    return {
        "cards": {
            "total_requests": total_requests,
            "active_users": active_users,
            "blocked_threats": blocked_threats,
            "ollama_status": "Online",
        },

        "weekly_activity": [
            {
                "day": str(day),
                "requests": count,
            }
            for day, count in weekly_activity
        ],

        "threat_distribution": [
            {
                "title": title,
                "count": count,
            }
            for title, count in threat_distribution
        ],

        "database": {
            "status": "Connected",
            "response_time": "18 ms",
        },

        "ai_engine": {
            "model": "Qwen3",
            "status": "Running",
            "avg_response": "1.2 sec",
        },
    }