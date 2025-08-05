// Dosya: src/features/documents/QuickSummaryAccordion.tsx (GÜNCELLENDİ)

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuickSummary } from '../../api/documentApi';
import { ChevronDown, Loader2, ServerCrash, FileText, ListChecks } from 'lucide-react';

interface QuickSummaryAccordionProps {
  documentId: number;
}

export default function QuickSummaryAccordion({ documentId }: QuickSummaryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['quickSummary', documentId],
    queryFn: () => getQuickSummary(documentId),
    enabled: false,
  });

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && !data) {
      refetch();
    }
  };

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-slate-700 pt-3">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
      >
        <span>Hızlı Özet Görüntüle</span>
        <ChevronDown 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 mt-4' : 'max-h-0'
        }`}
      >
        <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-md border border-gray-200 dark:border-slate-700 max-h-80 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="animate-spin" size={16} />
              <span>Özet oluşturuluyor...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400">
              <ServerCrash size={16} />
              <span>Özet alınamadı.</span>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Genel Özet
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{data.summary}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <ListChecks size={16} />
                  Ana Başlıklar
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  {data.headings.map((heading, index) => (
                    <li key={index}>{heading}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}