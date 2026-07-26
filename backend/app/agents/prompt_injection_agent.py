import re


class PromptInjectionAgent:
    """
    Detects prompt injection and instruction override attempts.
    """

    def __init__(self):

        self.suspicious_patterns = [

            # Instruction override
            "forget your instructions",
            "forget previous",
            "forget all previous instructions",

            "ignore previous",
            "ignore all previous instructions",
            "ignore your instructions",

            "override instructions",
            "override system",
            "override safety",

            # Prompt extraction
            "system prompt",
            "system message",
            "developer message",
            "developer instructions",
            "hidden instructions",
            "internal instructions",
            "reveal your prompt",
            "show your prompt",
            "show system prompt",
            "repeat your instructions",

            # Jailbreak
            "jailbreak",
            "do anything now",
            "dan mode",
            "developer mode",

            # Role manipulation
            "act as",
            "pretend to be",
            "you are now",
            "simulate being",
            "impersonate",

            # Safety bypass
            "bypass safety",
            "disable safety",
            "remove restrictions",
            "without restrictions",
            "ignore policy",

            # Confidential information
            "api key",
            "access token",
            "secret key",
            "private key",
            "jwt secret",

            # Internal reasoning
            "chain of thought",
            "reason step by step",
            "show your reasoning",
            "think step by step",
        ]

    def normalize(self, text: str) -> str:
        """
        Normalize user input before scanning.
        """

        text = text.lower()

        text = re.sub(r"\s+", " ", text)

        return text.strip()

    def scan(self, prompt: str):
        """
        Scan prompt for prompt injection patterns.
        """

        prompt = self.normalize(prompt)

        for pattern in self.suspicious_patterns:

            if pattern in prompt:

                return {
                    "safe": False,
                    "agent": "PromptInjectionAgent",
                    "reason": f"Detected suspicious pattern: '{pattern}'",
                }

        return {
            "safe": True,
            "agent": "PromptInjectionAgent",
        }