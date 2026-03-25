from typing import Any
from fastapi import APIRouter, Depends
from app.api.deps import SessionDep, get_current_admin_user
from app.models.audit import AuditLog

router = APIRouter()


@router.get("/", dependencies=[Depends(get_current_admin_user)])
def get_audit_logs(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve audit logs (Admin only).
    """
    logs = (
        session.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return logs
