"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const WelcomePage: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-700 p-6 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome to TravelBuddy
          </motion.h1>
          <p className="text-teal-100 mb-8">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis facilis earum corrupti sequi labore. Explicabo mollitia voluptas ad, </p>
        </div>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-teal-700 rounded-lg py-3 px-4 font-semibold shadow-lg"
            onClick={() => router.push('/login')}
          >
            Sign In
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white rounded-lg py-3 px-4 font-semibold shadow-lg"
            onClick={() => router.push('/signup')}
          >
            Create Account
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePage;