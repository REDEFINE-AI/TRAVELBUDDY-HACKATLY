'use client';

import React, { useState } from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaDollarSign,
  FaExchangeAlt,
  FaChevronDown,
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
}

const ComingSoonModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed bottom-0 left-0 right-0
                     bg-white rounded-t-[24px] p-6 z-50
                     w-full md:w-[85%] md:max-w-[400px]
                     md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                     md:rounded-2xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-teal-50/50 p-2 rounded-lg">
                <svg
                  className="w-4 h-4 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Coming Soon</h3>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              We're crafting something special just for you! Our team is working hard to bring you
              an amazing new feature.
            </p>

            {/* Feature List */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">What to expect:</p>
              <div className="space-y-2">
                {[
                  { icon: '⚡️', text: 'Enhanced user experience' },
                  { icon: '🔄', text: 'Seamless transactions' },
                  { icon: '🔒', text: 'Advanced security features' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{item.icon}</span>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full bg-teal-500 text-white py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200 hover:bg-teal-600 active:scale-[0.98]"
            >
              Got it!
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const WalletCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore(state => state.user);

  if (!user?.wallet) return null;
  console.log(user.wallet);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        {/* Main wallet card */}
        <div className="relative w-full bg-gradient-to-br from-[#4287f5] to-[#42c7c7] rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-white/90 text-xl font-medium">Travel Buddy Wallet</h3>
          </div>

          <p className="text-white text-4xl font-bold mb-4">₹{user.wallet.balance.toFixed(2)}</p>

          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <img src="/coin.png" alt="Coin" className="w-5 h-5" />
            <p className="text-white text-base">
              <span className="font-semibold">{user.wallet.coins}</span> Travel Coins
            </p>
          </div>

          <div className="mt-6">
            <p className="text-white/70 text-sm mb-1">Wallet ID</p>
            <p className="text-white text-lg tracking-[0.5em] font-medium">
              {user.wallet.id
                .slice(-12)
                .match(/.{1,4}/g)
                ?.join(' ') || user.wallet.id}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-2 bg-teal-500 text-white p-4 rounded-2xl"
          >
            <div className="bg-white/20 rounded-full p-3">
              <FaPlus className="text-lg" />
            </div>
            <span className="font-medium text-sm">Add Money</span>
          </motion.button>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl border border-gray-100"
          >
            <div className="bg-teal-50 rounded-full p-3">
              <FaExchangeAlt className="text-lg text-teal-500" />
            </div>
            <span className="font-medium text-sm text-gray-700">Pay at Market</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-2 bg-teal-500 text-white p-4 rounded-2xl"
          >
            <div className="bg-white/20 rounded-full p-3">
              <img src="/coin.png" alt="Coin" className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">Redeem Coins</span>
          </motion.button>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl border border-gray-100"
          >
            <div className="bg-teal-50 rounded-full p-3">
              <QRCodeSVG value="wallet-id" size={20} className="text-teal-500" />
            </div>
            <span className="font-medium text-sm text-gray-700">Show QR</span>
          </motion.button>
        </div>
      </motion.div>

      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

const TransactionHistory: React.FC = () => {
  const user = useAuthStore(state => state.user);

  if (!user?.wallet) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Travel Transactions</h2>
        <button className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-xl text-sm font-medium">
          This Month
          <FaChevronDown className="text-xs" />
        </button>
      </div>

      <div className="space-y-4">
        {user.wallet.transactions.map(tx => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  tx.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span
                  className={`text-lg font-bold ${
                    tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.transaction_type === 'credit' ? '+' : '-'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Transaction</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    {new Date(tx.transaction_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <p
              className={`font-semibold ${
                tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{tx.amount.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const WalletPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <WalletCard />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default WalletPage;
