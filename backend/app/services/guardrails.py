import re
import uuid
import json
from typing import Dict, Tuple

# Simple Mock NLP/Regex based PII recognizer for demonstration
# In production, use Presidio or AWS Macie

PII_PATTERNS = {
    "EMAIL": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "PHONE": r"\b\d{10}\b",
    "GST": r"\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}",
    # Add more patterns like Bank Account, SSN, etc.
}


class GuardrailService:

    def __init__(self):
        self.malicious_keywords = [
            "ignore previous",
            "system prompt",
            "bypass",
            "jailbreak",
        ]

    def mask_and_tokenize(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Masks PII in the text using a single pass to avoid overlapping replacements.
        """
        vault_mapping = {}

        # Combine all patterns into one regex with capturing groups
        master_pattern = "|".join(
            f"(?P<{ptype}>{pattern})" for ptype, pattern in PII_PATTERNS.items()
        )

        def replace_callback(match):
            for ptype in PII_PATTERNS.keys():
                original_value = match.group(ptype)
                if original_value:
                    # Find if this value was already masked
                    for tid, val in vault_mapping.items():
                        if val == original_value:
                            return tid

                    # Create new token
                    token_id = f"[{ptype}_{uuid.uuid4().hex[:8].upper()}]"
                    vault_mapping[token_id] = original_value
                    return token_id
            return match.group(0)

        masked_text = re.sub(master_pattern, replace_callback, text)
        return masked_text, vault_mapping

    def rehydrate(self, text: str, vault_mapping: Dict[str, str]) -> str:
        """
        Replaces tokens with original PII values.
        """
        rehydrated_text = text
        for token_id, original_value in vault_mapping.items():
            rehydrated_text = rehydrated_text.replace(token_id, original_value)
        return rehydrated_text

    def check_prompt_injection(self, prompt: str) -> bool:
        """
        Validates if prompt contains known injection patterns.
        """
        prompt_lower = prompt.lower()
        for keyword in self.malicious_keywords:
            if keyword in prompt_lower:
                return True
        return False

    def validate_output_schema(self, response_text: str) -> dict:
        """
        Validates that the output matches expected JSON structure.
        """
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError("LLM Output did not match expected JSON format.")


guardrails = GuardrailService()
