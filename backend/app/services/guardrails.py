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
        self.malicious_keywords = ["ignore previous", "system prompt", "bypass", "jailbreak"]

    def mask_and_tokenize(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Masks PII in the text and returns the masked text and a token vault mapping.
        """
        vault_mapping = {}
        masked_text = text
        
        for pii_type, pattern in PII_PATTERNS.items():
            matches = re.finditer(pattern, masked_text)
            for match in matches:
                original_value = match.group()
                # Use a deterministic or random token ID
                token_id = f"[{pii_type}_{uuid.uuid4().hex[:8].upper()}]"
                if original_value not in vault_mapping.values():
                    vault_mapping[token_id] = original_value
                    masked_text = masked_text.replace(original_value, token_id)
                else:
                    # Find existing token id
                    existing_token = next(k for k, v in vault_mapping.items() if v == original_value)
                    masked_text = masked_text.replace(original_value, existing_token)

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
