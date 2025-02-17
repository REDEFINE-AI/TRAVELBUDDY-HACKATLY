'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
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
  MdFileUpload,
} from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

// Types
interface CameraState {
  isActive: boolean;
  error: string | null;
}

interface CaptureState {
  image: string | null;
  isScanning: boolean;
  isProcessing: boolean;
  uploadedImage: string | null;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface HistoricalData {
  title: string;
  description: string;
  year: string;
  architecture: string;
  culturalSignificance: string;
  timeline: Array<{ year: string; event: string }>;
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
      repeatType: 'reverse' as const,
    },
  },
};

const modalVariants: Variants = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: '0%',
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
};

// Add new WaveformAnimation component
const WaveformAnimation: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex items-center gap-[2px] h-4">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-teal-500"
          animate={
            isPlaying
              ? {
                  height: ['20%', `${Math.random() * 100}%`, '20%'],
                }
              : {
                  height: '20%',
                }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Update AudioPlayer component
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
        <div className="h-4 rounded-full overflow-hidden flex items-center">
          <WaveformAnimation isPlaying={isPlaying} />
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
        {/* Outer rotating ring */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 w-40 h-40 border-4 border-teal-500/30 rounded-full"
        />

        {/* Middle pulsing ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-32 h-32 border-2 border-teal-400/60 rounded-full m-4"
        />

        {/* Inner scanning effect */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500 m-8">
          <motion.div
            animate={{
              y: [-100, 100],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-teal-500/50 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-teal-400/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <MdAutoAwesome className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        {/* Orbiting dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute w-2 h-2 bg-teal-500 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                marginLeft: '-4px',
                marginTop: '-40px',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Scanning text */}
      <motion.div
        className="absolute mt-32 text-center"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <p className="text-teal-700 font-medium">Analyzing Landmark</p>
        <p className="text-teal-600/70 text-sm mt-1">Using AI to identify location</p>
      </motion.div>
    </div>
  );
};

// Add new interface for landmark detection
interface LandmarkDetection {
  landmarkName: string;
  confidence: number;
  description?: string;
  historicalInfo?: string;
  culturalInfo?: string;
}

// Add this component before the ARExplorer component
const ModalContent: React.FC = () => {
  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl z-50"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Modal content will be implemented later */}
        <p>Historical information will be displayed here</p>
      </div>
    </motion.div>
  );
};

// Add test image URL
const TEST_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/640px-Taj_Mahal_%28Edited%29.jpeg';

// Updated urlToBase64 function with proper error handling
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    console.log('Fetching image from URL:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Get only the base64 data without the prefix
          const base64 = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
          console.log('Base64 conversion successful, length:', base64.length);
          resolve(base64);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in urlToBase64:', error);
    throw error;
  }
};

// Add new interface for upload modal
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
}

// Add new UploadModal component before ARExplorer
const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      onUpload(selectedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Upload Test Image</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
          }`}
        >
          {selectedImage ? (
            <div className="space-y-4">
              <img src={selectedImage} alt="Selected" className="max-h-64 mx-auto rounded-lg" />
              <button
                onClick={() => setSelectedImage(null)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <MdFileUpload className="w-12 h-12 text-teal-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-gray-600">Drag and drop an image here, or</p>
                <label className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedImage}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedImage
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Upload & Analyze
          </button>
        </div>
      </motion.div>
    </motion.div>
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
    uploadedImage: null,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    return () => {
      stopCamera();
      if (synth) synth.cancel();
    };
  }, []);
  // Silently get location
  const getLocationSilently = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      // Silently handle location error
      console.error('Location error:', err);
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
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow access to continue.'
          : 'Unable to access the camera. Please try again.';
      setCameraState({ isActive: false, error: errorMessage });
    }
  };

  const stopCamera = (): void => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState({ isActive: false, error: null });
  };

  const captureImage = (): void => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCaptureState({ ...captureState, image: imageUrl });
      stopCamera();
      setModalOpen(true);
    }
  };

  const performAIScan = async (): Promise<void> => {
    setCaptureState({ ...captureState, isScanning: true, isProcessing: true });

    try {
      console.log('Starting AI scan...');

      // First validate API key
      const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      // Convert test image to base64
      const base64Image = await urlToBase64(TEST_IMAGE_URL);

      // Prepare the request body
      const requestBody = {
        image: base64Image, // Send base64 string instead of URL
        language: 'en',
      };

      console.log('Making API request...');

      const visionResponse = await fetch(
        'https://ultimate-cloud-vision-image.p.rapidapi.com/google/cloudvision/landmarks',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'ultimate-cloud-vision-image.p.rapidapi.com',
          },
          body: JSON.stringify(requestBody),
        },
      );

      // Detailed error logging
      if (!visionResponse.ok) {
        const errorText = await visionResponse.text();
        console.error('API Error Details:', {
          status: visionResponse.status,
          statusText: visionResponse.statusText,
          headers: Object.fromEntries(visionResponse.headers.entries()),
          error: errorText,
        });
        throw new Error(`API request failed (${visionResponse.status}): ${errorText}`);
      }

      const visionData = await visionResponse.json();
      console.log('Vision API response:', visionData);

      if (!Array.isArray(visionData) || visionData.length === 0) {
        console.error('No landmarks detected in the response:', visionData);
        throw new Error('No landmark detected in the image');
      }

      const landmark = visionData[0]; // Get the first landmark
      const landmarkName = landmark.description;
      console.log('Successfully detected landmark:', landmarkName);

      // 2. Get Wikipedia information about the landmark
      console.log('Fetching Wikipedia information...');
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(landmarkName)}`,
      );
      const wikiData = await wikiResponse.json();

      // 3. Get additional cultural information using Wikipedia API
      const wikiCultureResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
          landmarkName,
        )}&origin=*`,
      );
      const wikiCultureData = await wikiCultureResponse.json();
      const pageId = Object.keys(wikiCultureData.query.pages)[0];
      const culturalInfo = wikiCultureData.query.pages[pageId].extract;

      // Update historical data with gathered information
      const historicalInfo = {
        title: landmarkName,
        description: wikiData.extract,
        year: extractYear(wikiData.extract) || 'Historical',
        architecture: extractArchitectureInfo(culturalInfo) || 'Notable Architecture',
        culturalSignificance: culturalInfo,
        timeline: generateTimeline(wikiData.extract, culturalInfo),
      };

      console.log('Setting historical data:', historicalInfo);
      setHistoricalData(historicalInfo);

      // Start voice narration automatically
      startNarration(historicalInfo);
      setModalOpen(true);
    } catch (err) {
      console.error('AI scan failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setCameraState({
        ...cameraState,
        error: `Analysis failed: ${errorMessage}. Please try again.`,
      });
    } finally {
      setCaptureState({
        ...captureState,
        isProcessing: false,
        isScanning: false,
      });
    }
  };

  // Helper function to extract year from text
  const extractYear = (text: string): string | null => {
    const yearRegex = /\b(1[0-9]{3}|20[0-2][0-9])\b/;
    const match = text.match(yearRegex);
    return match ? match[0] : null;
  };

  // Helper function to extract architecture information
  const extractArchitectureInfo = (text: string): string | null => {
    const architectureKeywords = ['architecture', 'built', 'designed', 'style', 'structure'];
    const sentences = text.split('. ');

    for (const sentence of sentences) {
      if (architectureKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        return sentence;
      }
    }
    return null;
  };

  // Helper function to generate timeline
  const generateTimeline = (
    mainText: string,
    culturalText: string,
  ): Array<{ year: string; event: string }> => {
    const timeline: Array<{ year: string; event: string }> = [];
    const combinedText = `${mainText} ${culturalText}`;
    const yearRegex = /\b(1[0-9]{3}|20[0-2][0-9])\b/g;
    const sentences = combinedText.split('. ');

    sentences.forEach(sentence => {
      const year = sentence.match(yearRegex);
      if (year) {
        timeline.push({
          year: year[0],
          event: sentence.trim(),
        });
      }
    });

    return timeline.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  // Update the narration function to handle sections
  const startNarration = (content: HistoricalData) => {
    if (!synth) return;

    // Cancel any ongoing speech
    synth.cancel();

    // Create a detailed, structured narrative script
    const narrativeScript = `
      Welcome to ${content.title}.

      Let me tell you about this historical landmark.

      First, some quick facts.
      This landmark was built in ${content.year}.
      It represents a magnificent example of historical architecture.

      Let me share the detailed description.
      ${content.description}

      Now, let's explore the architectural details.
      ${content.architecture}

      This landmark holds great cultural significance.
      ${content.culturalSignificance}

      Let me walk you through the fascinating timeline of events.
      ${content.timeline
        .map((event, index) => {
          if (index === 0) {
            return `The history begins in ${event.year}, when ${event.event}`;
          }
          return `Later in ${event.year}, ${event.event}`;
        })
        .join('. ')}

      That concludes our detailed exploration of ${content.title}.
      Thank you for listening to this historical journey.
    `;

    // Split into meaningful chunks for natural-sounding narration
    const chunks = narrativeScript
      .split(/[.!?]+/)
      .filter(chunk => chunk.trim().length > 0)
      .map(chunk => chunk.trim());

    let currentChunkIndex = 0;

    const speakNextChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);

      // Configure voice
      const voices = synth.getVoices();
      const preferredVoice = voices.find(
        voice => voice.name.includes('Google') || voice.name.includes('Premium'),
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Optimize speech parameters for clarity and engagement
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1; // Natural pitch
      utterance.volume = 1; // Full volume

      // Add slight pauses between sections for better pacing
      if (
        chunks[currentChunkIndex].includes('Let me') ||
        chunks[currentChunkIndex].includes('Now,')
      ) {
        utterance.rate = 0.85; // Slightly slower for section transitions
      }

      // Handle chunk completion
      utterance.onend = () => {
        // Add a small pause between chunks for better pacing
        setTimeout(() => {
          currentChunkIndex++;
          speakNextChunk();
        }, 300);
      };

      utterance.onerror = event => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
      };

      synth.speak(utterance);
    };

    // Start narration
    setIsPlaying(true);
    speakNextChunk();
  };

  // Update toggleVoiceOver to use the new narration
  const toggleVoiceOver = () => {
    if (!historicalData) return;

    if (isPlaying) {
      synth?.cancel();
      setIsPlaying(false);
    } else {
      startNarration(historicalData);
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

  // Add a function to validate your API key is set
  const validateApiKey = () => {
    const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
    if (!apiKey) {
      console.error('RapidAPI key is not set in environment variables!');
      return false;
    }
    return true;
  };

  // Update the test button click handler
  const handleTestClick = () => {
    if (!validateApiKey()) {
      setCameraState({
        isActive: false,
        error: 'API key is not configured. Please check the setup.',
      });
      return;
    }
    setIsUploadModalOpen(true);
  };

  // Update handleImageUpload to store the uploaded image
  const handleImageUpload = async (imageUrl: string) => {
    try {
      setCaptureState(prev => ({
        ...prev,
        isScanning: true,
        isProcessing: true,
        uploadedImage: imageUrl,
      }));

      // Extract base64 data from the Data URL
      const base64Image = imageUrl.split(',')[1];

      // Validate API key
      const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      // Prepare the request body
      const requestBody = {
        image: base64Image,
        language: 'en',
      };

      console.log('Making API request...');

      const visionResponse = await fetch(
        'https://ultimate-cloud-vision-image.p.rapidapi.com/google/cloudvision/landmarks',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'ultimate-cloud-vision-image.p.rapidapi.com',
          },
          body: JSON.stringify(requestBody),
        },
      );

      // Detailed error logging
      if (!visionResponse.ok) {
        const errorText = await visionResponse.text();
        console.error('API Error Details:', {
          status: visionResponse.status,
          statusText: visionResponse.statusText,
          headers: Object.fromEntries(visionResponse.headers.entries()),
          error: errorText,
        });
        throw new Error(`API request failed (${visionResponse.status}): ${errorText}`);
      }

      const visionData = await visionResponse.json();
      console.log('Vision API response:', visionData);

      if (!Array.isArray(visionData) || visionData.length === 0) {
        console.error('No landmarks detected in the response:', visionData);
        throw new Error('No landmark detected in the image');
      }

      const landmark = visionData[0]; // Get the first landmark
      const landmarkName = landmark.description;
      console.log('Successfully detected landmark:', landmarkName);

      // Get Wikipedia information about the landmark
      console.log('Fetching Wikipedia information...');
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(landmarkName)}`,
      );
      const wikiData = await wikiResponse.json();

      // Get additional cultural information using Wikipedia API
      const wikiCultureResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
          landmarkName,
        )}&origin=*`,
      );
      const wikiCultureData = await wikiCultureResponse.json();
      const pageId = Object.keys(wikiCultureData.query.pages)[0];
      const culturalInfo = wikiCultureData.query.pages[pageId].extract;

      // Update historical data with gathered information
      const historicalInfo = {
        title: landmarkName,
        description: wikiData.extract,
        year: extractYear(wikiData.extract) || 'Historical',
        architecture: extractArchitectureInfo(culturalInfo) || 'Notable Architecture',
        culturalSignificance: culturalInfo,
        timeline: generateTimeline(wikiData.extract, culturalInfo),
      };

      console.log('Setting historical data:', historicalInfo);
      setHistoricalData(historicalInfo);

      // Start voice narration automatically
      startNarration(historicalInfo);
      setModalOpen(true);
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      setCameraState({
        isActive: false,
        error: 'Failed to process the uploaded image. Please try again.',
      });
    } finally {
      setCaptureState(prev => ({
        ...prev,
        isProcessing: false,
        isScanning: false,
      }));
    }
  };

  // Update ModalContent to use the uploaded image
  const ModalContent = () => {
    if (!historicalData) return null;

    return (
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl z-50 max-h-[85vh] overflow-y-auto"
      >
        {/* Header with Image */}
        <div className="relative mb-6">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute right-2 top-2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full"
          >
            <MdClose className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
            <img
              src={captureState.uploadedImage || captureState.image || ''}
              alt={historicalData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-2xl font-bold text-white">{historicalData.title}</h2>
              <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                <MdLocationOn className="w-4 h-4" />
                <span>Historical Landmark</span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer isPlaying={isPlaying} onToggle={toggleVoiceOver} />
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-teal-700 mb-2">
                <MdTimeline className="w-5 h-5" />
                <span className="font-semibold">Year Built</span>
              </div>
              <p className="text-teal-900">{historicalData.year}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <MdArchitecture className="w-5 h-5" />
                <span className="font-semibold">Style</span>
              </div>
              <p className="text-orange-900">Historical Architecture</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{historicalData.description}</p>
          </div>

          {/* Architecture */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-teal-800 mb-3">
              <MdArchitecture className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Architecture</h3>
            </div>
            <p className="text-teal-700 leading-relaxed">{historicalData.architecture}</p>
          </div>

          {/* Cultural Significance */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-orange-800 mb-3">
              <MdPeople className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Cultural Significance</h3>
            </div>
            <p className="text-orange-700 leading-relaxed">{historicalData.culturalSignificance}</p>
          </div>

          {/* Timeline */}
          {historicalData.timeline.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-800 mb-4">
                <MdTimeline className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Historical Timeline</h3>
              </div>
              <div className="space-y-4">
                {historicalData.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.year}
                    </div>
                    <p className="text-purple-900 flex-1 text-sm leading-relaxed">{event.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Padding for scrolling */}
        <div className="h-6" />
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
                    <h2 className="text-xl font-semibold text-teal-800">Ready to Explore?</h2>
                    {cameraState.error ? (
                      <p className="text-sm text-red-600 text-center">{cameraState.error}</p>
                    ) : (
                      <p className="text-sm text-teal-600 text-center">
                        Allow camera access to explore hidden stories around you.
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

              {/* Update test button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTestClick}
                className="p-6 text-white bg-teal-500 rounded-full shadow-lg"
              >
                <MdAutoAwesome className="w-8 h-8" />
                <span className="text-xs block mt-1">Test</span>
              </motion.button>

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
      <AnimatePresence>{captureState.isScanning && renderScanningOverlay()}</AnimatePresence>
      <AnimatePresence>
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleImageUpload}
        />
      </AnimatePresence>
    </div>
  );
};

export default ARExplorer;
