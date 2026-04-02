from typing import List, Any
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    BackgroundTasks,
)
from app.api.deps import SessionDep, CurrentUser
from app.models.document import Document
from app.models.audit import AuditLog
from app.services.document import store_file, process_document_background

from app.schemas.document import DocumentSchema

router = APIRouter()


@router.post("/upload")
async def upload_documents(
    session: SessionDep,
    current_user: CurrentUser,
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    doc_type: str = "General",
) -> Any:
    """
    Upload multiple documents.
    """
    results = []
    for file in files:
        if not file.filename:
            continue

        # 1. Store file asynchronously
        file_path = await store_file(file, current_user.id)

        # 2. Database entry
        doc = Document(
            filename=file.filename,
            file_path=file_path,
            owner_id=current_user.id,
            doc_type=doc_type,
        )
        session.add(doc)
        session.commit()
        session.refresh(doc)

        # 3. Audit log
        audit = AuditLog(
            user_id=current_user.id,
            action="DOCUMENT_UPLOAD",
            resource_id=str(doc.id),
            details=f"Uploaded {file.filename} as {doc_type}",
        )
        session.add(audit)
        session.commit()

        # 4. Background task queue
        background_tasks.add_task(
            process_document_background, doc.id, file_path, doc_type
        )

        results.append({"id": doc.id, "filename": doc.filename, "status": doc.status})

    return {"message": "Files uploaded and processing started", "documents": results}


@router.get("/", response_model=List[DocumentSchema])
def get_documents(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Get user's documents. Admin can see all.
    """
    if current_user.role == "Admin":
        docs = session.query(Document).all()
    else:
        docs = (
            session.query(Document).filter(Document.owner_id == current_user.id).all()
        )
    return docs
