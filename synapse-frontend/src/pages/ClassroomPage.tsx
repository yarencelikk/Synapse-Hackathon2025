import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClassroomById } from '../api/classroomApi';
import { uploadDocument, deleteDocument } from '../api/documentApi';
import DocumentList from '../features/documents/DocumentList';
import FileUploader from '../features/documents/FileUploader';
import ChatPanel from '../features/chat/ChatPanel';
import ConfirmationModal from '../components/ui/ConfirmationModal';

export default function ClassroomPage() {
  const queryClient = useQueryClient();
  const { classroomId } = useParams<{ classroomId: string }>();
  const id = Number(classroomId);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number, name: string } | null>(null);

  const { data: classroom, isLoading, isError } = useQuery({
    queryKey: ['classroom', id],
    queryFn: () => getClassroomById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const classroomData = query.state.data;
      const hasProcessingDocuments = classroomData?.documents.some(doc => doc.status === 'processing');
      return hasProcessingDocuments ? 3000 : false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom', id] });
    },
  });
  
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom', id] });
      setDeleteTarget(null);
    },
  });

  const handleFileUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const openDeleteModal = (target: { id: number, name: string }) => {
    setDeleteTarget(target);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDocumentMutation.mutate(deleteTarget.id);
    }
  };

  if (isLoading && !classroom) return <div className="text-center p-8">Derslik Yükleniyor...</div>;
  if (isError) return <div className="text-red-400">Hata: Derslik bilgileri yüklenemedi.</div>;
  if (!classroom) return <div>Derslik bulunamadı.</div>;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Sol Sütun: Dokümanlar */}
        <div className="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-400 dark:border-slate-800 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{classroom.name}</h2>
          </div>
          <FileUploader onUpload={handleFileUpload} isUploading={uploadMutation.isPending} />
          {/* Bu div, kalan tüm alanı kaplayacak ve gerekirse kendi içinde kayacak */}
          <div className="flex-1 overflow-y-auto mt-6 pr-2">
            <DocumentList 
              documents={classroom.documents} 
              onDelete={(docId) => openDeleteModal({ 
                id: docId, 
                name: classroom.documents.find(d => d.id === docId)?.file_name || 'bu dokümanı'
              })} 
            />
          </div>
        </div>

        {/* Sağ Sütun: Sohbet Penceresi */}
        {/* overflow-hidden ekleyerek sohbet panelinin de kendi sınırları içinde kalmasını sağlıyoruz */}
        <div className="h-full overflow-hidden">
          <ChatPanel />
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteDocumentMutation.isPending}
        title="Dokümanı Sil"
        message={`'${deleteTarget?.name}' adlı dokümanı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />
    </>
  );
}
