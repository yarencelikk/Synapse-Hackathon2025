from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List

from app.db import models
from app.schemas import classroom as classroom_schema
from app.api.dependencies import get_db, get_current_user  # Güncellenmiş importlar
from app import crud
from app.services import vector_store_manager  # Silme işlemleri için gerekli
from app.schemas import conversation as conversation_schema


# APIRouter, endpoint'leri modüler bir şekilde gruplamamızı sağlar.
router = APIRouter()

# --- DERSLİK OLUŞTURMA ---
@router.post("/", response_model=classroom_schema.Classroom, status_code=201)
def create_classroom(
    classroom: classroom_schema.ClassroomCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Yeni bir derslik oluşturur.
    - **name**: Dersliğin adı.
    - Sadece giriş yapmış kullanıcı kendi adına oluşturabilir.
    """
    db_classroom = models.Classroom(name=classroom.name, owner_id=current_user.id)
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

# --- TÜM DERSLİKLERİ LİSTELEME (SADECE KULLANICIYA AİT OLANLAR) ---
@router.get("/", response_model=List[classroom_schema.Classroom])
def read_classrooms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Sadece giriş yapmış kullanıcının dersliklerini listeler.
    """
    return db.query(models.Classroom).filter(models.Classroom.owner_id == current_user.id).all()

# --- BELİRLİ BİR DERSLİK DETAYI GETİRME ---
@router.get("/{classroom_id}", response_model=classroom_schema.Classroom)
def read_classroom(
    classroom_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Belirli bir ID'ye sahip ve sadece giriş yapmış kullanıcıya ait dersliği getirir.
    """
    db_classroom = db.query(models.Classroom).filter(
        models.Classroom.id == classroom_id,
        models.Classroom.owner_id == current_user.id
    ).first()
    if db_classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return db_classroom

# --- DERSLİK SİLME (YENİ ENDPOINT) ---
@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classroom(
    classroom_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Kullanıcıya ait bir dersliği ve içindeki tüm dokümanları siler.
    """
    # 1. Dersliğin varlığını ve sahipliğini kontrol et
    db_classroom = crud.get_classroom_by_id(db, classroom_id=classroom_id, user_id=current_user.id)
    if not db_classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    # 2. Vektör veritabanından ilgili koleksiyonu sil
    collection_name = f"classroom_{classroom_id}"
    vector_store_manager.delete_collection(collection_name)

    # 3. İlişkisel veritabanından dersliği sil (dokümanlar otomatik silinecek)
    crud.delete_classroom(db=db, classroom=db_classroom)

    # 4. Başarıyla silindi, içerik dönmeye gerek yok
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Kullanıcıya ait bir derslik içindeki dokümanı siler.
    """
    # 1. Dokümanın varlığını ve sahipliğini kontrol et
    db_document = crud.get_document_by_id(db, document_id=document_id, user_id=current_user.id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    classroom_id = db_document.classroom_id

    # 2. Vektör veritabanından dokümana ait kayıtları sil
    collection_name = f"classroom_{classroom_id}"
    vector_store_manager.delete_documents_from_collection(collection_name, doc_id=document_id)

    # 3. İlişkisel veritabanından dokümanı sil
    crud.delete_document(db=db, document=db_document)

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{classroom_id}/history", response_model=conversation_schema.Conversation)
def get_classroom_history(
    classroom_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Kullanıcıya ait belirli bir dersliğin sohbet geçmişini getirir.
    """
    db_classroom = crud.get_classroom_by_id(db, classroom_id=classroom_id, user_id=current_user.id)
    if not db_classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
        
    conversation = crud.get_or_create_conversation(db, user_id=current_user.id, classroom_id=classroom_id)
    return conversation