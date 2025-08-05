// Dosya: src/features/documents/DocumentList.tsx (GÜNCELLENDİ)

import type { Document } from '../../types';
import { FileText, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import QuickSummaryAccordion from './QuickSummaryAccordion';

interface DocumentListProps {
  documents: Document[];
  onDelete: (docId: number) => void;
}

const statusStyles = {
  ready: { icon: <FileText size={16} className="text-green-500 dark:text-green-400" />, text: 'Hazır' },
  processing: { icon: <Clock size={16} className="text-yellow-500 dark:text-yellow-400" />, text: 'İşleniyor...' },
  failed: { icon: <AlertTriangle size={16} className="text-red-500 dark:text-red-400" />, text: 'Hata' },
};

export default function DocumentList({ documents, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">Bu derslikte henüz doküman yok.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-3">Yüklenmiş Dokümanlar</h3>
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li key={doc.id} className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-md border border-gray-400 dark:border-slate-700">
            <div className="flex justify-between items-center group">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  {statusStyles[doc.status].icon}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{doc.file_name}</span>
              </div>
              <button 
                onClick={() => onDelete(doc.id)}
                className="p-1 rounded-md text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Dokümanı Sil"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {doc.status === 'ready' && <QuickSummaryAccordion documentId={doc.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
