from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from app.api.deps import SessionDep, CurrentUser
from app.models.document import Document
from app.services.analyzers.contract import contract_analyzer
from app.services.analyzers.invoice import invoice_auditor
from app.services.analyzers.financial import financial_analyzer

router = APIRouter()


class AnalyzeRequest(BaseModel):
    document_id: int


def get_document_safely(session, doc_id, current_user):
    doc = session.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if current_user.role != "Admin" and doc.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this document"
        )
    if doc.status != "Completed" or not doc.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="Document is not fully processed or contains no text",
        )
    return doc


@router.post("/contract")
def analyze_contract(
    req: AnalyzeRequest, session: SessionDep, current_user: CurrentUser
) -> Any:
    """Analyze a contract for clauses and risks using real document extraction."""
    doc = get_document_safely(session, req.document_id, current_user)
    try:
        res = contract_analyzer.analyze(doc.extracted_text, current_user.id)
        doc.analysis_result = json.dumps(res)
        session.commit()
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/invoice")
def audit_invoice(
    req: AnalyzeRequest, session: SessionDep, current_user: CurrentUser
) -> Any:
    """Audit an invoice based on real extracted database text."""
    doc = get_document_safely(session, req.document_id, current_user)
    try:
        res = invoice_auditor.audit(doc.extracted_text, current_user.id)
        doc.analysis_result = json.dumps(res)
        session.commit()
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/financial")
def analyze_financials(
    req: AnalyzeRequest, session: SessionDep, current_user: CurrentUser
) -> Any:
    """Analyze financial KPIs using real extraction."""
    doc = get_document_safely(session, req.document_id, current_user)
    try:
        res = financial_analyzer.analyze(doc.extracted_text, current_user.id)
        doc.analysis_result = json.dumps(res)
        session.commit()
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
