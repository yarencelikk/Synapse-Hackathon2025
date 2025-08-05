from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app import crud
from app.db import models
from app.db.session import SessionLocal
from app.core.security import oauth2_scheme
from app.core.config import settings

# Yorum: TokenData şemasını doğrudan import ediyoruz
from app.schemas.token import TokenData

# Dependency: Veritabanı oturumu (session) alma
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Kullanıcı doğrulaması için yardımcı fonksiyon
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    JWT token'dan kullanıcıyı doğrular, kimlik doğrulama başarısızsa 401 döner.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
