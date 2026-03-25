from fastapi import APIRouter
from app.api.endpoints import auth, document, audit, analyzers

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(document.router, prefix="/documents", tags=["documents"])
api_router.include_router(audit.router, prefix="/audit-logs", tags=["audit"])
api_router.include_router(analyzers.router, prefix="/analyzers", tags=["analyzers"])
