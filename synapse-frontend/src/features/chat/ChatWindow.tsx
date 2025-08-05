// Dosya: src/features/chat/ChatWindow.tsx (GÜNCELLENDİ)

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import MessageBubble from './MessageBubble';
import { Bot } from 'lucide-react';

interface ChatWindowProps {
  history: ChatMessage[];
  isResponding: boolean;
}

export default function ChatWindow({ history, isResponding }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {history.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {isResponding && (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-600 dark:bg-gray-600">
            <Bot size={20} className="text-white" />
          </div>
          <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
             <div className="typing-indicator">
                <span></span><span></span><span></span>
             </div>
          </div>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
}
