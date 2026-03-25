from typing import Dict, Any
from app.services.llm import secure_llm


class InvoiceAuditor:

    def audit(self, document_text: str, user_id: int) -> Dict[str, Any]:
        prompt = """
        You are an expert financial auditor AI.
        Extract the GST number, Invoice number, Date, and Total Amount.
        Perform GST validation (check if format is valid).
        Flag any 'duplicate_suspicions' or 'fraud_risks' based on anomalous amounts or formats.
        Response MUST be a JSON object with keys: 'gst_number', 'valid_gst', 'invoice_number', 'amount', 'fraud_risks'.
        """

        # SecureLLMService ensures all numbers/PII are sent as tokens and restitched back
        result = secure_llm.analyze_document_securely(prompt, document_text, user_id)
        return result


invoice_auditor = InvoiceAuditor()
