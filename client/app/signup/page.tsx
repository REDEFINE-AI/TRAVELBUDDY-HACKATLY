"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiPhone, FiArrowLeft, FiUser } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { AuthCard } from "../components/auth/AuthCard";
import { Input } from "../components/auth/Input";
import { validateField } from "../utils/validation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";
import axiosInstance from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  errors: {
    name: string;
    email: string;
    password: string;
  };
}

const SignupPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    errors: { name: "", email: "", password: "" },
  });
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
  };

  const validateForm = () => {
    const errors = {
      name: step === 1 ? validateField("name", formData.name) : "",
      email: step === 1 ? validateField("email", formData.email) : "",
      password: step === 1 ? validateField("password", formData.password) : "",
    };

    setFormData((prev) => ({ ...prev, errors }));
    return !Object.values(errors).some((error) => error);
  };

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      let location;
      try {
        const position = await getLocation();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.warn('Location access denied:', error);
        toast.error('Location access denied. Continuing without location.');
      }

      if (step === 1) {
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        if (location) {
          formDataToSend.append('location', JSON.stringify(location));
        }

        const response = await axiosInstance.post('/auth/signup', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { access_token } = response.data;
        setToken(access_token);
        document.cookie = `token=${access_token}; path=/; secure; samesite=strict`;

        // Fetch user data after successful signup
        const userResponse = await axiosInstance.get('/profile/me');
        
        setUser(userResponse.data);

        toast.success('Account created successfully!');
        router.push('/onboarding');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account');
      
      if (error.response?.data?.message) {
        setFormData((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            email: error.response.data.message,
          },
        }));
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleSocialSignup = async (provider: "google" | "facebook") => {
    const loadingToast = toast.loading(`Signing up with ${provider}...`);

    try {
      let location;
      try {
        const position = await getLocation();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.warn('Location access denied:', error);
        toast.error('Location access denied. Continuing without location.');
      }

      const formDataToSend = new FormData();
      if (location) {
        formDataToSend.append('location', JSON.stringify(location));
      }

      const response = await axiosInstance.post(`/auth/${provider}/signup`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { access_token } = response.data;
      setToken(access_token);
      document.cookie = `token=${access_token}; path=/; secure; samesite=strict`;

      // Fetch user data after successful social signup
      const userResponse = await axiosInstance.get('/profile/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      
      setUser(userResponse.data);
      
      toast.success('Account created successfully!');
      router.push('/onboarding');
    } catch (error) {
      console.error(`${provider} signup failed:`, error);
      toast.error(`Failed to sign up with ${provider}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (step === 1) router.push("/");
            else setStep(step - 1);
          }}
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="Go back"
        >
          <FiArrowLeft size={16} />
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "w-56 h-56 absolute -top-0",
          pathname == "/signup" && step == 1 && "-top-6"
        )}
      >
        <Image
          src="/images/TravelBuddy-Logo2.svg"
          alt="TravelBuddy Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      <AuthCard>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6 text-sm">Create Account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            icon={<FiUser size={14} />}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={formData.errors.name}
            placeholder="Enter your full name"
          />

          <Input
            type="email"
            label="Email"
            icon={<FiMail size={14} />}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={formData.errors.email}
            placeholder="Enter your email"
          />

          <Input
            type="password"
            label="Password"
            icon={<FiLock size={14} />}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={formData.errors.password}
            placeholder="Create a password"
          />
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg
              py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>

        <>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialSignup("google")}
              className="flex items-center justify-center p-3 border border-gray-300 
                  text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="mr-1" size={16} />
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialSignup("facebook")}
              className="flex items-center justify-center p-3 border border-gray-300 
                  text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors"
            >
              <FaFacebook className="mr-1 text-blue-600" size={16} />
              Facebook
            </motion.button>
          </div>
        </>
      </AuthCard>
    </div>
  );
};

export default SignupPage;
