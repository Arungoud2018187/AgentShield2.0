import logging

from app.agents.jailbreak_agent import JailbreakAgent
from app.agents.prompt_injection_agent import PromptInjectionAgent
from app.agents.output_validation_agent import OutputValidationAgent
from app.services.ollama_service import OllamaService

logger = logging.getLogger(__name__)


class SupervisorAgent:
    """
    AgentShield AI Supervisor

    Pipeline:

        User Prompt
             │
             ▼
      Jailbreak Agent
             │
             ▼
    Prompt Injection Agent
             │
             ▼
        Ollama (Qwen3)
             │
             ▼
     Output Validation Agent
             │
             ▼
        Safe AI Response
    """

    def __init__(self):
        self.jailbreak = JailbreakAgent()
        self.prompt_injection = PromptInjectionAgent()
        self.output_validation = OutputValidationAgent()
        self.ollama = OllamaService()

    def process(self, prompt: str):
        """
        Executes the complete AI security pipeline.
        """

        logger.info("=" * 70)
        logger.info("AgentShield Pipeline Started")

        try:

            # ============================================
            # Stage 1 - Jailbreak Detection
            # ============================================

            logger.info("Running Jailbreak Agent...")

            jailbreak = self.jailbreak.scan(prompt)

            if not jailbreak["safe"]:
                logger.warning(
                    "Request blocked by Jailbreak Agent."
                )

                return {
                    "success": False,
                    "message": (
                        "Your request violates the organization's "
                        "AI security policy."
                    ),
                    "reason": jailbreak["reason"],
                }

            logger.info("Jailbreak Agent Passed")

            # ============================================
            # Stage 2 - Prompt Injection Detection
            # ============================================

            logger.info("Running Prompt Injection Agent...")

            injection = self.prompt_injection.scan(prompt)

            if not injection["safe"]:
                logger.warning(
                    "Request blocked by Prompt Injection Agent."
                )

                return {
                    "success": False,
                    "message": (
                        "Your request violates the organization's "
                        "AI security policy."
                    ),
                    "reason": injection["reason"],
                }

            logger.info("Prompt Injection Agent Passed")

            # ============================================
            # Stage 3 - AI Generation
            # ============================================

            logger.info("Generating AI response...")

            response = self.ollama.generate(prompt)

            logger.info("AI response generated.")

            # ============================================
            # Stage 4 - Output Validation
            # ============================================

            logger.info("Running Output Validation Agent...")

            output = self.output_validation.scan(response)

            if not output["safe"]:
                logger.warning(
                    "Unsafe AI response blocked."
                )

                return {
                    "success": False,
                    "message": (
                        "The AI response could not be verified."
                    ),
                    "reason": output["reason"],
                }

            logger.info("Output Validation Passed")

            logger.info("Pipeline Completed Successfully")
            logger.info("=" * 70)

            return {
                "success": True,
                "response": output["response"],
            }

        except Exception:

            logger.exception(
                "Unexpected error while processing request."
            )

            return {
                "success": False,
                "message": (
                    "AgentShield AI is temporarily unavailable. "
                    "Please try again later."
                ),
            }