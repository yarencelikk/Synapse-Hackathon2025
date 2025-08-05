from google.cloud import speech
import os
from app.core.config import settings

# Google Cloud istemcisini başlat
# GOOGLE_APPLICATION_CREDENTIALS ortam değişkeni otomatik olarak kullanılır.
speech_client = speech.SpeechClient()

def transcribe_audio(audio_content: bytes) -> str:
    """
    Verilen ses dosyasının içeriğini metne çevirir.
    """
    print("Google Speech-to-Text API'sine istek gönderiliyor...")
    audio = speech.RecognitionAudio(content=audio_content)
    
    # Tarayıcıdan gelen ses formatına (genellikle WEBM/Opus) ve Türkçe diline göre yapılandırma
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
        sample_rate_hertz=48000, # Tarayıcı mikrofonları için yaygın bir değer
        language_code="tr-TR",   # Türkçe dil kodu
        model="default"          # Standart, genel amaçlı model
    )

    response = speech_client.recognize(config=config, audio=audio)

    if not response.results or not response.results[0].alternatives:
        raise ValueError("Ses metne çevrilemedi veya boş.")

    transcript = response.results[0].alternatives[0].transcript
    print(f"Metne çevrilen ses: '{transcript}'")
    return transcript