from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    action = Column(String, nullable=False) # e.g., "UPLOAD_DOCUMENT", "LLM_CALL"
    resource_id = Column(String, nullable=True) # e.g., document id
    details = Column(String, nullable=True) # Can store JSON strings of masked data
    timestamp = Column(DateTime, default=datetime.utcnow)
