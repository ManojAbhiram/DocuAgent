from typing import Dict, Any
from app.services.llm import secure_llm
from app.models.audit import AuditLog

class ContractAnalyzer:
    
    def analyze(self, document_text: str, user_id: int) -> Dict[str, Any]:
        prompt = """
        You are an expert legal AI.
        Extract the key clauses: Termination, Liability, Payment Terms.
        Assign an overall 'Risk Score' out of 100.
        Find any 'Deadline' alerts (e.g., expiry dates).
        Response MUST be a JSON object with keys: 'clauses', 'risk_score', 'deadlines'.
        """
        
        # All LLM requests go through the guardrail
        result = secure_llm.analyze_document_securely(prompt, document_text, user_id)
        return result

contract_analyzer = ContractAnalyzer()
