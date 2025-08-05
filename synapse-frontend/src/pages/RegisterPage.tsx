// Dosya: src/pages/RegisterPage.tsx

import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/authAPi';
import AuthLayout from '../components/layout/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err: any) => {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate({ email, password });
  };

  return (
    <AuthLayout
      title="Yeni hesap oluşturun"
      description="Synapse ile öğrenmenin geleceğine adım atın."
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
            disabled={registerMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-400">
          Zaten bir hesabınız var mı?{' '}
          <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">
            Giriş yapın
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
