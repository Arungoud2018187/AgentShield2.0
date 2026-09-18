import re


class PromptInjectionAgent:
    """
    Detects prompt injection and instruction manipulation attempts.

    This agent focuses on:
    - instruction override
    - system/developer prompt extraction
    - role hijacking
    - hidden instruction manipulation
    - policy/safety bypass attempts
    - requests for secrets/internal information
    """

    def __init__(self):

        self.patterns = [

            # -------------------------------------------------
            # Instruction override / manipulation
            # -------------------------------------------------

            r"\bignore\s+(all\s+)?(previous|prior|earlier|above)\s+instructions?\b",
            r"\bignore\s+(your|the)\s+(instructions?|rules?|policies?)\b",
            r"\bdisregard\s+(all\s+)?(previous|prior|earlier)\s+instructions?\b",
            r"\bforget\s+(your\s+|all\s+)?(previous|prior|earlier)\s+instructions?\b",
            r"\bforget\s+(your\s+)?instructions?\b",

            r"\boverride\s+(the\s+)?(system|security|safety|developer)\s+"
            r"(instructions?|rules?|policies?)\b",

            r"\bdo\s+not\s+follow\s+(your|the)\s+(instructions?|rules?|policy)\b",

            r"\bfollow\s+the\s+instructions?\s+(contained|embedded|inside)\b",
            r"\bfollow\s+these\s+instructions?\s+instead\b",
            r"\bnew\s+instructions?\s*:\b",

            # -------------------------------------------------
            # Prompt / system extraction
            # -------------------------------------------------

            r"\b(reveal|show|display|print|give|provide|expose)\b.{0,80}"
            r"\b(system\s+prompt|system\s+message|developer\s+message|"
            r"developer\s+instructions?|hidden\s+instructions?)\b",

            r"\bwhat\s+(is|are)\s+your\s+(system\s+prompt|hidden\s+instructions?)\b",
            r"\b(repeat|recite)\b.{0,60}\b(your\s+instructions?|system\s+prompt)\b",

            # -------------------------------------------------
            # Role hijacking
            # -------------------------------------------------

            r"\byou\s+are\s+now\s+(a|an)\b",
            r"\bact\s+as\s+(a|an)?\s*(different|unrestricted|unfiltered)\b",
            r"\bpretend\s+to\s+be\b",
            r"\brole[-\s]?play\s+as\b",
            r"\bsimulate\s+(being|a|an)\b",
            r"\bimpersonate\b",

            # -------------------------------------------------
            # Safety / policy bypass
            # -------------------------------------------------

            r"\bbypass\s+(your\s+)?(safety|security|policy|policies|restrictions?)\b",
            r"\bdisable\s+(your\s+)?(safety|security|filters?|guardrails?)\b",
            r"\bremove\s+(your\s+)?(restrictions?|limitations?|guardrails?)\b",
            r"\bwithout\s+(any\s+)?(restrictions?|limitations?|safety\s+rules?)\b",
            r"\bignore\s+(your\s+)?(safety|security)\s+(rules?|policy|policies)\b",

            # -------------------------------------------------
            # Jailbreak indicators
            # -------------------------------------------------

            r"\bjailbreak\b",
            r"\bdan\s+mode\b",
            r"\bdo\s+anything\s+now\b",
            r"\bdeveloper\s+mode\b",
            r"\bunrestricted\s+mode\b",
            r"\bunfiltered\s+mode\b",

            # -------------------------------------------------
            # Confidential / secret extraction
            # -------------------------------------------------

            r"\b(reveal|show|give|print|provide)\b.{0,50}"
            r"\b(api\s+key|access\s+token|secret\s+key|private\s+key|jwt\s+secret)\b",

            # -------------------------------------------------
            # Internal reasoning extraction
            # -------------------------------------------------

            r"\bshow\s+(me\s+)?your\s+(chain\s+of\s+thought|reasoning)\b",
            r"\breveal\s+(your\s+)?reasoning\b",
            r"\bshow\s+your\s+internal\s+reasoning\b",
            r"\bthink\s+step\s+by\s+step\s+and\s+show\b",
        ]

        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.patterns
        ]

    def normalize(self, text: str) -> str:
        """
        Normalize input before scanning.
        """

        text = text.lower()

        # Normalize common whitespace variations.
        text = re.sub(r"\s+", " ", text)

        # Remove zero-width characters.
        text = re.sub(r"[\u200b-\u200f\u202a-\u202e]", "", text)

        return text.strip()

    def scan(self, prompt: str):
        """
        Scan a prompt for injection attempts.
        """

        if not prompt or not prompt.strip():
            return {
                "safe": True,
                "agent": "PromptInjectionAgent",
            }

        normalized = self.normalize(prompt)

        for pattern, compiled in zip(self.patterns, self.compiled_patterns):

            if compiled.search(normalized):

                return {
                    "safe": False,
                    "agent": "PromptInjectionAgent",
                    "reason": f"Detected prompt injection pattern: '{pattern}'",
                }

        return {
            "safe": True,
            "agent": "PromptInjectionAgent",
        }
