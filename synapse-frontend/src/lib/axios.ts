import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor: Her istek gönderilmeden önce araya girer.
apiClient.interceptors.request.use(
  (config) => {
    // Zustand store'dan token'ı al
    const token = useAuthStore.getState().token;
    // Eğer token varsa, Authorization header'ına ekle
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
