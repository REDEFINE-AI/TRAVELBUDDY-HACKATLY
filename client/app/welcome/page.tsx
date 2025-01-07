"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

let hasSeenLoadingScreen = false;

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 bg-white flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-72 h-72 relative"
    >
      <Image
        src="/images/TravelBuddy-Logo.svg"
        alt="TravelBuddy Logo"
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  </motion.div>
);

const WelcomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(!hasSeenLoadingScreen);

  useEffect(() => {
    if (!hasSeenLoadingScreen) {
      const timer = setTimeout(() => {
        setLoading(false);
        hasSeenLoadingScreen = true;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-teal">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-700 p-6 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Welcome to TravelBuddy
                </h1>
                <p className="text-teal-100 mb-8">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis facilis earum corrupti sequi labore. Explicabo mollitia voluptas ad.
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-teal-700 rounded-lg py-3 px-4 font-semibold shadow-lg"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white rounded-lg py-3 px-4 font-semibold shadow-lg"
                  onClick={() => router.push("/signup")}
                >
                  Create Account
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomePage;