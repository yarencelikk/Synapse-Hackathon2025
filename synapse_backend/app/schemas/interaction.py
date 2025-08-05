from pydantic import BaseModel
from typing import List, Dict, Any, Literal

class InteractionRequest(BaseModel):
    classroom_id: int
    query: str
    agent_type: Literal[
        "direct_answer", 
        "socratic_questioner", 
        "quiz_generator", 
        "summarizer",
        "simulation",
        "mind_mapper"
    ] = "direct_answer"