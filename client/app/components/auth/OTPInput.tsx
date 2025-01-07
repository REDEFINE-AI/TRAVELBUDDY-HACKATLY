import React, { useEffect, useRef } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, error }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPinInput = async () => {
      if (containerRef.current) {
        const { default: HSPinInput } = await import('@preline/pin-input');
        
        new HSPinInput(containerRef.current);
        containerRef.current.addEventListener('completed.hs.pin-input', (e: any) => {
          const value = Array.from(containerRef.current?.querySelectorAll('[data-hs-pin-input-item]') || [])
            .map((input: any) => input.value)
            .join('');
          onChange(value);
        });

        containerRef.current.addEventListener('input', () => {
          const value = Array.from(containerRef.current?.querySelectorAll('[data-hs-pin-input-item]') || [])
            .map((input: any) => input.value)
            .join('');
          onChange(value);
        });
      }
    };

    initPinInput();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('completed.hs.pin-input', () => {});
        containerRef.current.removeEventListener('input', () => {});
      }
    };
  }, [onChange]);

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">Verification Code</label>
      <div 
        ref={containerRef}
        data-hs-pin-input='{"length": 6, "type": "number", "clearOnError": true, "mask": false}'
        className="flex gap-2 justify-center"
      >
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            className={`block w-[38px] h-[38px] text-center border rounded-lg text-gray-600 text-sm 
              focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            data-hs-pin-input-item
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};