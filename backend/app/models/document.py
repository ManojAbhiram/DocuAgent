from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True, nullable=False)
    status = Column(String, default="Uploaded") # Uploaded, Processing, Completed, Failed
    upload_time = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String, nullable=False)
    owner_id = Column(Integer, nullable=False)
    doc_type = Column(String, default="General") # Contract, Invoice, General
    extracted_text = Column(String, nullable=True) # Actual parsed text
    analysis_result = Column(String, nullable=True) # JSON string of result
