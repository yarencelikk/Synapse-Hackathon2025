import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException, Response, status
from sqlalchemy.orm import Session

# Dependency'leri merkezi bir yerden import ediyoruz
from app.api.dependencies import get_db, get_current_user 
from app.db import models
from app.schemas import document as document_schema
from app.services.document_processor import process_document
from app import crud
from app.services import vector_store_manager
from app.schemas.document import QuickSummaryResponse
from app.services import ai_services

router = APIRouter()

UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

@router.post("/", response_model=document_schema.Document, status_code=201)
def upload_document(
    background_tasks: BackgroundTasks,
    classroom_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Bir dersliğe yeni bir doküman yükler.
    YALNIZCA kullanıcının sahip olduğu dersliğe yükleme yapılabilir.
    """
    # Dersliğin var olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
    classroom = db.query(models.Classroom).filter(
        models.Classroom.id == classroom_id,
        models.Classroom.owner_id == current_user.id
    ).first()
    if not classroom:
        # Hata mesajını daha anlaşılır hale getirdik
        raise HTTPException(status_code=404, detail="Classroom not found or you do not have permission to access it.")

    # Dosyayı geçici olarak diske kaydet
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOADS_DIR / unique_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Veritabanına doküman kaydını 'processing' durumuyla oluştur
    db_document = models.Document(
        file_name=file.filename,
        classroom_id=classroom_id,
        status="processing"
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    # Ağır işi arka plan görevine devret
    background_tasks.add_task(process_document, db_document.id, str(file_path))

    return db_document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Kullanıcıya ait bir derslik içindeki dokümanı siler.
    """
    # Dokümanın varlığını ve sahipliğini kontrol et
    db_document = crud.get_document_by_id(db, document_id=document_id, user_id=current_user.id)
    if not db_document:
        # Hata mesajını daha anlaşılır hale getirdik
        raise HTTPException(status_code=404, detail="Document not found or you do not have permission to access it.")

    classroom_id = db_document.classroom_id

    # Vektör veritabanından dokümana ait kayıtları sil
    collection_name = f"classroom_{classroom_id}"
    vector_store_manager.delete_documents_from_collection(collection_name, doc_id=document_id)

    # İlişkisel veritabanından dokümanı sil
    crud.delete_document(db=db, document=db_document)

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{document_id}/quick-summary", response_model=QuickSummaryResponse)
def get_document_quick_summary(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Belirli bir dokümanın kısa bir özetini ve ana başlıklarını oluşturur.
    Kullanıcı sadece kendi dokümanları için bu işlemi yapabilir.
    """
    # 1. Güvenlik Kontrolü: Dokümanın varlığını ve kullanıcıya ait olduğunu doğrula.
    db_document = crud.get_document_by_id(db, document_id=document_id, user_id=current_user.id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    if db_document.status != 'ready':
        raise HTTPException(status_code=400, detail="Document is still being processed. Please wait.")

    # 2. Dokümanın Tam Metnini Vektör Veritabanından Çek
    collection_name = f"classroom_{db_document.classroom_id}"
    full_text = vector_store_manager.get_all_chunks_for_document(
        collection_name=collection_name, 
        doc_id=document_id
    )

    if not full_text:
        raise HTTPException(status_code=500, detail="Could not retrieve document content for summary.")

    # 3. Yapay Zeka ile Özet ve Başlıkları Oluştur
    summary_data = ai_services.generate_summary_and_headings(full_text)
    
    if not summary_data:
        raise HTTPException(status_code=500, detail="Failed to generate summary from document content.")
        
    return QuickSummaryResponse(
        summary=summary_data.get("summary", "Özet oluşturulamadı."),
        headings=summary_data.get("headings", [])
    )