import apiClient from '../lib/axios';
import type { Document, QuickSummaryResponse } from '../types';
// --- DOKÜMAN API FONKSİYONLARI ---
export const uploadDocument = async (classroomId: number, file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('classroom_id', classroomId.toString());
  formData.append('file', file);

  const response = await apiClient.post('/documents/', formData, {
    headers: {
      // Dosya yükleme için header'ı değiştiriyoruz.
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// YENİ FONKSİYON
export const deleteDocument = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/${id}`);
};

// YENİ FONKSİYON
export const getQuickSummary = async (documentId: number): Promise<QuickSummaryResponse> => {
  const response = await apiClient.get(`/documents/${documentId}/quick-summary`);
  return response.data;
};
