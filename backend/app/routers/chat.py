from fastapi import APIRouter
from pydantic import BaseModel
from app.services.logging_service import LoggingService

from app.agents.supervisor import SupervisorAgent
from app.services.ollama_service import OllamaService

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    prompt: str


@router.post("/")
def chat(request: ChatRequest):

    supervisor = SupervisorAgent()

    security_result = supervisor.process_prompt(request.prompt)

    if not security_result["safe"]:
        return security_result

    ollama = OllamaService()

    response = ollama.generate(request.prompt)
    LoggingService.log_prompt(
    user_id=1,
    prompt=request.prompt,
    response=response
)

    return {
        "safe": True,
        "response": response
    }