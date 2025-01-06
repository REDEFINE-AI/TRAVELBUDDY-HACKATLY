import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({ 
  type, 
  label, 
  icon, 
  value, 
  onChange, 
  error, 
  placeholder 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1">
      <label className="block text-xss font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          type={showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 mt-1 pr-${isPassword ? '10' : '4'} py-3 text-gray-600 border rounded-lg
            focus:ring-2 focus:ring-teal-500 text-xs focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${error ? 'focus:ring-red-500' : 'focus:ring-teal-500'}`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
