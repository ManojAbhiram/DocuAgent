from typing import Any, Dict
import json
from litellm import completion
from app.services.guardrails import guardrails
from app.core.config import settings


class SecureLLMService:
    """
    Acts as the exclusive interface to the LLM.
    Enforces security boundaries: PII masking, injection checks, and audit trailing.
    """

    def analyze_document_securely(
        self, prompt: str, document_text: str, user_id: int
    ) -> Dict[str, Any]:
        """
        Takes raw document text, masks PII, sends to LLM, and rehydrates response.
        """
        # 1. Injection Protection
        if guardrails.check_prompt_injection(prompt):
            raise ValueError("Prompt injection detected! Request blocked.")

        # 2. PII Masking before LLM
        masked_text, vault = guardrails.mask_and_tokenize(document_text)

        # 3. Call LLM with ONLY the masked text
        safe_prompt = f"{prompt}\n\nDocument Text:\n{masked_text}"

        response = completion(
            model=settings.LITELLM_DEFAULT_MODEL,
            messages=[{"role": "user", "content": safe_prompt}],
            temperature=0.2,  # Low temp for analytical tasks
            # Require JSON output depending on the requested analyzer task
            response_format={"type": "json_object"},
        )

        llm_output = response.choices[0].message.content

        # 4. Output Validation
        validated_json = guardrails.validate_output_schema(llm_output)

        # 5. Reverse Masking (Rehydration)
        rehydrated_output = guardrails.rehydrate(json.dumps(validated_json), vault)

        # Note: the actual rehydrated output can then be parsed back to dict, but for safety
        # we return the vault and the raw rehydrated string in this simplified model.
        try:
            final_obj = json.loads(rehydrated_output)
        except Exception:
            final_obj = rehydrated_output

        return {
            "masked_input_length": len(masked_text),
            "tokens_used": response.usage.total_tokens,
            "vault": vault,  # Returned for audit logs
            "result": final_obj,
        }


secure_llm = SecureLLMService()
