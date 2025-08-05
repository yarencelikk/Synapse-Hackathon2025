from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# SQLite veritabanı dosyasının yolu
# Bu, projenin ana dizininde "synapse.db" adında bir dosya oluşturacaktır.
SQLALCHEMY_DATABASE_URL = "sqlite:///./synapse.db"

# SQLAlchemy "engine" oluşturuluyor
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # SQLite varsayılan olarak sadece tek bir thread'e izin verir.
    # FastAPI'nin asenkron yapısıyla uyumlu olması için bu ayar gereklidir.
    connect_args={"check_same_thread": False}
)

# Veritabanı oturumu (session) oluşturucu
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Modellerimizin miras alacağı temel sınıf (Base class)
Base = declarative_base()