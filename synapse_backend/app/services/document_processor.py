import pypdf
import docx
from sqlalchemy.orm import Session
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.db.session import SessionLocal
from app.db import models
from app.services import vector_store_manager # Yeni servisimizi import ediyoruz
import os

def extract_text_from_pdf(file_path: str) -> str:
    """PDF dosyasından metin çıkarır."""
    try:
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
    except Exception as e:
        print(f"PDF'ten metin çıkarılırken hata: {e}")
        return ""

def extract_text_from_docx(file_path: str) -> str:
    """DOCX dosyasından metin çıkarır."""
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"DOCX'ten metin çıkarılırken hata: {e}")
        return ""

def process_document(doc_id: int, file_path: str):
    """
    Arka plan görevi olarak çalışacak ana fonksiyon.
    Metin çıkarır, parçalara ayırır, vektör deposuna ekler ve durumu günceller.
    """
    print(f"Arka plan görevi başlatıldı: Doküman ID {doc_id} işleniyor...")
    
    db: Session = SessionLocal()
    
    try:
        db_document = db.query(models.Document).filter(models.Document.id == doc_id).first()
        if not db_document:
            print(f"Hata: Doküman ID {doc_id} veritabanında bulunamadı.")
            return

        # 1. Metin Çıkarma
        file_ext = os.path.splitext(file_path)[1].lower()
        text = ""
        if file_ext == ".pdf":
            text = extract_text_from_pdf(file_path)
        elif file_ext == ".docx":
            text = extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Desteklenmeyen dosya türü: {file_ext}")

        if not text:
            raise ValueError("Dosyadan metin çıkarılamadı veya dosya boş.")
        
        print(f"Doküman ID {doc_id} için metin başarıyla çıkarıldı. Uzunluk: {len(text)} karakter.")

        # 2. Metin Parçalama (Chunking)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text)
        print(f"Metin {len(chunks)} parçaya (chunk) ayrıldı.")

        # 3. Vektör Veritabanına Ekleme
        if chunks:
            collection_name = f"classroom_{db_document.classroom_id}"
            metadatas = [{"source": db_document.file_name, "doc_id": db_document.id} for _ in chunks]
            
            vector_store_manager.add_chunks_to_vector_store(
                collection_name=collection_name,
                chunks=chunks,
                metadatas=metadatas
            )
        
        # 4. Durumu Güncelleme
        db_document.status = "ready"
        db.commit()
        print(f"Doküman ID {doc_id} durumu 'ready' olarak güncellendi ve vektör deposuna eklendi.")

    except Exception as e:
        print(f"Hata: Doküman ID {doc_id} işlenirken bir sorun oluştu: {e}")
        if 'db_document' in locals() and db_document:
            db_document.status = "failed"
            db.commit()
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Geçici dosya silindi: {file_path}")
        db.close()
