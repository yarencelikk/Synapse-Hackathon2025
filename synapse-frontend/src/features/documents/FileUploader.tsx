import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { useCallback } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUploader({ onUpload, isUploading }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-6 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-sky-500 bg-gray-700' : 'border-gray-600 hover:border-sky-600'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <UploadCloud size={48} className="text-gray-400 mb-4" />
        {isUploading ? (
          <p className="text-lg font-semibold">Yükleniyor...</p>
        ) : isDragActive ? (
          <p className="text-lg font-semibold">Dosyayı buraya bırakın...</p>
        ) : (
          <>
            <p className="text-lg font-semibold">Dosyanızı buraya sürükleyin veya seçmek için tıklayın</p>
            <p className="text-sm text-gray-400 mt-1">PDF veya DOCX formatında tek bir dosya</p>
          </>
        )}
      </div>
    </div>
  );
}