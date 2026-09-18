from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.auth.rbac import require_role
from app.database.database import get_db
from app.models.user import User
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent

router = APIRouter(
    prefix="/api/security",
    tags=["Security"],
    dependencies=[Depends(require_role("ADMIN", "ANALYST"))],
)


@router.get("/dashboard")
def security_dashboard(db: Session = Depends(get_db)):

    # ==========================================
    # REAL DATABASE METRICS
    # ==========================================

    active_users = (
        db.query(func.count(User.id))
        .filter(User.is_active.is_(True))
        .scalar()
        or 0
    )

    total_requests = (
        db.query(func.count(PromptLog.id)).scalar()
        or 0
    )

    blocked_prompts = (
        db.query(func.count(SecurityEvent.id)).scalar()
        or 0
    )

    total_users = (
        db.query(func.count(User.id)).scalar()
        or 0
    )

    # ==========================================
    # THREAT LEVEL
    # ==========================================

    high_events = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.severity == "HIGH")
        .scalar()
        or 0
    )

    critical_events = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.severity == "CRITICAL")
        .scalar()
        or 0
    )

    if critical_events > 0:
        threat_level = "Critical"
    elif high_events >= 5:
        threat_level = "High"
    elif high_events > 0:
        threat_level = "Medium"
    elif blocked_prompts > 0:
        threat_level = "Low"
    else:
        threat_level = "Low"

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
        "system_status": "Operational",
        "active_users": active_users,
        "online_agents": 3,
        "blocked_prompts": blocked_prompts,
        "total_requests": total_requests + blocked_prompts,
        "threat_level": threat_level,
        "total_users": total_users,
        "last_scan": datetime.now(timezone.utc),
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
    }


@router.get("/agents")
def get_agents(db: Session = Depends(get_db)):

    total_requests = (
        db.query(func.count(PromptLog.id)).scalar()
        or 0
    )

    total_security_events = (
        db.query(func.count(SecurityEvent.id)).scalar()
        or 0
    )

    jailbreak_events = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.event_type.ilike("%Jailbreak%"))
        .scalar()
        or 0
    )

    injection_events = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.event_type.ilike("%PromptInjection%"))
        .scalar()
        or 0
    )

    output_events = (
        db.query(func.count(SecurityEvent.id))
        .filter(SecurityEvent.event_type.ilike("%OutputValidation%"))
        .scalar()
        or 0
    )

    return [
        {
            "agent": "Jailbreak Detection Agent",
            "type": "Input Filter",
            "status": "Running",
            "requests_processed": total_requests + jailbreak_events,
            "threats_detected": jailbreak_events,
        },
        {
            "agent": "Prompt Injection Agent",
            "type": "Input Filter",
            "status": "Running",
            "requests_processed": total_requests + injection_events,
            "threats_detected": injection_events,
        },
        {
            "agent": "Output Validation Agent",
            "type": "Output Guardrail",
            "status": "Running",
            "requests_processed": total_requests + output_events,
            "threats_detected": output_events,
        },
        {
            "agent": "AgentShield Core Pipeline",
            "type": "Supervisor Orchestrator",
            "status": "Running",
            "requests_processed": total_requests + total_security_events,
            "threats_detected": total_security_events,
        },
    ]


@router.get("/logs")
def security_logs(
    db: Session = Depends(get_db),
):
    events = (
        db.query(SecurityEvent)
        .options(joinedload(SecurityEvent.user))
        .order_by(SecurityEvent.created_at.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": event.id,
            "timestamp": event.created_at,
            "severity": event.severity,
            "event": event.event_type,
            "description": event.description,
            "user_id": event.user_id,
            "user_email": event.user.email if event.user else "Unknown User",
            "user_name": event.user.full_name if event.user else "Unknown User",
            "employee_id": event.user.employee_id if event.user else "N/A",
        }
        for event in events
    ]
