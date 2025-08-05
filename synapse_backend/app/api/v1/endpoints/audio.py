from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from pydantic import BaseModel

from app.api.dependencies import get_db, get_current_user
from app.db import models
from app.services import audio_services
from app.api.v1.endpoints.interactions import run_agent_interaction
from app.schemas import conversation as conversation_schema

router = APIRouter()

# --- MEVCUT TTS KODU (DEĞİŞİKLİK YOK) ---
class SynthesizeRequest(BaseModel):
    text: str

@router.post("/synthesize", response_class=StreamingResponse)
async def text_to_speech(request: SynthesizeRequest):
    # ... (içerik aynı)
    try:
        audio_content = audio_services.synthesize_speech(request.text)
        return StreamingResponse(BytesIO(audio_content), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- YENİ SPEECH-TO-TEXT ENDPOINT'İ ---
class TranscribeResponse(BaseModel):
    text: str

@router.post("/transcribe", response_model=TranscribeResponse)
async def speech_to_text(
    file: UploadFile = File(...),
    # Token ile koruma altına alıyoruz ki sadece giriş yapmış kullanıcılar kullanabilsin.
    current_user: models.User = Depends(get_current_user) 
):
    """
    Sadece ses kaydını metne çevirir ve metni döndürür. Ajanı çalıştırmaz.
    """
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Lütfen bir ses dosyası yükleyin.")

    try:
        audio_content = await file.read()
        transcribed_text = audio_services.transcribe_audio(audio_content)
        return TranscribeResponse(text=transcribed_text)
    except Exception as e:
        print(f"Transcribe error: {e}")
        raise HTTPException(status_code=500, detail="Ses metne çevrilirken bir hata oluştu.")

# --- MEVCUT SESLİ INVOKE ENDPOINT'İ (DEĞİŞİKLİK YOK) ---
@router.post("/invoke/audio", response_model=conversation_schema.Conversation)
async def invoke_agent_with_audio(
    # ... (içerik aynı)
    classroom_id: int = Form(...),
    agent_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # ... (içerik aynı)
    audio_content = await file.read()
    transcribed_text = audio_services.transcribe_audio(audio_content)
    return run_agent_interaction(
        classroom_id=classroom_id,
        query=transcribed_text,
        agent_type=agent_type,
        db=db,
        current_user=current_user
    )
