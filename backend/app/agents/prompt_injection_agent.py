class PromptInjectionAgent:
    """
    Detects prompt injection attempts.
    """

    def __init__(self):
        self.suspicious_patterns = [
            "forget previous",
            "ignore previous",
            "reveal your prompt",
            "show system prompt",
            "internal instructions",
            "hidden instructions",
            "developer instructions",
            "override",
            "new instructions",
            "system message",
        ]

    def scan(self, prompt: str):
        """
        Scan for prompt injection attempts.
        """

        prompt_lower = prompt.lower()

        for pattern in self.suspicious_patterns:
            if pattern in prompt_lower:
                return {
                    "safe": False,
                    "agent": "PromptInjectionAgent",
                    "reason": f"Detected suspicious pattern: '{pattern}'",
                }

        return {
            "safe": True,
            "agent": "PromptInjectionAgent",
        }