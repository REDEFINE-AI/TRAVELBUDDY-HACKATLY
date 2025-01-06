"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { AuthCard } from '../components/auth/AuthCard';
import { Input } from '../components/auth/Input';
import { validateField } from '../utils/validation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

interface SignupFormData {
  email: string;
  phone: string;
  password: string;
  otp: string;
  errors: {
    email: string;
    phone: string;
    password: string;
    otp: string;
  };
}

export const SignupPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    phone: '',
    password: '',
    otp: '',
    errors: { email: '', phone: '', password: '', otp: '' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      otp: step === 2 ? validateField('otp', formData.otp) : ''
    };

    if (Object.values(errors).some(error => error)) {
      setFormData(prev => ({ ...prev, errors }));
      return;
    }

    if (step === 1) {
      setStep(2);
      // Handle OTP sending logic here
    } else {
      // Handle signup completion
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => step === 1 ? router.push('/welcome') : setStep(1)}
          className="text-white"
        >
          <FiArrowLeft size={16} />
        </motion.button>
      </div>

      <AuthCard>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Create Account' : 'Verify Phone'}
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          {step === 1 ? 'Get started for free' : 'Enter the OTP sent to your phone'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <Input
                type="email"
                label="Email"
                icon={<FiMail size={14} />}
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={formData.errors.email}
                placeholder="Enter your email"
              />

              <Input
                type="tel"
                label="Phone Number"
                icon={<FiPhone size={14} />}
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                error={formData.errors.phone}
                placeholder="Enter your phone number"
              />

              <Input
                type="password"
                label="Password"
                icon={<FiLock size={14} />}
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                error={formData.errors.password}
                placeholder="Create a password"
              />
            </>
          ) : (
            <Input
              type="text"
              label="OTP"
              icon={<FiLock size={14} />}
              value={formData.otp}
              onChange={e => setFormData(prev => ({ ...prev, otp: e.target.value }))}
              error={formData.errors.otp}
              placeholder="Enter 6-digit OTP"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl
              py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            type="submit"
          >
            {step === 1 ? 'Continue' : 'Verify & Create Account'}
          </motion.button>
        </form>

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-3 border border-gray-300 text-gray-600 rounded-lg text-xs"
          >
            <FcGoogle className="mr-1" size={16} />
            Google
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-3 border border-gray-300 text-gray-600 rounded-lg text-xs"
          >
            <FaFacebook className="mr-1 text-blue-600" size={16} />
            Facebook
          </motion.button>
        </div>
      </AuthCard>
    </div>
  );
};

export default SignupPage;
