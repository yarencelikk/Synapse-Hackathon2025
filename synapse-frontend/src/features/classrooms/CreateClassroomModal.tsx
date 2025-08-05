import { type FormEvent, useState } from "react";
import { BookPlus } from "lucide-react";

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isCreating: boolean;
}

export default function CreateClassroomModal({ isOpen, onClose, onSubmit, isCreating }: CreateClassroomModalProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName(''); // Formu temizle
    }
  };

  return (
    // Arka planı yarı saydam ve bulanık yapıyoruz
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Pencerenin kendisi */}
      <div className="bg-slate-800/80 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-900/50 flex items-center justify-center border border-sky-800">
            <BookPlus className="h-6 w-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Yeni Derslik Oluştur</h2>
            <p className="text-sm text-gray-400">Yeni bir çalışma alanı oluşturun.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="classroom-name" className="block text-sm font-medium text-gray-300 mb-1">
              Derslik Adı
            </label>
            <input
              id="classroom-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="örn: Veri Yapıları ve Algoritmalar"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={isCreating}
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isCreating} 
              className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white font-semibold disabled:opacity-50 transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={isCreating || !name.trim()} 
              className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
