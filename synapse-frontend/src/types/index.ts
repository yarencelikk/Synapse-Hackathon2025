// --- TEMEL VERİ MODELLERİ ---

export interface Document {
  id: number;
  file_name: string;
  status: 'processing' | 'ready' | 'failed';
  classroom_id: number;
}

export interface Classroom {
  id: number;
  name: string;
  documents: Document[];
}

export interface ClassroomCreate {
  name: string;
}

// --- KİMLİK DOĞRULAMA (AUTH) MODELLERİ ---

export interface User {
  id: number;
  email: string;
  is_active: boolean; // Backend modelimizdeki is_active'i de ekleyelim
}

export interface UserCreate {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// --- SOHBET VE ETKİLEŞİM (INTERACTION) MODELLERİ ---

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Backend'deki Conversation modeline karşılık gelen tip
export interface Conversation {
  id: number;
  user_id: number;
  classroom_id: number;
  messages: ChatMessage[];
  created_at: string; // Tarihleri string olarak almak daha güvenlidir
  updated_at?: string;
}

// Backend'e ajan çalıştırma isteği gönderirken kullanılacak model
// (Artık chat_history içermiyor, çünkü backend bunu DB'den alıyor)
export interface InteractionRequest {
  classroom_id: number;
  query: string;
  agent_type: string;
}

// Backend'in ajan çalıştırma sonrası döndürdüğü yanıt tipi
export type InteractionResponse = Conversation;
// YENİ TİP: Hızlı özet yanıtının formatı
export interface QuickSummaryResponse {
  summary: string;
  headings: string[];
}
