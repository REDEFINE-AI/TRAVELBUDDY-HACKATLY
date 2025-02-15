'use client';

import useAudioRecorder from '@/hooks/audio-player';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaCircle, FaRegCopy } from 'react-icons/fa';
import { FaKeyboard, FaMicrophone } from 'react-icons/fa6';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { IoLanguage } from "react-icons/io5";
import { FaWaveSquare } from "react-icons/fa";
import { LuAudioLines } from "react-icons/lu";

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
    error: audioError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    createDownloadableFile,
  } = useAudioRecorder();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ml', name: 'Malayalam' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<any>();
  const [language, setLanguage] = useState(languages[0].code);

  async function getTransaltion() {
    setLoading(true);

    const formData = new FormData();
    console.log('audioFile.blob', audioFile.blob, 'audio.wav');
    if (!audioFile.blob) return;
    let audio_file = new File([audioFile.blob], 'audio.wav', { type: 'audio/wav' });
    formData.append('audio_file', audio_file);
    formData.append('target_language', language);
    console.log(formData)
    await axios
      .post('http://127.0.0.1:8000/translator', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure content type is set for file upload
        },
      })
      .then(response => {
        console.log(response);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setError(error);
        setLoading(false);
      });
  }

  const [isPlaying, setIsPlaying] = useState(false);

  {
    error && <p className="text-red-500">{error?.response?.data}</p>;
  }

  return (
    <section className="w-full min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white" />
      
      <div className="relative max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-teal-500 p-3 rounded-2xl shadow-lg"
            >
              <IoLanguage className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-teal-900">Live Translator</h1>
          <p className="text-teal-600">Professional voice translation in real-time</p>
        </motion.div>

        {/* Translation Result Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-teal-100 overflow-hidden"
        >
          {/* Language Selection - Integrated into card header */}
          <div className="border-b border-teal-100 p-4">
            <div className="flex items-center justify-end gap-4">
              <h3 className="text-teal-900 font-medium">Translate to:</h3>
              <Dropdown text={languages[0].name} options={languages} onSelect={setLanguage} />
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-12"
                >
                  <LuAudioLines className="w-12 h-12 text-teal-500 animate-pulse" />
                  <p className="text-teal-600">Processing audio...</p>
                </motion.div>
              ) : data?.translation ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xl text-teal-900 leading-relaxed flex-1">{data.translation}</p>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-teal-500 hover:text-teal-600"
                      onClick={() => navigator.clipboard.writeText(data.translation)}
                    >
                      <FaRegCopy size={20} />
                    </motion.button>
                  </div>
                  
                  {/* Dynamic Audio Waveform */}
                  <div className="flex items-center justify-center h-16 gap-1">
                    {[...Array(32)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: isPlaying ? `${Math.random() * 100}%` : "20%"
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: isPlaying ? Infinity : 0,
                          repeatType: "reverse"
                        }}
                        className="w-1.5 bg-teal-500/80 rounded-full"
                      />
                    ))}
                  </div>
                  
                  <AudioPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 space-y-4"
                >
                  <LuAudioLines className="w-16 h-16 text-teal-200 mx-auto" />
                  <p className="text-teal-600">Your translation will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recording Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute -inset-4 bg-teal-100 rounded-full"
                  style={{ zIndex: -1 }}
                />
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={`h-20 w-20 rounded-full flex items-center justify-center text-white shadow-lg ${
                isRecording ? 'bg-red-500' : 'bg-teal-500'
              }`}
            >
              {isRecording ? <FaCircle size={28} /> : <FaMicrophone size={28} />}
            </motion.button>
          </div>
          
          <motion.p 
            animate={{ opacity: 1 }}
            className="text-teal-700 font-medium"
          >
            {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </motion.p>
          
          <AnimatePresence>
            {audioFile.blob && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={getTransaltion}
                className="px-8 py-3 bg-teal-500 text-white rounded-xl shadow-lg"
              >
                Translate Audio
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Messages */}
        <AnimatePresence>
          {(error || audioError) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl text-center border border-red-100"
            >
              {error?.toString() || audioError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Update Dropdown styles to match theme
const Dropdown = ({ text, options, onSelect }) => {
  const [option, setOption] = useState('en'); // Default option
  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown visibility

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionSelect = (code: string) => {
    setOption(code);
    setIsOpen(false); // Close the dropdown after selecting an option
    onSelect(code); // Pass the selected code to the parent component
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
