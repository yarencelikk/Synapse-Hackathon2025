from typing import TypedDict, List, Literal, Dict, Any, Annotated
# LangGraph'in mesajları otomatik olarak yönetmesini sağlayan özel aracı import ediyoruz.
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    query: str
    classroom_id: str
    agent_type: Literal["direct_answer", "socratic_questioner", "quiz_generator", "summarizer", "simulation", "mind_mapper"] | None
    retrieved_docs: List[Dict[str, Any]]
    
    # 'final_answer' artık kullanılmayacak, çünkü cevaplar 'messages' listesine eklenecek.
    # final_answer: str 
    
    # Bu özel yapı, LangGraph'e bu listeye eklenen yeni mesajları
    # eskilere ekleyerek bir sohbet geçmişi tutmasını söyler.
    messages: Annotated[list, add_messages]