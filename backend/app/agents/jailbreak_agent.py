class JailbreakAgent:
    """
    Detects common jailbreak attempts.
    """

    def __init__(self):
        self.blocked_patterns = [
            "ignore previous instructions",
            "ignore all previous instructions",
            "system prompt",
            "developer mode",
            "jailbreak",
            "bypass safety",
            "disable safety",
            "pretend you are",
            "act as chatgpt",
            "do anything now",
        ]

    def scan(self, prompt: str):
        """
        Scan the prompt for known jailbreak patterns.
        """

        prompt_lower = prompt.lower()

        for pattern in self.blocked_patterns:
            if pattern in prompt_lower:
                return {
                    "safe": False,
                    "agent": "JailbreakAgent",
                    "reason": f"Detected blocked pattern: '{pattern}'",
                }

        return {
            "safe": True,
            "agent": "JailbreakAgent",
        }