import os
import aiofiles
from fastapi import UploadFile

UPLOAD_DIR = "/tmp/docuagent_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def store_file(file: UploadFile, owner_id: int) -> str:
    file_path = os.path.join(UPLOAD_DIR, f"{owner_id}_{file.filename}")
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    return file_path

def process_document_background(doc_id: int, file_path: str, doc_type: str):
    from app.db.session import SessionLocal
    from app.models.document import Document
    from app.models.audit import AuditLog
    from markitdown import MarkItDown
    from app.services.ocr import process_file_with_paddle
    
    db = SessionLocal()
    try:
        extracted_text = ""
        ext = file_path.lower().split('.')[-1]
        
        # Determine whether to use PaddleOCR (Vision) or MarkItDown (Universal)
        if ext in ["pdf", "jpg", "jpeg", "png"]:
            try:
                extracted_text = process_file_with_paddle(file_path)
            except Exception as e:
                extracted_text = ""
                
        # Fallback to MarkItDown if Paddle wasn't used or failed
        if not extracted_text:
            md = MarkItDown()
            result = md.convert(file_path)
            extracted_text = result.text_content
        
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.extracted_text = extracted_text.strip()
            doc.status = "Completed"
            
            # Log audit
            audit = AuditLog(
                user_id=doc.owner_id,
                action="DOCUMENT_PROCESSED",
                resource_id=str(doc.id),
                details=f"Extracted {len(extracted_text)} characters from {file_path.split('.')[-1]} file."
            )
            db.add(audit)
            db.commit()
    except Exception as e:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.status = "Failed"
            doc.analysis_result = str(e)
            db.commit()
    finally:
        db.close()
