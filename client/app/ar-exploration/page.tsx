"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import {
  MdCamera,
  MdCameraEnhance,
  MdQrCodeScanner,
  MdAutoAwesome,
  MdVolumeUp,
  MdVolumeOff,
  MdHistory,
  MdLocationOn,
  MdArchitecture,
  MdTimeline,
  MdPeople,
  MdClose,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

// Types
interface CameraState {
  isActive: boolean;
  error: string | null;
}

interface CaptureState {
  image: string | null;
  isScanning: boolean;
  isProcessing: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface HistoricalData {
  title: string;
  description: string;
  year: string;
}

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

// Animation variants with proper typing
const scanAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

const modalVariants: Variants = {
  hidden: {
    y: "100%",
  },
  visible: {
    y: "0%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: "100%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
};

// New Component for Audio Player with proper typing
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
        <p className="text-xs text-teal-700 mt-1">Historical Narration</p>
      </div>
    </motion.div>
  );
};

// Modern Scanning Animation Component
const ScanningAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <motion.div
          variants={scanAnimationVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 border-2 border-teal-400 rounded-full"
        />
        <motion.div
          animate={{
            background: [
              "linear-gradient(0deg, rgba(0,188,212,0.3) 0%, transparent 50%)",
              "linear-gradient(180deg, rgba(0,188,212,0.3) 0%, transparent 50%)",
              "linear-gradient(360deg, rgba(0,188,212,0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-teal-300/30 to-transparent"
        />
        <div className="w-32 h-32 rounded-full border-4 border-teal-500 flex items-center justify-center">
          <MdAutoAwesome className="w-12 h-12 text-teal-500" />
        </div>
      </div>
    </div>
  );
};

const ARExplorer: React.FC = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    error: null,
  });

  const [captureState, setCaptureState] = useState<CaptureState>({
    image: null,
    isScanning: false,
    isProcessing: false,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    return () => {
      stopCamera();
      if (synth) synth.cancel();
    };
  }, []);
  // Silently get location
  const getLocationSilently = async () => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      // Silently handle location error
      console.error("Location error:", err);
    }
  };

  const startCamera = async (): Promise<void> => {
    try {
      setCameraState({ isActive: true, error: null });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraState({ isActive: true, error: null });
      }

      // Silently get location after camera starts
      getLocationSilently();
    } catch (err) {
      const errorMessage =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow access to continue."
          : "Unable to access the camera. Please try again.";
      setCameraState({ isActive: false, error: errorMessage });
    }
  };

  const stopCamera = (): void => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState({ isActive: false, error: null });
  };

  const captureImage = (): void => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL("image/jpeg", 0.8);
      setCaptureState({ ...captureState, image: imageUrl });
      stopCamera();
      setModalOpen(true);
    }
  };

  const performAIScan = async (): Promise<void> => {
    if (!captureState.image) return;

    setCaptureState({ ...captureState, isScanning: true, isProcessing: true });

    try {
      // Simulate AI processing and historical data fetch
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setHistoricalData({
        title: "Historical Monument",
        description:
          "This location features a significant historical landmark dating back to the colonial era. The architecture reflects the period's distinctive style, and it played a crucial role in the region's development.",
        year: "1876",
      });
    } catch (err) {
      console.error("AI scan failed:", err);
    } finally {
      setCaptureState({
        ...captureState,
        isProcessing: false,
        isScanning: false,
      });
    }
  };
  // Enhanced Modal Content Component
  const ModalContent: React.FC = () => {
    if (!historicalData) return null;

    return (
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4">
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

          {/* Close Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <MdClose size={24} />
          </motion.button>

          {/* Image Section */}
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <img
              src={captureState.image || ""}
              alt="Captured Location"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h2 className="text-2xl font-bold text-white">
                {historicalData.title}
              </h2>
              <p className="text-white/90 flex items-center gap-2">
                <MdLocationOn /> Historical Site
              </p>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mb-6">
            <AudioPlayer isPlaying={isPlaying} onToggle={toggleVoiceOver} />
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2 text-blue-800">
                <MdHistory size={24} />
                <h3 className="font-semibold">Historical Overview</h3>
              </div>
              <p className="text-blue-900">{historicalData.description}</p>
            </div>

            {/* Architecture Card */}
            <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2 text-purple-800">
                <MdArchitecture size={24} />
                <h3 className="font-semibold">Architectural Significance</h3>
              </div>
              <p className="text-purple-900">
                The structure showcases remarkable architectural elements from
                the {historicalData.year} era, featuring intricate details and
                period-specific construction techniques.
              </p>
            </div>

            {/* Timeline Card */}
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <MdTimeline size={24} />
                <h3 className="font-semibold">Key Timeline</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-amber-900">
                    Built in {historicalData.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-amber-900">Major renovation in 1920</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-amber-900">Heritage site status in 1975</p>
                </div>
              </div>
            </div>

            {/* Cultural Impact Card */}
            <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 mb-6">
              <div className="flex items-center gap-2 mb-2 text-teal-800">
                <MdPeople size={24} />
                <h3 className="font-semibold">Cultural Impact</h3>
              </div>
              <p className="text-teal-900">
                This site has played a pivotal role in shaping local culture and
                traditions, serving as a gathering place for significant
                community events and celebrations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const toggleVoiceOver = () => {
    if (!synth || !historicalData) return;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(
        historicalData.description
      );
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      synth.speak(utterance);
    }
  };

  // Replace the old scanning animation with the new one
  const renderScanningOverlay = () => {
    if (!captureState.isScanning) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      >
        <ScanningAnimation />
      </motion.div>
    );
  };
  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-teal-50 to-white">
      <div className="flex flex-col h-full p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <h1 className="text-2xl font-bold text-teal-800">AR Explorer</h1>
        </motion.div>

        <div className="relative flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full h-full max-h-[70vh]"
          >
            <div className="absolute inset-0 border-4 border-dashed border-teal-300 rounded-3xl overflow-hidden">
              <div className="relative w-full h-full bg-gray-50">
                {!cameraState.isActive && !captureState.image ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 bg-white bg-opacity-90">
                    <MdQrCodeScanner className="w-20 h-20 text-teal-500 animate-pulse" />
                    <h2 className="text-xl font-semibold text-teal-800">
                      Ready to Explore?
                    </h2>
                    {cameraState.error ? (
                      <p className="text-sm text-red-600 text-center">
                        {cameraState.error}
                      </p>
                    ) : (
                      <p className="text-sm text-teal-600 text-center">
                        Allow camera access to explore hidden stories around
                        you.
                      </p>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startCamera}
                      className="flex items-center px-6 py-3 space-x-2 text-white bg-teal-500 rounded-full shadow-lg"
                    >
                      <MdCamera className="w-5 h-5" />
                      <span>Start Exploring</span>
                    </motion.button>
                  </div>
                ) : (
                  <>
                    {cameraState.isActive && (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="object-cover w-full h-full"
                      />
                    )}
                    {captureState.image && (
                      <img
                        src={captureState.image}
                        alt="Captured"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </>
                )}

                <AnimatePresence>
                  {captureState.isScanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                    >
                      <FaSpinner className="w-16 h-16 text-teal-400 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-6 left-0 right-0 flex items-center justify-center space-x-6"
            >
              {cameraState.isActive && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={captureImage}
                  className="p-6 text-white bg-teal-500 rounded-full shadow-lg"
                >
                  <MdCameraEnhance className="w-8 h-8" />
                </motion.button>
              )}

              {captureState.image && !captureState.isProcessing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={performAIScan}
                  className="p-6 text-white bg-teal-500 rounded-full shadow-lg"
                >
                  <MdAutoAwesome className="w-8 h-8" />
                </motion.button>
              )}

              {captureState.isProcessing && (
                <div className="p-6 text-white bg-teal-500 rounded-full shadow-lg">
                  <FaSpinner className="w-8 h-8 animate-spin" />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>{modalOpen && <ModalContent />}</AnimatePresence>
      <AnimatePresence>
        {captureState.isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {renderScanningOverlay()}
          </motion.div>
        )}
      </AnimatePresence>{" "}
    </div>
  );
};

export default ARExplorer;
