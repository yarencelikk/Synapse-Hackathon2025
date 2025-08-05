from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # CORS middleware'ını import ediyoruz
from app.db.session import engine, Base
from app.core.config import settings
from app.api.v1.api import api_router

# Veritabanı tablolarını oluşturma
Base.metadata.create_all(bind=engine)

# OpenAPI (Swagger) arayüzündeki etiketlerin tanımı
tags_metadata = [
    {
        "name": "Login",
        "description": "Kullanıcı kaydı ve girişi işlemleri.",
    },
    {
        "name": "Classrooms",
        "description": "Derslik oluşturma ve yönetme işlemleri.",
    },
    {
        "name": "Documents",
        "description": "Doküman yükleme ve yönetme işlemleri.",
    },
    {
        "name": "Interactions",
        "description": "Synapse ajanları ile etkileşim.",
    },
]

# FastAPI uygulamasını oluşturma
app = FastAPI(
    title="Synapse: Kişiselleştirilmiş Öğrenme Ekosistemi",
    description=f"Gemini ve LangGraph tabanlı çoklu ajanlı öğrenme platformu. API Key Loaded: {'Evet' if settings.GOOGLE_API_KEY else 'Hayır'}",
    version="0.1.0",
    openapi_tags=tags_metadata
)

# --- CORS AYARLARI (ÇÖZÜM BURADA) ---
# İzin verilecek olan kaynakların (frontend adreslerinin) listesi
origins = [
    "http://localhost:5173",  # React frontend'in çalıştığı adres
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Belirtilen kaynaklardan gelen isteklere izin ver
    allow_credentials=True,
    allow_methods=["*"],    # Tüm metodlara (GET, POST, OPTIONS vb.) izin ver
    allow_headers=["*"],    # Tüm başlıklara izin ver
)
# --- CORS AYARLARI BİTTİ ---

@app.get("/", tags=["Root"])
def read_root():
    """
    Uygulamanın çalışıp çalışmadığını kontrol etmek için basit bir endpoint.
    """
    return {"message": "Synapse Backend'e Hoş Geldiniz!"}

# Ana router'ı uygulamaya dahil ediyoruz.
app.include_router(api_router, prefix="/api/v1")