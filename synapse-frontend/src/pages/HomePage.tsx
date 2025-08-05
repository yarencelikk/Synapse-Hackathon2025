import { HelpCircle, ListChecks, Bot, Map, MessageSquarePlus, BookPlus, UploadCloud, ArrowLeft } from 'lucide-react';
import type { ReactElement } from 'react';

// StepCard bileşenine açık/koyu mod stilleri eklendi
const StepCard = ({ icon, title, description, delay }: { icon: ReactElement, title: string, description: string, delay: string }) => (
  <div 
    className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-gray-400 dark:border-slate-700 fade-in-up h-full flex flex-col"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center border border-sky-200 dark:border-sky-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">{description}</p>
  </div>
);

// AgentCard bileşenine açık/koyu mod stilleri eklendi
const AgentCard = ({ icon, title, description, example, className = '' }: { icon: ReactElement, title: string, description: string, example: string, className?: string }) => (
  <div 
    className={`bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-gray-400 dark:border-slate-700 h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2 ${className}`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center border border-sky-200 dark:border-sky-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{description}</p>
    <div className="mt-4 pt-4 border-t border-gray-400 dark:border-slate-700">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Örnek Kullanım</p>
      <p className="text-sm text-sky-600 dark:text-sky-300/80 font-mono bg-gray-100 dark:bg-slate-900 p-2 rounded-md">"{example}"</p>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        {/* Ana Başlık */}
        <div className="text-center fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Synapse'e Hoş Geldiniz!
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Öğrenme potansiyelinizi ortaya çıkarmaya hazır olun. Başlamak için sağ menüden bir derslik seçin veya yeni bir tane oluşturun.
          </p>
        </div>

        {/* DEĞİŞİKLİK: Asistanları Tanıtım Bölümü öne alındı */}
        <div className="mt-16 w-full">
          <h3 className="text-2xl font-bold text-sky-400 mb-8 text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
            Asistanlarınızla Tanışın
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
              <AgentCard
                icon={<HelpCircle className="h-6 w-6 text-sky-400" />}
                title="Doğrudan Cevap"
                description="En sık kullanacağınız asistan. Belgelerinizdeki bilgilere dayalı sorularınıza hızlı ve kesin yanıtlar alın.
Ayrıca, diğer asistanların verdiği cevaplar üzerinden detaylı soru sormak veya sohbeti netleştirmek için de “Doğrudan Cevap” ile devam edin."
                example="Bir konunun ana fikri nedir?"
              />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
              <AgentCard
                icon={<ListChecks className="h-6 w-6 text-sky-400" />}
                title="Sınav Hazırlayıcı"
                description="Belirttiğiniz bir konudan, kendinizi test etmeniz için alıştırma soruları üretin."
                example="Bu bölümden bana bir soru hazırla."
              />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
              <AgentCard
                icon={<Bot className="h-6 w-6 text-sky-400" />}
                title="Özetleyici"
                description="Belgedeki bilgileri kullanarak, sorduğunuz konu başlığının öz ve anlaşılır bir özetini oluşturur."
                example="Bu konuyu detaylıca özetle."
              />
            </div>
    
            <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
              <AgentCard
                icon={<Bot className="h-6 w-6 text-sky-400" />}
                title="Sokratik Sorgulayıcı"
                description="Cevabı doğrudan vermek yerine, sizi düşünmeye ve cevabı kendi kendinize bulmaya yönelten sorular sorun."
                example="Bu konseptin temel amacı nedir?"
              />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
              <AgentCard
                icon={<Map className="h-6 w-6 text-sky-400" />}
                title="Kavram Haritacısı"
                description="Bir konunun ana ve alt başlıkları arasındaki ilişkileri gösteren görsel bir harita oluşturun."
                example="Bu bölümün kavram haritasını oluştur."
              />
            </div>
            <div className="fade-in-up" style={{ animationDelay: '0.9s' }}>
               <AgentCard
                icon={<MessageSquarePlus className="h-6 w-6 text-sky-400" />}
                title="Simülasyon"
                description="Belgelerdeki bilgilere dayanarak bir senaryoyu canlandırın veya bir rolü üstlenin."
                example="Bir tarihçi olarak bu olayı analiz et."
              />
            </div>
          </div>
        </div>

        {/* DEĞİŞİKLİK: "Nasıl Başlarım?" Bölümü sona alındı */}
        <div className="mt-16 w-full">
          <h3 className="text-2xl font-bold text-sky-400 mb-8 text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
            Nasıl Başlarım?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <StepCard
              icon={<BookPlus className="h-6 w-6 text-sky-400" />}
              title="1. Derslik Oluştur"
              description="Sol menüdeki 'Yeni Derslik' butonu ile konularınıza özel çalışma alanları yaratın."
              delay="0.5s"
            />
            <StepCard
              icon={<UploadCloud className="h-6 w-6 text-sky-400" />}
              title="2. Doküman Yükle"
              description="Oluşturduğunuz dersliğe PDF veya DOCX formatındaki ders notlarınızı yükleyin."
              delay="0.7s"
            />
            <StepCard
              icon={<MessageSquarePlus className="h-6 w-6 text-sky-400" />}
              title="3. Sohbete Başla"
              description="Yapay zeka asistanıyla sohbet ederek notlarınız hakkında sorular sorun ve daha fazlasını keşfedin."
              delay="0.9s"
            />
          </div>
        </div>

        {/* Eylem Çağrısı */}
        <div className="mt-16 fade-in-up" style={{ animationDelay: '1.1s' }}>
          <p className="text-gray-500 flex items-center justify-center">
            <ArrowLeft className="inline-block mr-2" size={16} />
            Hemen menüden bir derslik seçerek başlayın
          </p>
        </div>
      </div>
    </div>
  );
}
