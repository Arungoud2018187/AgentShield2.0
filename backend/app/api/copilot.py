from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.rbac import require_role
from app.database.database import get_db
from app.models.incident import Incident
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.user import User
from app.services.openai_service import OpenAIService

router = APIRouter(
    prefix="/api/copilot",
    tags=["Security Copilot"],
    dependencies=[Depends(require_role("ANALYST", "ADMIN"))],
)

ai_service = OpenAIService()


class CopilotRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Analyst investigation query")
    event_id: int | None = Field(None, description="Optional target security event ID to investigate")
    incident_id: int | None = Field(None, description="Optional target incident ID to investigate")
    incident_data: str | None = Field(None, description="Optional raw or JSON contents of an uploaded incident file")


class CopilotResponse(BaseModel):
    success: bool
    response: str
    telemetry_context: dict
    role: str = "SOC Copilot"


@router.post("/chat", response_model=CopilotResponse)
def copilot_chat(
    payload: CopilotRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ANALYST", "ADMIN")),
):
    query = payload.prompt.strip()
    if not query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Investigation query cannot be empty.",
        )

    # -------------------------------------------------------------
    # Gather real security telemetry context from PostgreSQL
    # -------------------------------------------------------------
    recent_events = (
        db.query(SecurityEvent)
        .order_by(SecurityEvent.created_at.desc())
        .limit(10)
        .all()
    )

    total_events = db.query(func.count(SecurityEvent.id)).scalar() or 0
    total_prompts = db.query(func.count(PromptLog.id)).scalar() or 0
    open_incidents = (
        db.query(Incident)
        .order_by(Incident.created_at.desc())
        .limit(5)
        .all()
    )

    specific_event = None
    if payload.event_id:
        specific_event = db.query(SecurityEvent).filter(SecurityEvent.id == payload.event_id).first()

    specific_incident = None
    if payload.incident_id:
        specific_incident = db.query(Incident).filter(Incident.id == payload.incident_id).first()

    # Format telemetry into prompt context
    event_summaries = [
        f"- [ID:{e.id} | {e.severity} | {e.created_at}] {e.event_type}: {e.description} (User ID: {e.user_id})"
        for e in recent_events
    ]
    incident_summaries = [
        f"- [Inc #{inc.id} | {inc.severity} | {inc.status}] {inc.title}: {inc.description}"
        for inc in open_incidents
    ]

    telemetry_context_str = (
        f"Platform Statistics:\n"
        f"- Total Security Events Blocked: {total_events}\n"
        f"- Total AI Requests Processed: {total_prompts}\n\n"
        f"Recent Security Events:\n" + ("\n".join(event_summaries) if event_summaries else "No events recorded.") + "\n\n"
        f"Recent Incidents:\n" + ("\n".join(incident_summaries) if incident_summaries else "No incidents reported.")
    )

    if specific_event:
        telemetry_context_str += (
            f"\n\nTARGET INVESTIGATION EVENT:\n"
            f"ID: {specific_event.id}, Type: {specific_event.event_type}, Severity: {specific_event.severity}, "
            f"Details: {specific_event.description}, User ID: {specific_event.user_id}, Date: {specific_event.created_at}"
        )

    if specific_incident:
        user = specific_incident.user
        dept = user.department.department_name if (user and user.department) else "Operations"
        rep_details = (
            f"Reported by: {user.full_name} (Employee ID: {user.employee_id}, Email: {user.email}, Department: {dept})"
            if user
            else f"User ID: {specific_incident.user_id}"
        )
        telemetry_context_str += (
            f"\n\nTARGET INVESTIGATION INCIDENT:\n"
            f"Incident Code: INC-{specific_incident.id:04d}\n"
            f"Title: {specific_incident.title}\n"
            f"Severity: {specific_incident.severity}\n"
            f"Status: {specific_incident.status}\n"
            f"{rep_details}\n"
            f"Date Reported: {specific_incident.created_at}\n"
            f"Employee Observation / Incident Details:\n{specific_incident.description}"
        )

    if payload.incident_data:
        telemetry_context_str += (
            f"\n\nATTACHED/UPLOADED INCIDENT FILE CONTENT:\n"
            f"----------------------------------------\n"
            f"{payload.incident_data.strip()}\n"
            f"----------------------------------------"
        )

    # -------------------------------------------------------------
    # Prompt the AI model as SOC Security Copilot
    # -------------------------------------------------------------
    full_prompt = (
        f"System: You are AgentShield Security Copilot, an elite cyber threat analyst and AI defense specialist in the Security Operations Center (SOC). "
        f"You assist SOC analysts in investigating security violations, employee-reported incidents, analyzing attack vectors "
        f"(such as prompt injection, jailbreak bypasses, hallucination risks, and data exfiltration attempts), and recommending containment steps. "
        f"When investigating an incident or uploaded incident file, provide:\n"
        f"1. Executive Threat Summary & Attack Classification (e.g. MITRE ATLAS / OWASP Top 10 for LLM).\n"
        f"2. Risk Assessment (Impact on enterprise data, blast radius).\n"
        f"3. Concrete Tactical Containment & Remediation Actions (numbered step-by-step for the SOC analyst).\n"
        f"Answer concisely, professionally, and authoritatively with tactical cybersecurity recommendations.\n\n"
        f"Current Real-Time SOC Telemetry Context:\n{telemetry_context_str}\n\n"
        f"Analyst Investigation Request: {query}\n\n"
        f"Analysis & Action Plan:"
    )

    try:
        copilot_reply = ai_service.generate(full_prompt)
    except Exception as e:
        copilot_reply = (
            f"Security Copilot investigation encountered an AI connection issue: {str(e)}. "
            f"Local telemetry review indicates {total_events} security events and {len(open_incidents)} recent incidents active."
        )

    return CopilotResponse(
        success=True,
        response=copilot_reply,
        telemetry_context={
            "total_events": total_events,
            "total_prompts": total_prompts,
            "recent_events_count": len(recent_events),
            "open_incidents_count": len(open_incidents),
            "target_event_id": payload.event_id,
            "target_incident_id": payload.incident_id,
            "incident_file_analyzed": bool(payload.incident_data),
        },
    )


@router.get("/quick-prompts")
def get_quick_prompts():
    """
    Returns suggested SOC investigation prompts.
    """
    return [
        {
            "id": "summarize_activity",
            "title": "Summarize Today's Security Activity",
            "prompt": "Summarize today's security activity, blocked threat counts, and identify any anomalous trends.",
        },
        {
            "id": "explain_blocked",
            "title": "Explain Why Prompts Were Blocked",
            "prompt": "Explain why recent prompts were blocked by our Jailbreak and Prompt Injection agents.",
        },
        {
            "id": "threat_trends",
            "title": "Analyze Threat Vectors",
            "prompt": "What threat vectors or attack patterns are currently most frequent across our prompt logs?",
        },
        {
            "id": "incident_triage",
            "title": "Investigate High-Severity Incidents",
            "prompt": "Investigate current open incidents and provide recommended SOC containment steps.",
        },
        {
            "id": "policy_recommendations",
            "title": "Recommend Security Hardening",
            "prompt": "Based on our recent security events, what policy rules or agent updates should we implement next?",
        },
    ]
