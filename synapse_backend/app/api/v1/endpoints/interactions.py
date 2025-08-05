from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage

from app.schemas import interaction as interaction_schema
from app.schemas import conversation as conversation_schema
from app.agents.graph import app_graph
from app.db import models
from app.api.dependencies import get_db, get_current_user
from app import crud

router = APIRouter()

def run_agent_interaction(
    classroom_id: int,
    query: str,
    agent_type: str,
    db: Session,
    current_user: models.User
):
    """
    Hem metin hem de sesli istekler için ortak ajan çalıştırma mantığı.
    Bu fonksiyon, bir sorgu alır, sohbet geçmişini yönetir, ajanı çalıştırır ve sonucu kaydeder.
    """
    # 1. Derslik sahipliği kontrolü
    classroom = crud.get_classroom_by_id(db, classroom_id=classroom_id, user_id=current_user.id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found or access denied")

    # 2. Sohbet geçmişini veritabanından çek (yoksa oluştur)
    conversation = crud.get_or_create_conversation(
        db, user_id=current_user.id, classroom_id=classroom_id
    )
    
    # 3. Mevcut sohbet geçmişini LangChain mesaj nesnelerine dönüştür
    messages = []
    for msg in conversation.messages:
        if msg.get("role") == "user":
            messages.append(HumanMessage(content=msg.get("content")))
        else:
            messages.append(AIMessage(content=msg.get("content")))

    # 4. Kullanıcının yeni sorgusunu da geçmişe ekle
    messages.append(HumanMessage(content=query))

    # 5. Grafiğin başlangıç durumunu oluştur
    initial_state = {
        "messages": messages,
        "classroom_id": str(classroom_id),
        "agent_type": agent_type
    }

    # 6. LangGraph'i çalıştır ve nihai durumu al
    final_state = app_graph.invoke(initial_state)

    # 7. Nihai mesajları tekrar JSON uyumlu formata dönüştür
    final_messages_for_db = []
    for msg in final_state["messages"]:
        final_messages_for_db.append({
            "role": "user" if isinstance(msg, HumanMessage) else "assistant",
            "content": msg.content
        })

    # 8. Güncellenmiş sohbet geçmişini veritabanına kaydet
    updated_conversation = crud.update_conversation_messages(
        db, conversation=conversation, messages=final_messages_for_db
    )

    # 9. Güncellenmiş tüm konuşma geçmişini geri döndür (model: Conversation)
    return updated_conversation

@router.post("/invoke", response_model=conversation_schema.Conversation)
def invoke_agent_with_text(
    request: interaction_schema.InteractionRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Metin tabanlı ajan etkileşimini başlatır.
    """
    return run_agent_interaction(
        classroom_id=request.classroom_id,
        query=request.query,
        agent_type=request.agent_type,
        db=db,
        current_user=current_user
    )
