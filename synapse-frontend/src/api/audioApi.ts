import apiClient from '../lib/axios';
import type { Conversation } from '../types';

// Bu fonksiyon artık kullanılmayacak ama referans olarak kalabilir.
export const invokeAgentWithAudio = async (
  classroomId: number,
  agentType: string,
  audioBlob: Blob
): Promise<Conversation> => {
  const formData = new FormData();
  formData.append('classroom_id', classroomId.toString());
  formData.append('agent_type', agentType);
  formData.append('file', audioBlob, 'recording.webm');

  const response = await apiClient.post('/audio/invoke/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// YENİ FONKSİYON
export const transcribeAudio = async (audioBlob: Blob): Promise<{ text: string }> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  const response = await apiClient.post('/audio/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
