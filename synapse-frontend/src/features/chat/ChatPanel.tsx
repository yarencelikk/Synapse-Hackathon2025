// Dosya: src/features/chat/ChatPanel.tsx (GÜNCELLENDİ)

import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../../store/useAppStore';
import { invokeAgent } from '../../api/interactionApi';
import { getConversationHistory } from '../../api/classroomApi';
import ChatWindow from './ChatWindow';
import ChatInputBar from './ChatInputBar';
import { useEffect } from 'react';

export default function ChatPanel() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const id = Number(classroomId);
  const queryClient = useQueryClient();
  
  const { chatHistory, addMessage, setChatHistory, isResponding, setIsResponding } = useAppStore();

  const { data: conversation, isLoading } = useQuery({
    queryKey: ['history', id],
    queryFn: () => getConversationHistory(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (conversation) {
      setChatHistory(conversation.messages);
    } else {
      setChatHistory([]);
    }
  }, [conversation, setChatHistory]);

  const agentMutation = useMutation({
    mutationFn: invokeAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', id] });
    },
    onError: (error) => {
      console.error("Agent invocation error:", error);
      addMessage({ role: 'assistant', content: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    },
    onSettled: () => {
      setIsResponding(false);
    }
  });

  const handleSendMessage = (query: string, agent: string) => {
    if (!classroomId) return;
    addMessage({ role: 'user', content: query });
    setIsResponding(true);
    agentMutation.mutate({
      classroom_id: id,
      query: query,
      agent_type: agent,
    });
  };

  return (
    // DÜZELTME: Hem açık hem de koyu mod için arka plan ve çerçeve renkleri eklendi.
    <div className="bg-white dark:bg-slate-900 rounded-xl flex flex-col h-full border border-gray-400 dark:border-slate-800">
      <div className="p-4 border-b border-gray-400 dark:border-slate-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sohbet Asistanı</h3>
      </div>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">Sohbet geçmişi yükleniyor...</div>
      ) : (
        <ChatWindow history={chatHistory} isResponding={isResponding} />
      )}
      <ChatInputBar onSendMessage={handleSendMessage} isResponding={isResponding} />
    </div>
  );
}