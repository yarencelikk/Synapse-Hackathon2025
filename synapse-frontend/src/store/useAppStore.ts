// Dosya: src/store/useAppStore.ts (GÜNCELLENDİ)

import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface AppState {
  chatHistory: ChatMessage[];
  isResponding: boolean;
  historyVersion: number; // YENİ: Sohbet geçmişini yenilemek için bir tetikleyici
  setChatHistory: (history: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsResponding: (isResponding: boolean) => void;
  incrementHistoryVersion: () => void; // YENİ: Tetikleyiciyi artıran fonksiyon
}

export const useAppStore = create<AppState>((set) => ({
  chatHistory: [],
  isResponding: false,
  historyVersion: 0,
  setChatHistory: (history) => set({ chatHistory: history }),
  addMessage: (message) => set((state) => ({ 
    chatHistory: [...state.chatHistory, message] 
  })),
  setIsResponding: (isResponding) => set({ isResponding }),
  incrementHistoryVersion: () => set((state) => ({ historyVersion: state.historyVersion + 1 })),
}));