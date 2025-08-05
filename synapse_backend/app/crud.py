from sqlalchemy.orm import Session
from .db import models
from .schemas import user as user_schema
from .core.security import get_password_hash


# --- KULLANICI GETİRME ---
def get_user_by_email(db: Session, email: str):
    """
    E-posta adresine göre kullanıcıyı getirir.
    """
    return db.query(models.User).filter(models.User.email == email).first()

# --- KULLANICI OLUŞTURMA ---
def create_user(db: Session, user: user_schema.UserCreate):
    """
    Yeni bir kullanıcı oluşturur, şifreyi hash'ler.
    """
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- DERSLİĞİ ID VE KULLANICIYA GÖRE GETİRME ---
def get_classroom_by_id(db: Session, classroom_id: int, user_id: int):
    """
    Belirli bir ID'ye sahip ve kullanıcıya ait olan dersliği getirir.
    """
    return db.query(models.Classroom).filter(
        models.Classroom.id == classroom_id,
        models.Classroom.owner_id == user_id
    ).first()

# --- DOKÜMANI ID VE KULLANICIYA GÖRE GETİRME ---
def get_document_by_id(db: Session, document_id: int, user_id: int):
    """
    Belirli bir ID'ye sahip ve kullanıcıya ait bir derslikteki dokümanı getirir.
    """
    return db.query(models.Document).join(models.Classroom).filter(
        models.Document.id == document_id,
        models.Classroom.owner_id == user_id
    ).first()

# --- DERSLİK SİLME ---
def delete_classroom(db: Session, classroom: models.Classroom):
    """
    Verilen classroom nesnesini veritabanından siler.
    """
    db.delete(classroom)
    db.commit()

# --- DOKÜMAN SİLME ---
def delete_document(db: Session, document: models.Document):
    """
    Verilen document nesnesini veritabanından siler.
    """
    db.delete(document)
    db.commit()

def get_or_create_conversation(db: Session, user_id: int, classroom_id: int) -> models.Conversation:
    """
    Belirtilen kullanıcı ve derslik için sohbet geçmişini alır.
    Eğer bir geçmiş yoksa, boş bir tane oluşturur ve döndürür.
    """
    conversation = db.query(models.Conversation).filter(
        models.Conversation.user_id == user_id,
        models.Conversation.classroom_id == classroom_id
    ).first()

    if not conversation:
        conversation = models.Conversation(
            user_id=user_id,
            classroom_id=classroom_id,
            messages=[]
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
    return conversation

def update_conversation_messages(db: Session, conversation: models.Conversation, messages: list):
    """
    Mevcut bir sohbet geçmişinin mesaj listesini günceller.
    """
    conversation.messages = messages
    db.commit()
    db.refresh(conversation)
    return conversation