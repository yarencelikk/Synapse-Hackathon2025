import { useState, useRef, useCallback } from 'react';

// Kayıt durumlarını tanımlayan bir tip
type RecordingStatus = 'idle' | 'permission_pending' | 'recording' | 'transcribing' | 'error';

// Hook'un döndüreceği değerlerin ve fonksiyonların tip tanımı
interface AudioRecorderResult {
  status: RecordingStatus;
  startRecording: () => void;
  stopRecording: () => void;
  transcribedText: string | null;
  error: string | null;
  reset: () => void;
}

// Ses kaydını metne çevirecek olan API fonksiyonunun tipini tanımlıyoruz
type TranscribeCallback = (audioBlob: Blob) => Promise<string>;

export const useAudioRecorder = (onTranscribed: (text: string) => void): AudioRecorderResult => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  
  // MediaRecorder API'sini ve ses parçalarını saklamak için referanslar kullanıyoruz
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setStatus('permission_pending');
    setError(null);
    try {
      // Tarayıcıdan mikrofon erişim izni iste
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      // Kayıt sırasında ses verisi geldiğinde bu event tetiklenir
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // Kayıt durdurulduğunda bu event tetiklenir
      recorder.onstop = async () => {
        setStatus('transcribing');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm; codecs=opus' });
        
        try {
          // Backend'e gönderme ve metne çevirme işlemi burada gerçekleşecek
          // Bu hook'u kullanan bileşen, bu işlemi yapacak olan asıl fonksiyonu provide edecek.
          // Şimdilik bu kısmı boş bırakıyoruz, ChatInputBar'da dolduracağız.
        } catch (err) {
          console.error("Transcribing error:", err);
          setError("Ses metne çevrilirken bir hata oluştu.");
          setStatus('error');
        }
      };

      recorder.start();
      setStatus('recording');
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Mikrofon erişim izni reddedildi veya bir hata oluştu.");
      setStatus('error');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      // Kayıt durunca onstop event'i tetiklenecek ve 'transcribing' durumuna geçecek
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTranscribedText(null);
  }, []);

  // Hook, dış dünyaya bu state'leri ve fonksiyonları sunar
  return { status, startRecording, stopRecording, transcribedText, error, reset };
};
