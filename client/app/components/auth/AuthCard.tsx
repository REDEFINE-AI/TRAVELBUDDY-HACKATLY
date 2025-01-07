import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full min-h-[450px]  bg-white rounded-t-3xl absolute bottom-0 shadow-xl p-8 mt-10  z-10"
  >
    {children}
  </motion.div>
);