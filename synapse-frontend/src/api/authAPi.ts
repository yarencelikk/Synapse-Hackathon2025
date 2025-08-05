import apiClient from '../lib/axios';
import type { User, UserCreate, Token } from '../types';

// Backend'in /token endpoint'inin beklediği özel format
export interface LoginCredentials {
  username: string; // E-posta adresi bu alana gelecek
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<Token> => {
  // Axios, form verisini otomatik olarak doğru formata çevirecektir.
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await apiClient.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const registerUser = async (newUser: UserCreate): Promise<User> => {
  const response = await apiClient.post('/users/', newUser);
  return response.data;
};
