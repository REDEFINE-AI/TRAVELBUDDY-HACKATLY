'use client';

import useAudioRecorder from '@/hooks/audio-player';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { FaKeyboard, FaMicrophone } from 'react-icons/fa6';
import { MdPause, MdPlayArrow } from 'react-icons/md';

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
    <section className="w-full h-screen bg-white px-4 pt-4 grid place-items-center text-black">
      <h1 className="text-2xl">Live Translator</h1>
      {audioFile.blob && <p>Audio file: {audioFile.blob.size} bytes</p>}
      {audioError && <p className="text-red-500">{audioError}</p>}
      <div
        id="audio_player"
        className="w-full flex gap-4 flex-col  rounded-md p-2  items-start justify-between"
      >
        <AudioPlayer isPlaying={isPlaying} onToggle={() => console.log('playing')} />

        <div className="flex items-center gap-3">
          <p>Language:</p>
          <span>🇪🇸 Spanish</span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div id="translated_language" className="p-3 bg-teal-50 rounded-lg">
          <p>{data?.translation}</p>
        </div>
      </div>
      <div>{error}</div>
      <div className="space-y-5">
        <div className="flex items-center justify-center gap-4">
          <h3>Translated language to:</h3>
          <Dropdown text={languages[0].name} options={languages} onSelect={setLanguage} />
        </div>

        {isRecording ? (
          <div className="flex items-center justify-center flex-col">
            <button
              type="button"
              onClick={() => stopRecording()}
              className="h-16 w-16 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-md"
            >
              <FaCircle size={24} />
            </button>
            <p className="text-center">Speak</p>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <button
              type="button"
              onClick={() => startRecording()}
              className="h-16 w-16 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md"
            >
              <FaMicrophone size={24} />
            </button>
            <p className="text-center">Recording</p>
          </div>
        )}
        {audioFile.url && <audio src={audioFile.url} controls className="w-full max-w-md" />}
        <button onClick={getTransaltion}>Translate</button>
      </div>
    </section>
  );
}

const Dropdown = ({
  text,
  options,
  onSelect, // This prop is the callback to pass selected option back to parent
}: {
  text: string;
  options: { code: string; name: string }[];
  onSelect: (selectedCode: string) => void; // Function type for passing selected code
}) => {
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
    <div className="relative">
      <button
        id="hs-dropdown-transform-style"
        type="button"
        className="hs-dropdown-toggle py-1 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 capitalize"
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
        <div
          className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-100 z-10 absolute mt-2 origin-top-left min-w-60 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-dropdown-transform-style"
        >
          <div className="p-1 space-y-0.5">
            {options.map(option_text => (
              <button
                key={option_text.code}
                onClick={() => handleOptionSelect(option_text.code)}
                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
              >
                {option_text.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
