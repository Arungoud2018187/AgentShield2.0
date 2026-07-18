from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.supervisor import SupervisorAgent

router = APIRouter(
    prefix="/api/security",
    tags=["Security"],
)

supervisor = SupervisorAgent()


class PromptRequest(BaseModel):
    prompt: str


@router.post("/check")
def check_prompt(request: PromptRequest):
    """
    Run the complete security pipeline.
    """
    return supervisor.process_prompt(request.prompt)