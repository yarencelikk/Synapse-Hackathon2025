from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# --- ÇÖZÜM BURADA BAŞLIYOR ---
# Projenin herhangi bir yerinde import edilmeden önce .env dosyasını yükle
# Bu, GOOGLE_APPLICATION_CREDENTIALS gibi değişkenlerin
# Google kütüphaneleri tarafından anında tanınmasını sağlar.
load_dotenv()
# --- ÇÖZÜM BURADA BİTİYOR ---


class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Bu değişken artık doğrudan os.environ'dan okunacak,
    # Pydantic'in yönetmesine gerek yok.
    # GOOGLE_APPLICATION_CREDENTIALS: str

    # .env dosyasını Pydantic'in de okumasını sağlıyoruz
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
