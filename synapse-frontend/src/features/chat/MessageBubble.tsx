// Dosya: src/features/chat/MessageBubble.tsx (GÜNCELLENDİ)

import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types';
import MermaidChart from './MermaidChart';

interface MessageBubbleProps {
  message: ChatMessage;
}

const isMermaidCode = (code: string) => {
  return code.trim().startsWith('graph');
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const contentIsMermaid = !isUser && isMermaidCode(message.content);

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-sky-500' : 'bg-slate-600 dark:bg-gray-600'}`}>
        {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </div>
      
      <div className={`max-w-none rounded-lg p-3 ${
          isUser 
            ? 'bg-sky-100 dark:bg-sky-800' 
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        {contentIsMermaid ? (
          <MermaidChart chartCode={message.content} />
        ) : (
          // DÜZELTME: prose sınıflarına açık/koyu mod metin renkleri eklendi.
          <div className="prose prose-sm prose-slate dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}