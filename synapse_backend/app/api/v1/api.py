from fastapi import APIRouter
from .endpoints import classrooms, documents, interactions, login, audio # audio'yu import et

api_router = APIRouter()

api_router.include_router(login.router, tags=["Login"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])
api_router.include_router(audio.router, prefix="/audio", tags=["Audio"]) # Yeni router'ı ekle