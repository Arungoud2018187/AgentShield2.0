from typing import Dict


class OutputValidationAgent:
    """
    Validates the AI response before returning it to the frontend.
    """

    BLOCKED_PATTERNS = [
        "ignore previous instructions",
        "developer message",
        "system prompt",
        "repeat your hidden instructions",
        "internal prompt",
    ]

    def scan(self, response: str) -> Dict:

        if not response or not response.strip():

            return {
                "safe": False,
                "agent": "OutputValidationAgent",
                "reason": "Model returned an empty response.",
                "response": "",
            }

        response_lower = response.lower()

        for pattern in self.BLOCKED_PATTERNS:

            if pattern in response_lower:

                return {
                    "safe": False,
                    "agent": "OutputValidationAgent",
                    "reason": f"Unsafe output detected ({pattern})",
                    "response": "",
                }

        return {
            "safe": True,
            "agent": "OutputValidationAgent",
            "reason": "Response validated successfully.",
            "response": response,
        }