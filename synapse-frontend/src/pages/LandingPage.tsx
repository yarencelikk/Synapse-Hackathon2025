import { Link } from 'react-router-dom';
import { BookOpen, BrainCircuit, MessageSquareQuote, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- Header Bileşeni (Değişiklik yok) ---
const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="text-sky-400" />
          Synapse
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-sky-400 transition-colors">Özellikler</a>
          <Link to="/login" className="text-gray-300 hover:text-sky-400 transition-colors">Giriş Yap</Link>
          <Link to="/register" className="bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-sky-600 transition-colors shadow-md hover:shadow-sky-500/50">
            Hemen Başla
          </Link>
        </nav>
      </div>
    </header>
  );
};

// --- Hero Bölümü Bileşeni (Değişiklik yok) ---
const HeroSection = () => (
  <section className="h-screen w-full flex flex-col items-center justify-center text-center text-white relative overflow-hidden hero-bg">
    <div className="absolute inset-0 bg-black/30"></div>
    <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
      <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="w-24 h-24 mb-8 rounded-full bg-sky-500/20 flex items-center justify-center relative">
          <BrainCircuit size={48} className="text-sky-400" />
          <div className="absolute inset-0 rounded-full glow-effect opacity-70"></div>
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight fade-in-up" style={{ animationDelay: '0.4s' }}>
        Notlarınızın Potansiyelini <br />
        <span className="text-sky-400">Açığa Çıkarın</span>
      </h1>
      <p className="mt-6 text-lg text-gray-300 max-w-2xl fade-in-up" style={{ animationDelay: '0.6s' }}>
        Yapay zeka destekli öğrenme asistanınızla tanışın. Synapse, statik dokümanlarınızı interaktif bir bilgi evrenine dönüştürür.
      </p>
      <div className="mt-10 fade-in-up" style={{ animationDelay: '0.8s' }}>
        <Link to="/register" className="bg-sky-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-400/50">
          Öğrenme Devrimine Katılın
        </Link>
      </div>
    </div>
    <a href="#features" className="absolute bottom-10 animate-bounce">
      <ChevronDown size={32} />
    </a>
  </section>
);

// --- Özellik Kartı Bileşeni (Değişiklik yok) ---
const FeatureCard = ({ icon, title, description }: { icon: React.JSX.Element, title: string, description: string }) => (
  <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-sky-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-900/50">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// --- Özellikler Bölümü (Değişiklik yok) ---
const FeaturesSection = () => (
  <section id="features" className="py-24 bg-slate-900 text-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold">Öğrenmenin Geleceği</h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Synapse, öğrenme materyallerinizle aranızdaki engelleri kaldırır ve size süper güçler verir.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="w-12 h-12 text-sky-400" />}
          title="Akıllı Doküman Analizi"
          description="Tüm ders materyallerini tek bir yere yükle. Synapse, içeriği anlar, anahtar konuları belirler ve senin için her şeyi organize eder."
        />
        <FeatureCard 
          icon={<BrainCircuit className="w-12 h-12 text-sky-400" />}
          title="Kişiselleştirilmiş Araçlar"
          description="Sana özel sınavlar, özetler ve kavram haritaları ile öğrendiklerini pekiştir. Zayıf olduğun konulara odaklan, daha verimli çalış."
        />
        <FeatureCard 
          icon={<MessageSquareQuote className="w-12 h-12 text-sky-400" />}
          title="Etkileşimli AI Ajanları"
          description="Materyallerinle sohbet et. Anlamadığın bir konsepti sor, bir senaryoyu canlandır veya Sokratik bir sorgulama ile konunun derinliklerine in."
        />
      </div>
    </div>
  </section>
);

// --- YENİ VE DETAYLI FOOTER BİLEŞENİ ---
const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800 text-gray-400">
    <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
      {/* Hakkımızda Sütunu */}
      <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-8">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <BrainCircuit className="text-sky-400" />
          Synapse
        </Link>
        <p className="text-sm">Öğrenme şeklinizi dönüştüren yapay zeka destekli platform.</p>
      </div>

      {/* Ürünler Sütunu */}
      <div>
        <h4 className="font-semibold text-white mb-4">Ürün</h4>
        <ul className="space-y-3">
          <li><a href="#features" className="hover:text-sky-400 transition-colors">Özellikler</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">Fiyatlandırma</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">Güvenlik</a></li>
        </ul>
      </div>

      {/* Kaynaklar Sütunu */}
      <div>
        <h4 className="font-semibold text-white mb-4">Kaynaklar</h4>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-sky-400 transition-colors">Blog</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">Yardım Merkezi</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">API</a></li>
        </ul>
      </div>

      {/* Şirket Sütunu */}
      <div>
        <h4 className="font-semibold text-white mb-4">Şirket</h4>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-sky-400 transition-colors">Hakkımızda</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">Kariyer</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">İletişim</a></li>
        </ul>
      </div>

      {/* Yasal Sütunu */}
      <div>
        <h4 className="font-semibold text-white mb-4">Yasal</h4>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-sky-400 transition-colors">Gizlilik Politikası</a></li>
          <li><a href="#" className="hover:text-sky-400 transition-colors">Kullanım Koşulları</a></li>
        </ul>
      </div>
    </div>
    <div className="bg-slate-950">
      <div className="container mx-auto px-6 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Synapse. Tüm hakları saklıdır.
      </div>
    </div>
  </footer>
);

// --- Ana Tanıtım Sayfası Bileşeni ---
export default function LandingPage() {
  return (
    <div className="bg-slate-950 font-sans text-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
