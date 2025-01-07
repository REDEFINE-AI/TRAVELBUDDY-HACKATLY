"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { AuthCard } from "../components/auth/AuthCard";
import { Input } from "../components/auth/Input";
import { validateField } from "../utils/validation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

interface LoginFormData {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
  };
}

 const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    errors: { email: "", password: "" },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    if (Object.values(errors).some((error) => error)) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }
    router.push("/onboarding")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/welcome")}
          className="text-white"
        >
          <FiArrowLeft size={16} />
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-56 h-56 absolute -top-0"
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
        <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-600 mb-4">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            icon={<FiMail size={14} />}
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            error={formData.errors.email}
            placeholder="Enter your email"
          />

          <Input
            type="password"
            label="Password"
            icon={<FiLock size={14} />}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            error={formData.errors.password}
            placeholder="Enter your password"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg
              py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-teal-600 hover:text-teal-700 text-xs font-medium"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative py-3">
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

export default LoginPage;
