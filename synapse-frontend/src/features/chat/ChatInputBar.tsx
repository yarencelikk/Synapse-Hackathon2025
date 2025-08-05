// Dosya: src/features/chat/ChatInputBar.tsx (GÜNCELLENDİ)

import { useState, type FormEvent, useRef } from 'react';
import { Send, Cpu, Mic, MicOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { transcribeAudio } from '../../api/audioApi';

interface ChatInputBarProps {
  onSendMessage: (query: string, agent: string) => void;
  isResponding: boolean;
}

const AGENT_OPTIONS = [
  { value: 'direct_answer', label: 'Doğrudan Cevap' },
  { value: 'socratic_questioner', label: 'Sokratik Sorgulayıcı' },
  { value: 'quiz_generator', label: 'Sınav Hazırlayıcı' },
  { value: 'summarizer', label: 'Özetleyici' },
  { value: 'simulation', label: 'Simülasyon' },
  { value: 'mind_mapper', label: 'Kavram Haritacısı' },
];

type RecordingStatus = 'idle' | 'permission_pending' | 'recording' | 'transcribing' | 'error';

export default function ChatInputBar({ onSendMessage, isResponding }: ChatInputBarProps) {
  const [query, setQuery] = useState('');
  const [agent, setAgent] = useState(AGENT_OPTIONS[0].value);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const transcribeMutation = useMutation({
    mutationFn: transcribeAudio,
    onSuccess: (data) => {
      setQuery(data.text);
      setRecordingStatus('idle');
    },
    onError: () => {
      console.error("Transcribing error");
      setRecordingStatus('error');
    },
  });

  const handleStartRecording = async () => {
    setRecordingStatus('permission_pending');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      
      recorder.onstop = () => {
        setRecordingStatus('transcribing');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm; codecs=opus' });
        // Sesi metne çevirmesi için backend'e gönder
        transcribeMutation.mutate(audioBlob);
      };
      
      recorder.start();
      setRecordingStatus('recording');
    } catch (err) {
      console.error("Microphone error:", err);
      setRecordingStatus('error');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isResponding) {
      onSendMessage(query.trim(), agent);
      setQuery('');
    }
  };
  
  const renderMicButton = () => {
    switch (recordingStatus) {
      case 'recording':
        return <MicOff size={20} className="text-red-400 animate-pulse" />;
      case 'permission_pending':
      case 'transcribing':
        return <Loader2 size={20} className="animate-spin" />;
      case 'error':
        return <MicOff size={20} className="text-yellow-400" />;
      default:
        return <Mic size={20} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-100 dark:bg-slate-900/50 border-t border-gray-400 dark:border-slate-800">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <label htmlFor="agent-select" className="sr-only">Ajan Seçimi</label>
          <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
          <select id="agent-select" name="agent" value={agent} onChange={(e) => setAgent(e.target.value)} disabled={isResponding} className="pl-10 pr-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none transition-colors">
            {AGENT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">{opt.label}</option>))}
          </select>
        </div>
        <div className="relative flex-1">
          <label htmlFor="chat-input" className="sr-only">Mesajınızı yazın</label>
          <input
            id="chat-input"
            name="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              recordingStatus === 'recording' ? "Kaydediliyor..." : 
              recordingStatus === 'transcribing' ? "Metne çevriliyor..." : 
              "Mesajınızı yazın veya mikrofonu kullanın..."
            }
            disabled={isResponding || recordingStatus !== 'idle'}
            className="w-full p-2 rounded-md bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={recordingStatus === 'recording' ? handleStopRecording : handleStartRecording}
          disabled={isResponding}
          className={`p-2 rounded-full transition-colors ${
            recordingStatus === 'recording' ? 'bg-red-500/20' : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
          } disabled:bg-gray-200 dark:disabled:bg-slate-600 disabled:opacity-50`}
          aria-label={recordingStatus === 'recording' ? "Kaydı Durdur" : "Sesli Mesaj Gönder"}
        >
          {renderMicButton()}
        </button>
        <button
          type="submit"
          disabled={isResponding || !query.trim()}
          className="p-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Gönder"
        >
          <Send size={20} />
        </button>
      </div>
      {recordingStatus === 'error' && <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2 text-center">Mikrofon hatası. Lütfen tarayıcı izinlerinizi kontrol edin ve tekrar deneyin.</p>}
    </form>
  );
}