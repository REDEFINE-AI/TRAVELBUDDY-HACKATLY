import { useState, useRef, useEffect } from 'react';

type AudioFile = {
  blob: Blob | null;
  url: string | null;
  format: string | null;
  size: number | null; // Size in bytes
};

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<AudioFile>({
    blob: null,
    url: null,
    format: null,
    size: null,
  });
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunksRef, setAudioChunksRef] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Clear previous chunks and reset state
      setAudioChunksRef([]);
      setAudioFile({ blob: null, url: null, format: null, size: null });
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      // Wait for audio initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      });

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          setAudioChunksRef(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          setAudioChunksRef(currentChunks => {
            if (!currentChunks.length) {
              console.warn('No audio chunks recorded');
              return currentChunks;
            }

            const audioBlob = new Blob(currentChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);

            setAudioFile({
              blob: audioBlob,
              url: audioUrl,
              format: 'webm',
              size: audioBlob.size,
            });

            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());

            return currentChunks;
          });
        } catch (err) {
          console.error('Error processing audio:', err);
          setError('Error processing audio recording');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(50);

      setTimeout(() => {
        setIsRecording(true);
      }, 100);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(err.message || 'Unable to start recording');
    }
  };

  const stopRecording = () => {
    try {
      if (!mediaRecorderRef.current) {
        console.warn('No media recorder found');
        return;
      }

      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData();

        setTimeout(() => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Error stopping recording');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      console.log('Recording paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      console.log('Recording resumed');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioFile.url) {
        window.URL.revokeObjectURL(audioFile.url);
      }
    };
  }, [audioFile.url]);

  // Add this new function to create downloadable file
  const createDownloadableFile = () => {
    if (!audioFile.blob) {
      console.warn('No audio recording available');
      return null;
    }

    // Create a timestamp for unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `audio-recording-${timestamp}.webm`;

    // Create downloadable object
    return {
      url: audioFile.url,
      name: fileName,
      size: audioFile.size,
      blob: audioFile.blob,
    };
  };

  return {
    isRecording,
    audioFile,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    createDownloadableFile, 
  };
}
