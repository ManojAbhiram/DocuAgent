from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str
    doc_type: str = "General"

class DocumentCreate(DocumentBase):
    file_path: str
    owner_id: int

class DocumentSchema(DocumentBase):
    id: int
    status: str
    upload_time: datetime
    owner_id: int
    extracted_text: Optional[str] = None
    analysis_result: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
