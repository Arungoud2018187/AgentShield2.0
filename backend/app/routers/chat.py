from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.supervisor import SupervisorAgent
from app.services.logging_service import LoggingService

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    prompt: str


supervisor = SupervisorAgent()


@router.post("/")
def chat(request: ChatRequest):

    result = supervisor.process(request.prompt)

    if not result["success"]:
        return result

    LoggingService.log_prompt(
        user_id=1,
        prompt=request.prompt,
        response=result["response"]
    )

    return result