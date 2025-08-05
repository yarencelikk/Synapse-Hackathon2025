from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import (
    retrieve_documents, 
    direct_answer_node, 
    socratic_questioner_node,
    quiz_generator_node,
    summarizer_node,
    simulation_node,
    mind_mapper_node # Yeni ajanı import et
)

def route_after_retrieval(state: AgentState) -> str:
    print("---KARAR NOKTASI: Ajan Yönlendiriliyor---")
    agent_type = state.get("agent_type", "direct_answer")
    
    if agent_type == "socratic_questioner": return "socratic_questioner"
    if agent_type == "quiz_generator": return "quiz_generator"
    if agent_type == "summarizer": return "summarizer"
    if agent_type == "simulation": return "simulation"
    if agent_type == "mind_mapper": return "mind_mapper" # Yeni yönlendirme kuralı
    return "direct_answer"

workflow = StateGraph(AgentState)

# Düğümleri ekle
workflow.add_node("retriever", retrieve_documents)
workflow.add_node("direct_answer", direct_answer_node)
workflow.add_node("socratic_questioner", socratic_questioner_node)
workflow.add_node("quiz_generator", quiz_generator_node)
workflow.add_node("summarizer", summarizer_node)
workflow.add_node("simulation", simulation_node)
workflow.add_node("mind_mapper", mind_mapper_node) # Yeni düğümü grafa ekle

workflow.set_entry_point("retriever")

# Koşullu Yönlendirme
workflow.add_conditional_edges(
    "retriever",
    route_after_retrieval,
    {
        "direct_answer": "direct_answer",
        "socratic_questioner": "socratic_questioner",
        "quiz_generator": "quiz_generator",
        "summarizer": "summarizer",
        "simulation": "simulation",
        "mind_mapper": "mind_mapper" # Yeni yolu haritaya ekle
    }
)

# Bitiş Noktaları
workflow.add_edge("direct_answer", END)
workflow.add_edge("socratic_questioner", END)
workflow.add_edge("quiz_generator", END)
workflow.add_edge("summarizer", END)
workflow.add_edge("simulation", END)
workflow.add_edge("mind_mapper", END) # Yeni ajanı sona bağla

app_graph = workflow.compile()