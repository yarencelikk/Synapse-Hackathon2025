// Dosya: src/pages/LoginPage.tsx

import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authAPi';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../components/layout/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.access_token);
      navigate('/app');
    },
    onError: () => {
      setError('E-posta veya parola hatalı. Lütfen tekrar deneyin.');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ username: email, password });
  };

  return (
    <AuthLayout
      title="Hesabınıza giriş yapın"
      description="Öğrenme devrimine kaldığınız yerden devam edin."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-posta Adresi</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Parola</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-400">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">
            Hemen kaydolun
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}