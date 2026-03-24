from typing import Dict, Any
from app.services.llm import secure_llm

class FinancialAnalyzer:
    
    def analyze(self, document_text: str, user_id: int) -> Dict[str, Any]:
        prompt = """
        You are an expert financial analyst AI.
        Extract key financial KPIs: Revenue, Profit, EBITDA.
        Provide 'trend_insights' if comparing multiple periods in the text.
        Response MUST be a JSON object with keys: 'kpis' (dict of metric: value), 'trend_insights' (list of strings).
        """
        
        result = secure_llm.analyze_document_securely(prompt, document_text, user_id)
        return result

financial_analyzer = FinancialAnalyzer()
