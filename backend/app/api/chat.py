from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.agents.supervisor import SupervisorAgent

router = APIRouter(
    prefix="/api/chat",
    tags=["AI Chat"],
)

# Initialize Supervisor
supervisor = SupervisorAgent()


# ==========================================
# Request Model
# ==========================================

class ChatRequest(BaseModel):
    prompt: str


# ==========================================
# Response Model
# ==========================================

class ChatResponse(BaseModel):
    success: bool
    response: str
    status: str
    security: str


# ==========================================
# Chat Endpoint
# ==========================================

@router.post(
    "/",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):

    prompt = request.prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty.",
        )

    result = supervisor.process(prompt)

    # -----------------------------
    # Success
    # -----------------------------
    if result["success"]:
        return ChatResponse(
            success=True,
            response=result["response"],
            status="verified",
            security="🛡️ AgentShield Verified",
        )

    # -----------------------------
    # Blocked
    # -----------------------------
    return ChatResponse(
        success=False,
        response=result.get(
            "message",
            "Your request violates the organization's AI security policy.",
        ),
        status="blocked",
        security="🚫 Security Policy Violation",
    )


# ==========================================
# Health Check
# ==========================================

@router.get("/health")
def health():

    return {
        "status": "healthy",
        "model": supervisor.ollama.model,
        "security_engine": "enabled",
    }