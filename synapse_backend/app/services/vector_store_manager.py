import chromadb
import google.generativeai as genai
from typing import List, Dict, Any
from app.core.config import settings

try:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
except Exception as e:
    print(f"Google AI yapılandırılırken bir hata oluştu: {e}")

client = chromadb.PersistentClient(path="./chroma_db")
EMBEDDING_MODEL = 'models/text-embedding-004'

def add_chunks_to_vector_store(collection_name: str, chunks: List[str], metadatas: List[dict]):
    print(f"'{collection_name}' adlı ChromaDB koleksiyonu hazırlanıyor...")
    collection = client.get_or_create_collection(name=collection_name)
    
    doc_id = metadatas[0]["doc_id"]
    ids = [f"doc{doc_id}_chunk{i}" for i in range(len(chunks))]

    print(f"{len(chunks)} adet chunk için vektörler (embeddings) oluşturuluyor...")
    
    embeddings = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=chunks,
        task_type="RETRIEVAL_DOCUMENT"
    )["embedding"]

    print("Vektörler oluşturuldu. ChromaDB'ye ekleniyor...")
    
    collection.add(
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )
    print(f"{len(chunks)} adet doküman parçası ChromaDB'ye başarıyla eklendi.")

# --- YENİ FONKSİYON ---
def query_vector_store(collection_name: str, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
    """
    Belirtilen koleksiyonda bir sorgu çalıştırır ve en ilgili doküman parçalarını döndürür.
    """
    try:
        collection = client.get_collection(name=collection_name)
        
        # Sorgu için embedding oluştur. Görev türü 'RETRIEVAL_QUERY' olmalı!
        query_embedding = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=query,
            task_type="RETRIEVAL_QUERY"
        )["embedding"]
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Hem dokümanları hem de metadataları birlikte döndürelim
        retrieved_docs = []
        if results and results['documents']:
            for i, doc in enumerate(results['documents'][0]):
                retrieved_docs.append({
                    "content": doc,
                    "metadata": results['metadatas'][0][i]
                })
        
        return retrieved_docs

    except ValueError:
        print(f"Koleksiyon '{collection_name}' bulunamadı. Henüz bu dersliğe doküman eklenmemiş olabilir.")
        return []
    except Exception as e:
        print(f"Vektör sorgusunda bir hata oluştu: {e}")
        return []

# --- YENİ EKLENEN SİLME FONKSİYONLARI ---

def delete_collection(collection_name: str):
    """
    Belirtilen koleksiyonu (tüm içeriğiyle birlikte) ChromaDB'den siler.
    """
    try:
        print(f"ChromaDB'den '{collection_name}' koleksiyonu siliniyor...")
        client.delete_collection(name=collection_name)
        print(f"'{collection_name}' koleksiyonu başarıyla silindi.")
    except Exception as e:
        print(f"Hata: '{collection_name}' koleksiyonu silinemedi: {e}")
        # Hata olsa bile devam et, en azından DB'den silinmiş olur.
        pass

def delete_documents_from_collection(collection_name: str, doc_id: int):
    """
    Bir koleksiyon içinden belirli bir dokümana ait tüm vektörleri siler.
    """
    try:
        print(f"'{collection_name}' koleksiyonundan doc_id={doc_id} olan vektörler siliniyor...")
        collection = client.get_collection(name=collection_name)
        collection.delete(where={"doc_id": doc_id})
        print(f"doc_id={doc_id} olan vektörler başarıyla silindi.")
    except Exception as e:
        print(f"Hata: doc_id={doc_id} olan vektörler silinemedi: {e}")
        pass

# ... mevcut diğer fonksiyonlar ...

def get_all_chunks_for_document(collection_name: str, doc_id: int) -> str | None:
    """
    Belirtilen koleksiyondan, belirli bir doc_id'ye sahip tüm metin parçacıklarını (chunks)
    getirir ve tek bir metin olarak birleştirir.
    """
    try:
        collection = client.get_collection(name=collection_name)
        
        # doc_id'ye göre filtreleyerek tüm ilgili kayıtları al
        results = collection.get(where={"doc_id": doc_id})

        if not results or not results.get("documents"):
            print(f"'{collection_name}' koleksiyonunda doc_id={doc_id} için chunk bulunamadı.")
            return None
        
        # Tüm metin parçacıklarını tek bir metin halinde birleştir
        full_text = "\n".join(results["documents"])
        print(f"doc_id={doc_id} için toplam {len(full_text)} karakterlik metin birleştirildi.")
        return full_text

    except Exception as e:
        print(f"doc_id={doc_id} için chunk'lar getirilirken hata oluştu: {e}")
        return None