import type { Classroom, ClassroomCreate,Conversation} from '../types';
import apiClient from '../lib/axios';

export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiClient.get('/classrooms/');
  return response.data;
};

export const getClassroomById = async (id: number): Promise<Classroom> => {
  const response = await apiClient.get(`/classrooms/${id}`);
  return response.data;
};

export const createClassroom = async (newClassroom: ClassroomCreate): Promise<Classroom> => {
  const response = await apiClient.post('/classrooms/', newClassroom);
  return response.data;
};

export const deleteClassroom = async (id: number): Promise<void> => {
  await apiClient.delete(`/classrooms/${id}`);
};

// YENİ FONKSİYON
export const getConversationHistory = async (classroomId: number): Promise<Conversation> => {
  const response = await apiClient.get(`/classrooms/${classroomId}/history`);
  return response.data;
};