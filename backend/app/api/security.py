from datetime import datetime

from fastapi import APIRouter

router = APIRouter(
    prefix="/api/security",
    tags=["Security"],
)


@router.get("/dashboard")
def security_dashboard():

    return {
        "system_status": "Healthy",
        "active_users": 14,
        "online_agents": 4,
        "blocked_prompts": 7,
        "total_requests": 356,
        "threat_level": "Low",
        "last_scan": datetime.now(),
    }


@router.get("/agents")
def get_agents():

    return [
        {
            "agent": "Jailbreak Detector",
            "status": "Running",
            "requests_processed": 143,
        },
        {
            "agent": "Prompt Injection Detector",
            "status": "Running",
            "requests_processed": 92,
        },
        {
            "agent": "Output Validator",
            "status": "Running",
            "requests_processed": 356,
        },
        {
            "agent": "PII Detector",
            "status": "Running",
            "requests_processed": 85,
        },
    ]


@router.get("/logs")
def security_logs():

    return [
        {
            "timestamp": datetime.now(),
            "severity": "High",
            "event": "Prompt Injection Blocked",
        },
        {
            "timestamp": datetime.now(),
            "severity": "Medium",
            "event": "Jailbreak Attempt",
        },
        {
            "timestamp": datetime.now(),
            "severity": "Low",
            "event": "Normal Chat Request",
        },
    ]