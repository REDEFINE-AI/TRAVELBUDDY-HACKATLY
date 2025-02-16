declare module 'react-speech-kit' {
    export function useSpeechSynthesis(): {
        speak: (params: { text: string; lang?: string; rate?: number; pitch?: number }) => void;
        speaking: boolean;
        supported: boolean;
    };
} 