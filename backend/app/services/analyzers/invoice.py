from typing import Dict, Any
from app.services.llm import secure_llm


class InvoiceAuditor:

    def audit(self, document_text: str, user_id: int) -> Dict[str, Any]:
        prompt = """
        You are an expert financial auditor AI.
        Extract the vendor name, invoice date, and total amount.
        Assign an 'audit_status' (string describing the findings).
        Response MUST be a JSON object with keys: 
        - 'vendor_name': string
        - 'invoice_date': string (YYYY-MM-DD)
        - 'total_amount': string (e.g. '$1,234.56')
        - 'audit_status': string
        """

        # SecureLLMService ensures all numbers/PII are sent as tokens and restitched back
        result = secure_llm.analyze_document_securely(prompt, document_text, user_id)
        return result


invoice_auditor = InvoiceAuditor()
