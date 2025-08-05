import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    // DÜZELTME: Sayfanın tamamını kaplayan grid yerine, ortalanmış bir kart yapısı oluşturuyoruz.
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 hero-bg p-4">
      <div className="w-full max-w-4xl lg:grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        
        {/* Sol Sütun: Görsel Alanı */}
        <div className="hidden lg:flex lg:items-center lg:justify-center p-8 bg-slate-900/50">
          <img
            src="/image1.jpg"
            alt="Synapse Tanıtım Görseli"
            className="max-w-sm w-full h-auto rounded-2xl shadow-2xl shadow-sky-900/30 object-cover"
          />
        </div>

        {/* Sağ Sütun: Form Alanı */}
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-12 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Link to="/" className="inline-flex items-center justify-center w-full gap-2 text-3xl font-bold text-white">
                <BrainCircuit className="text-sky-400" size={32} />
                Synapse
              </Link>
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">{title}</h2>
              <p className="mt-2 text-center text-sm text-gray-400">{description}</p>
            </div>
            {/* Formun etrafındaki ekstra kutuyu kaldırarak sadeleştiriyoruz */}
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
