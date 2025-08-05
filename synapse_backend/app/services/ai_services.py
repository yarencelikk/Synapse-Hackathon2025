import google.generativeai as genai
import json
from app.core.config import settings

# Modeli bir kez yapılandırıp yeniden kullanabiliriz
try:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    llm = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"Google AI yapılandırılamadı: {e}")
    llm = None

def generate_summary_and_headings(document_text: str) -> dict | None:
    """
    Verilen doküman metninden kısa bir özet ve ana başlıkları çıkarır.
    Çıktıyı yapısal bir formatta (JSON) almak için özel bir prompt kullanır.
    """
    if not llm:
        print("LLM başlatılamadığı için özet oluşturma atlandı.")
        return None

    prompt = f"""
    Aşağıda bir dokümanın tam metni verilmiştir. Bu metne dayanarak, aşağıdaki iki görevi yerine getir ve çıktıyı JSON formatında sağla:
    1.  'summary' anahtarı altında, dokümanın ana konusunu ve amacını açıklayan çok kısa, tek paragraflık bir özet yaz.
    2.  'headings' anahtarı altında, dokümandaki ana bölüm veya kısım başlıklarını içeren bir liste (array) oluştur.

    METİN:
    ---
    {document_text[:15000]} 
    ---

    JSON ÇIKTISI:
    """
    
    try:
        response = llm.generate_content(prompt)
        # Gemini'nin çıktısındaki JSON bloğunu temizleyip parse ediyoruz
        json_response_str = response.text.strip().replace('```json', '').replace('```', '')
        data = json.loads(json_response_str)
        
        # Beklenen anahtarların varlığını kontrol et
        if 'summary' in data and 'headings' in data:
            return data
        return None
    except Exception as e:
        print(f"Özet ve başlıklar oluşturulurken bir hata oluştu: {e}")
        return None