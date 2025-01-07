"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { AuthCard } from '../components/auth/AuthCard';
import { Input } from '../components/auth/Input';
import { OTPInput } from '../components/auth/OTPInput';
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

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const handleOTPChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      otp: value,
      errors: { ...prev.errors, otp: value.length === 6 ? '' : 'Please enter all 6 digits' }
    }));
  };

  const validateForm = () => {
    const errors = {
      email: step === 1 ? validateField('email', formData.email) : '',
      phone: step === 1 ? validateField('phone', formData.phone) : '',
      password: step === 1 ? validateField('password', formData.password) : '',
      otp: step === 2 ? validateField('otp', formData.otp) : ''
    };

    setFormData(prev => ({ ...prev, errors }));
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (step === 1) {
        // Add your API call to send OTP here
        // await sendOTP(formData.phone);
        setStep(2);
      } else {
        // Add your API call to verify OTP and complete signup here
        // await verifyOTPAndSignup(formData);
        router.push('/dashboard'); // or wherever you want to redirect after successful signup
      }
    } catch (error) {
      // Handle error appropriately
      console.error('Error:', error);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'facebook') => {
    // Implement social signup logic
    console.log(`${provider} signup clicked`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => step === 1 ? router.push('/welcome') : setStep(1)}
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="Go back"
        >
          <FiArrowLeft size={16} />
        </motion.button>
      </div>

      <AuthCard>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Create Account' : 'Verify Phone'}
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          {step === 1 
            ? 'Get started for free' 
            : `Enter the verification code sent to ${formData.phone}`
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <Input
                type="email"
                label="Email"
                icon={<FiMail size={14} />}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={formData.errors.email}
                placeholder="Enter your email"
              />

              <Input
                type="tel"
                label="Phone Number"
                icon={<FiPhone size={14} />}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={formData.errors.phone}
                placeholder="Enter your phone number"
              />

              <Input
                type="password"
                label="Password"
                icon={<FiLock size={14} />}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={formData.errors.password}
                placeholder="Create a password"
              />
            </>
          ) : (
            <OTPInput
              value={formData.otp}
              onChange={handleOTPChange}
              error={formData.errors.otp}
            />
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl
              py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            type="submit"
          >
            {step === 1 ? 'Continue' : 'Verify & Create Account'}
          </motion.button>

          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                // Add resend OTP logic here
                console.log('Resend OTP clicked');
              }}
              className="w-full text-center text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              Didn't receive code? Resend
            </button>
          )}
        </form>

        {step === 1 && (
          <>
            <div className="relative py-4">
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
                onClick={() => handleSocialSignup('google')}
                className="flex items-center justify-center p-3 border border-gray-300 
                  text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="mr-1" size={16} />
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignup('facebook')}
                className="flex items-center justify-center p-3 border border-gray-300 
                  text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="mr-1 text-blue-600" size={16} />
                Facebook
              </motion.button>
            </div>
          </>
        )}
      </AuthCard>
    </div>
  );
};

export default SignupPage;