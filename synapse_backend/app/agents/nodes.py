import google.generativeai as genai
from langchain_core.messages import HumanMessage, AIMessage
from app.agents.state import AgentState
from app.services import vector_store_manager
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)
llm = genai.GenerativeModel('gemini-2.5-flash')

def format_chat_history(messages: list) -> str:
    """Sohbet geçmişini LLM'in anlayacağı basit bir metin formatına dönüştürür."""
    if not messages:
        return ""
    # Son kullanıcı sorusu hariç geçmişi formatla
    history_str = "\n".join([f"{'Kullanıcı' if isinstance(msg, HumanMessage) else 'Asistan'}: {msg.content}" for msg in messages[:-1]])
    return f"Önceki Konuşma Geçmişi:\n{history_str}\n"

def format_context(docs: list) -> str:
    return "\n\n---\n\n".join([doc['content'] for doc in docs])

def retrieve_documents(state: AgentState) -> dict:
    print("---DÜĞÜM: Belgeler Geri Getiriliyor---")
    # En son kullanıcı mesajını al
    query = state["messages"][-1].content
    classroom_id = state["classroom_id"]
    collection_name = f"classroom_{classroom_id}"
    agent_type = state.get("agent_type")

    if agent_type in ["summarizer", "simulation", "mind_mapper"]: n_results = 15
    else: n_results = 5
        
    retrieved_docs = vector_store_manager.query_vector_store(collection_name, query, n_results=n_results)
    print(f"{len(retrieved_docs)} adet ilgili belge parçası bulundu.")
    
    return {"retrieved_docs": retrieved_docs, "query": query}

# --- Ajan Düğümleri (Prompt'lar Güncellendi) ---

def base_agent_node(state: AgentState, prompt_template: str) -> dict:
    """Tüm ajanlar için ortak bir temel fonksiyon."""
    print(f"---DÜĞÜM: {state.get('agent_type')} Ajanı---")
    
    chat_history = format_chat_history(state["messages"])
    query = state["query"]
    retrieved_docs = state["retrieved_docs"]

    if not retrieved_docs:
        return {"messages": [AIMessage(content="Bu konu hakkında işlem yapmak için yeterli belge bilgisi bulamadım.")]}

    context = format_context(retrieved_docs)
    
    prompt = prompt_template.format(chat_history=chat_history, context=context, query=query)
    
    response = llm.generate_content(prompt)
    # Cevabı AIMessage olarak döndürerek LangGraph'in geçmişe eklemesini sağlıyoruz.
    return {"messages": [AIMessage(content=response.text)]}

# --- Her Ajan İçin Prompt Şablonları ---

direct_answer_prompt = """{chat_history}
Sen, yalnızca sana sağlanan belgelere dayanarak soruları yanıtlayan bir uzmansın. Cevabın öncelikli olarak bu belgelere dayanmalıdır.

- Öncelikle, sadece yukarıdaki BELGELER'de verilen bilgilerle soruyu eksiksiz ve açık bir şekilde yanıtla.
- Eğer aranan bilgi BELGELER'de yer almıyorsa, cevabına şu cümleyle başla:  
"Aradığınız bilgiyi sağlanan belgede bulamadım. Ancak güncel internet kaynaklarına ve kendi bilgi birikimime göre şöyle bir yanıt verebilirim:"
- Ardından, kendi bilgi ve analizine dayanarak soruyu en iyi şekilde yanıtla.
- Cevabın, anlaşılır ve güven verici bir dille, gerektiğinde gerekçesiyle birlikte olmalıdır.

BELGELER:
{context}
SON KULLANICI SORUSU:
{query}
CEVAP:
"""

socratic_questioner_prompt = """{chat_history}
Sen bir Sokratik öğretmensin. Görevin, kullanıcının son sorusunu doğrudan yanıtlamak DEĞİLDİR. Bunun yerine, sağlanan BELGELER'e ve konuşma geçmişine dayanarak, kullanıcıyı cevabı kendi kendine bulmaya yöneltecek bir tane derin ve yol gösterici soru sormaktır.
BELGELER:
{context}
KULLANICININ SON İLGİ ALANI/SORUSU:
{query}
SOKRATİK SORU:"""

quiz_generator_prompt = """{chat_history}
Sen bir sınav hazırlama uzmanısın. Görevin, sağlanan BELGELER'e dayanarak, kullanıcının belirttiği son konuyla ilgili aşağıdaki formatta sınav soruları hazırlamaktır:

- 4 adet, 4 şıklı ve tek doğru cevaba sahip çoktan seçmeli test sorusu oluştur. Şıklar A) B) C) D) olup alt alta sırasıyla yaz.
- 4 adet boşluk doldurma sorusu oluştur.
- 4 adet doğru/yanlış sorusu oluştur.

Her soru, tamamen sağlanan BELGELER'e dayalı olmalı ve açık, anlaşılır şekilde yazılmalı.

Cevabının en sonunda, her bir sorunun doğru cevabını ve gerekirse çok kısa bir açıklamasını içeren bir cevap anahtarı oluştur.

BELGELER:
{context}
SINAV KONUSU:
{query}
SINAV SORULARI:
"""

summarizer_prompt = """{chat_history}
Sen bir metin özetleme uzmanısın. Görevin, sağlanan BELGELER'e dayanarak kullanıcının belirttiği son konu hakkında anlaşılır bir özet hazırlamaktır.
BELGELER:
{context}
ÖZETLENECEK KONU:
{query}
ÖZET:"""

# 🔁 YENİ: simulation_prompt – ESKİ HALİYLE!
simulation_prompt = """{chat_history}
Sen, sana sunulan belgelerdeki bilgilere dayanarak karmaşık senaryoları analiz eden ve vaka çalışmaları yürüten bir simülasyon uzmanısın. 
Görevin, kullanıcının verdiği 'SENARYO/KOMUT'u, SADECE ve SADECE 'BELGELER' bölümündeki verileri kullanarak canlandırmak ve analiz etmektir. 
Belgelerde olmayan hiçbir bilgiyi varsayma veya dışarıdan ekleme. Mantıksal çıkarımlar yaparken dayanak noktanı belgelerden göstermelisin. 
Bir rolü canlandırıyorsan, o rolün ağzından konuş. Bir analiz yapıyorsan, adım adım düşünerek bulgularını sun.

BELGELER:
{context}

SENARYO/KOMUT:
{query}

SİMÜLASYON ÇIKTISI:"""

mind_mapper_prompt = """{chat_history}
Sen, metinleri analiz ederek kavramlar arası ilişkileri bulan bir konsept analiz uzmanısın.

- Öncelikli görevin, aşağıda verilen BELGELER'den, kullanıcının belirttiği 'ANA KONU' etrafında temel kavramları ve bunların birbirleriyle olan ilişkilerini tespit etmektir.
- Sadece BELGELER'deki bilgilere dayanarak, geçerli bir Mermaid.js kodu üret.
- Çıktın SADECE geçerli bir Mermaid.js kodu olmalı, ek açıklama veya yorum içermemeli.
- Cevabının en altına şu yönlendirme metnini mutlaka ekle:
"Kavram haritasını görmek için: https://mermaid.live/ adresine gidin ve yukarıdaki cevabı eksiksiz şekilde 'Code' bölümüne yapıştırın."

BELGELER:
{context}
ANA KONU:
{query}
MERMAID.JS KODU:
"""

# --- Düğüm Fonksiyonları ---
def direct_answer_node(state: AgentState): return base_agent_node(state, direct_answer_prompt)
def socratic_questioner_node(state: AgentState): return base_agent_node(state, socratic_questioner_prompt)
def quiz_generator_node(state: AgentState): return base_agent_node(state, quiz_generator_prompt)
def summarizer_node(state: AgentState): return base_agent_node(state, summarizer_prompt)
def simulation_node(state: AgentState): return base_agent_node(state, simulation_prompt)
def mind_mapper_node(state: AgentState): return base_agent_node(state, mind_mapper_prompt)
