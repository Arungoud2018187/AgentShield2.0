from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.agents.supervisor import SupervisorAgent
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.logging_service import LoggingService

router = APIRouter(
    prefix="/api/chat",
    tags=["AI Chat"],
)

# Initialize Supervisor
supervisor = SupervisorAgent()


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    success: bool
    response: str
    status: str
    security: str


@router.post(
    "/",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    prompt = request.prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty.",
        )

    result = supervisor.process(prompt)

    # ------------------------------------------
    # Successful request
    # ------------------------------------------
    if result["success"]:
        LoggingService.log_prompt(
            user_id=current_user.id,
            prompt=prompt,
            response=result["response"],
        )

        return ChatResponse(
            success=True,
            response=result["response"],
            status="verified",
            security="🛡 AgentShield Verified",
        )

    # ------------------------------------------
    # Blocked / rejected request
    # ------------------------------------------
    LoggingService.log_security_event(
        user_id=current_user.id,
        event_type=result.get(
            "agent",
            "AI_SECURITY_POLICY_VIOLATION",
        ),
        severity="HIGH",
        description=result.get(
            "reason",
            result.get(
                "message",
                "Request blocked by AgentShield security controls.",
            ),
        ),
    )

    return ChatResponse(
        success=False,
        response=result.get(
            "message",
            "Your request violates the organization's AI security policy.",
        ),
        status="blocked",
        security="🚫 Security Policy Violation",
    )


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "provider": "OpenRouter",
        "model": supervisor.openai.model,
        "security_engine": "enabled",
    }
