"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaKeyboard, FaMicrophone } from "react-icons/fa6";
import { MdPause, MdPlayArrow } from "react-icons/md";

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
            initial={{ width: "0%" }}
            animate={isPlaying ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 30, ease: "linear" }}
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

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <section className="w-full h-screen bg-white px-4 pt-4 grid place-items-center text-black">
      <h1 className="text-2xl">Live Translator</h1>

      <div
        id="audio_player"
        className="w-full flex gap-4 flex-col  rounded-md p-2  items-start justify-between"
      >
        <AudioPlayer
          isPlaying={isPlaying}
          onToggle={() => console.log("playing")}
        />

        <div className="flex items-center gap-3">
          <p>Language:</p>
          <span>🇪🇸 Spanish</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center gap-4">
          <h3>Translated language to:</h3>
          <div className="hs-dropdown relative inline-flex">
            <button
              id="hs-dropdown-transform-style"
              type="button"
              className="hs-dropdown-toggle py-1 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              Engilish
              <svg
                className="hs-dropdown-open:rotate-180 size-4"
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

            <div
              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-transform-style"
            >
              <div
                className="hs-dropdown-open:ease-in hs-dropdown-open:opacity-100 hs-dropdown-open:scale-100 transition ease-out opacity-0 scale-95 duration-200 mt-2 origin-top-left min-w-60 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
                data-hs-transition
              >
                <div className="p-1 space-y-0.5">
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    href="#"
                  >
                    French
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    href="#"
                  >
                    German
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    href="#"
                  >
                    Hindi
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    href="#"
                  >
                    Malayalam
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="translated_language" className="p-3 bg-teal-50 rounded-lg">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam
            assumenda, quaerat nam alias porro aperiam aliquid laborum omnis
            voluptatum excepturi laboriosam. Quam autem esse maxime amet rerum
            cumque in quia?
          </p>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="h-16 w-16 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md"
        >
          <FaMicrophone size={24} />
        </button>
        <p className="text-center">Speak</p>
      </div>
    </section>
  );
}
