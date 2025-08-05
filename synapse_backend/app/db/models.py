from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .session import Base  # Bir önceki adımda oluşturduğumuz Base'i import ediyoruz

# --- KULLANICI TABLOSU ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Bir kullanıcının birden çok dersliği olabilir ilişkisi
    # DİKKAT: CASCADE ile kullanıcı silinirse tüm derslikleri de otomatik silinir!
    classrooms = relationship("Classroom", back_populates="owner", cascade="all, delete-orphan")
    
    # Bir kullanıcının birden çok sohbeti olabilir (conversation)
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

# --- DERSLİK TABLOSU ---
class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # Her dersliğin bir sahibi (user) olur
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="classrooms")

    # Bir dersliğin birden çok dokümanı olabilir ilişkisi
    # CASCADE ile derslik silinirse tüm dokümanlar da otomatik silinir!
    documents = relationship("Document", back_populates="classroom", cascade="all, delete-orphan")

    # Her dersliğin bir tane sohbeti olabilir (uselist=False)
    conversation = relationship("Conversation", back_populates="classroom", uselist=False, cascade="all, delete-orphan")

# --- DOKÜMAN TABLOSU ---
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    status = Column(String, default="processing")  # 'processing', 'ready', 'failed'

    # Bir doküman sadece bir dersliğe ait olabilir ilişkisi
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    classroom = relationship("Classroom", back_populates="documents")

# --- YENİ: SOHBET (CONVERSATION) TABLOSU ---
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)

    # Tüm mesajlar [{role: 'user', content: '...'}, ...] olarak JSON alanında saklanacak
    messages = Column(JSON, nullable=False, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="conversations")
    classroom = relationship("Classroom", back_populates="conversation")

    # Bir kullanıcı ve bir derslik için sadece tek bir sohbet geçmişi olmasını zorunlu tutar
    __table_args__ = (UniqueConstraint('user_id', 'classroom_id', name='_user_classroom_uc'),)
