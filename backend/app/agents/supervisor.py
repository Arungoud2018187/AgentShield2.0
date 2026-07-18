from app.agents.jailbreak_agent import JailbreakAgent
from app.agents.prompt_injection_agent import PromptInjectionAgent


class SupervisorAgent:
    """
    Main orchestrator of AgentShield.
    Every prompt passes through this agent first.
    """

    def __init__(self):
        self.jailbreak_agent = JailbreakAgent()
        self.prompt_injection_agent = PromptInjectionAgent()

    def process_prompt(self, prompt: str):
        """
        Run all security checks before
        sending the prompt to the LLM.
        """

        jailbreak_result = self.jailbreak_agent.scan(prompt)

        if not jailbreak_result["safe"]:
            return jailbreak_result

        injection_result = self.prompt_injection_agent.scan(prompt)

        if not injection_result["safe"]:
            return injection_result

        return {
            "safe": True,
            "message": "Prompt passed all security checks.",
            "prompt": prompt,
        }