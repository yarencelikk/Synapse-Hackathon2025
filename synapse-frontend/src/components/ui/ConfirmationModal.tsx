import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isPending: boolean;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, isPending }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    // Arka planı yarı saydam ve bulanık yapıyoruz
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Pencerenin kendisi */}
      <div className="bg-slate-800/80 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex items-start gap-4">
          {/* Sol taraftaki kırmızı uyarı ikonu */}
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10 border border-red-800">
            <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
          </div>
          <div className="mt-0 text-left flex-1">
            {/* Başlık */}
            <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
              {title}
            </h3>
            {/* Açıklama Mesajı */}
            <div className="mt-2">
              <p className="text-large text-gray-400">
                {message}
              </p>
            </div>
          </div>
        </div>
        {/* Butonların olduğu bölüm */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white font-semibold disabled:opacity-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Siliniyor...' : 'Sil'}
          </button>
        </div>
      </div>
    </div>
  );
}
