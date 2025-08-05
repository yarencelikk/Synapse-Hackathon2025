from pydantic import BaseModel
from datetime import datetime
from typing import List

class Message(BaseModel):
    role: str
    content: str

class ConversationBase(BaseModel):
    messages: List[Message] = []

class Conversation(ConversationBase):
    id: int
    user_id: int
    classroom_id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True