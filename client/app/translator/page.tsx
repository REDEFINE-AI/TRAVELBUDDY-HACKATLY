'use client';

import useAudioRecorder from '@/hooks/audio-player';
import axios from 'axios';
import { motion,  } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaCircle, FaRegCopy } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa6';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { IoLanguage } from "react-icons/io5";
import { LuAudioLines } from "react-icons/lu";
import { Toaster, toast } from 'react-hot-toast';
import { useSpeechSynthesis } from 'react-speech-kit';
import { AxiosError } from 'axios';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onToggle }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 shadow-sm border border-teal-100 w-full max-w-xs"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="h-10 w-10 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-md"
      >
        {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
      </motion.button>
      <div className="flex-1">
        <div className="h-1 bg-teal-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={isPlaying ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 30, ease: 'linear' }}
            className="h-full bg-teal-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

interface TranslatorToolProps {
  language: string;
  translatedTo: string;
  translatedText: string;
}

export default function TranslatorTool() {
  const {
    isRecording,
    audioFile,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const languages = [
    { code: 'en-US', name: 'English', ttsCode: 'en-US' },
    { code: 'fr-FR', name: 'French', ttsCode: 'fr-FR' },
    { code: 'de-DE', name: 'German', ttsCode: 'de-DE' },
    { code: 'hi-IN', name: 'Hindi', ttsCode: 'hi-IN' },
    { code: 'ml-IN', name: 'Malayalam', ttsCode: 'ml-IN' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [language, setLanguage] = useState(languages[0].code);
  const { speak, speaking, supported } = useSpeechSynthesis();
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    original_text: string;
    translation: string;
    target_language: string;
    created_at: string;
    user_id?: string;
  }>>([]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/translator');
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching translation history:', error);
      toast.error('Failed to fetch translation history');
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  async function getTranslation() {
    setLoading(true);
    
    if (!audioFile.blob) {
      toast.error('Please record audio first');
      return;
    }

    const formData = new FormData();
    let audio_file = new File([audioFile.blob], 'audio.wav', { type: 'audio/wav' });
    formData.append('audio_file', audio_file);        
    formData.append('target_language', language);

    try {
      await axios.post('http://127.0.0.1:8000/translator', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Fetch updated chat history immediately after successful translation
      await fetchChatHistory();
      toast.success('Translation completed!');
    } catch (error) {
      console.error(error);
      toast.error(((error as AxiosError)?.response?.data as string) || 'Translation failed');
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSpeak = (text: string, targetLanguage: string) => {
    if (supported) {
      const voices = window.speechSynthesis.getVoices();
      const targetCode = targetLanguage.split('-')[0].toLowerCase();
      
      const matchingVoice = voices.find(voice => 
        voice.lang.toLowerCase().startsWith(targetCode)
      );
      
      if (matchingVoice) {
        if (speaking) {
          window.speechSynthesis.cancel();
        }
        speak({ 
          text,
          lang: matchingVoice.lang 
        });
      } else {
        toast.error(`Text-to-speech is not available for this language`);
      }
    } else {
      toast.error('Text-to-speech is not supported in your browser');
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);

  // Changed: Reversed sort order to show latest messages at bottom
  const sortedChatHistory = [...chatHistory].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  {
    error && <p className="text-red-500">{typeof error === 'string' ? error : error?.response?.data}</p>;
  }

  return (
    <section className="w-full min-h-screen bg-white">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white" />
      
      {/* Mobile-optimized container */}
      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-teal-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-teal-900">Live Translator</h1>
            <Dropdown text={languages[0].name} options={languages} onSelect={setLanguage} />
          </div>
        </div>

        {/* Additional instructions */}
        <div className="p-4 bg-teal-50 mx-4 my-2 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <IoLanguage className="w-5 h-5" />
            <span>Speak or record in any language → Select language → Click Translate</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <button 
                className="p-4 rounded-full bg-teal-100 text-teal-600 mb-4"
                aria-label="Start recording"
                onClick={startRecording}
              >
                <FaMicrophone size={24} />
              </button>
              <h2 className="text-lg font-medium text-teal-900 mb-2">No translations yet</h2>
              <p className="text-sm text-teal-600">
                Click the microphone button to start recording and translating
              </p>
            </div>
          ) : (
            sortedChatHistory.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                {/* Original Text - Send theme */}
                <div className="flex justify-end">
                  <div className="bg-teal-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                    <p>{message.original_text}</p>
                  </div>
                </div>
                
                {/* Translation - Receive theme */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] group">
                    <p className="text-gray-800">{message.translation}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleSpeak(message.translation, message.target_language)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <LuAudioLines size={16} />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.translation);
                          toast.success('Copied to clipboard!');
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaRegCopy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-center">
              <div className="bg-white/90 rounded-xl p-3 shadow-sm">
                <LuAudioLines className="w-6 h-6 text-teal-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls - Fixed at bottom */}
        <div className="border-t border-teal-100 bg-white/80 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isRecording ? stopRecording() : startRecording()}
                className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg ${
                  isRecording ? 'bg-red-500' : 'bg-teal-500'
                }`}
              >
                {isRecording ? <FaCircle size={24} /> : <FaMicrophone size={24} />}
              </motion.button>
              
              {audioFile.blob && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getTranslation}
                  className="px-6 py-3 bg-teal-500 text-white rounded-full shadow-lg flex items-center gap-2"
                >
                  <IoLanguage size={20} />
                  Translate
                </motion.button>
              )}
            </div>
            {isRecording && (
              <span className="text-sm text-teal-600 animate-pulse">
                Recording... Tap to stop
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface DropdownProps {
  text: string;
  options: { code: string; name: string; }[];
  onSelect: (code: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ text, options, onSelect }) => {
  const [option, setOption] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionSelect = (code: string) => {
    setOption(code);
    setIsOpen(false);
    onSelect(code);
  };

  return (
    <div className="relative z-[999]">
      <button
        id="hs-dropdown-transform-style"
        type="button"
        className="py-2 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-lg border border-teal-200 bg-white text-teal-900 shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        aria-haspopup="menu"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-label="Dropdown"
        onClick={handleToggle}
      >
        {options.find(optionItem => optionItem.code === option)
          ? options.find(optionItem => optionItem.code === option)?.name
          : text}
        <svg
          className={`hs-dropdown-open:rotate-180 size-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg border border-teal-100 z-[999]">
          <div className="p-1">
            {options.map(option => (
              <button
                key={option.code}
                onClick={() => handleOptionSelect(option.code)}
                className="w-full text-left px-4 py-2 text-sm text-teal-900 hover:bg-teal-50 rounded-md transition-colors"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
