'use client';

import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaPlus, FaDollarSign, FaExchangeAlt, FaChevronDown } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface Transaction {
    id: number;
    date: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    status: 'completed' | 'pending' | 'failed';
}

const transactions: Transaction[] = [
    {
        id: 1,
        date: '2024-03-20',
        amount: 250.00,
        type: 'credit',
        description: 'Salary Deposit',
        status: 'completed'
    },
    {
        id: 2,
        date: '2024-03-19',
        amount: 45.50,
        type: 'debit',
        description: 'Restaurant Payment',
        status: 'completed'
    },
    // ... more transactions
];

const WalletCard: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Main wallet card */}
            <div className="relative w-full bg-gradient-to-br from-[#4287f5] to-[#42c7c7] rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-white/90 text-xl font-medium">
                        Travel Buddy Wallet
                    </h3>
                    <img 
                        src="/travel-buddy-logo.png" 
                        alt="Travel Buddy" 
                        className="w-8 h-8"
                    />
                </div>

                <p className="text-white text-4xl font-bold mb-4">
                    $2,459.50
                </p>

                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                    <img src="/coin.png" alt="Coin" className="w-5 h-5" />
                    <p className="text-white text-base">
                        <span className="font-semibold">1,259</span> Travel Coins
                    </p>
                </div>

                <div className="mt-6">
                    <p className="text-white/70 text-sm mb-1">Wallet ID</p>
                    <p className="text-white text-lg tracking-[0.5em] font-medium">
                        XXXX XXXX  <span className="font-semibold">6467</span>
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <motion.button 
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center justify-center gap-2 bg-teal-500 text-white p-4 rounded-2xl"
                >
                    <div className="bg-white/20 rounded-full p-3">
                        <FaPlus className="text-lg" />
                    </div>
                    <span className="font-medium text-sm">Add Money</span>
                </motion.button>
                <motion.button 
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
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center justify-center gap-2 bg-teal-500 text-white p-4 rounded-2xl"
                >
                    <div className="bg-white/20 rounded-full p-3">
                        <img src="/coin.png" alt="Coin" className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Redeem Coins</span>
                </motion.button>
                <motion.button 
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
    );
};

const TransactionHistory: React.FC = () => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Travel Transactions
                </h2>
                <button className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-xl text-sm font-medium">
                    This Month
                    <FaChevronDown className="text-xs" />
                </button>
            </div>

            <div className="space-y-4">
                {transactions.map((tx) => (
                    <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${
                                tx.type === 'credit' 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                            }`}>
                                <span className={`text-lg font-bold ${
                                    tx.type === 'credit' 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                }`}>
                                    {tx.type === 'credit' ? '+' : '-'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{tx.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-gray-500">{tx.date}</p>
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                        <img src="/coin.png" alt="Coin" className="w-3 h-3" />
                                        <span className="text-xs text-blue-600 font-medium">+5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className={`font-semibold ${
                            tx.type === 'credit' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                        }`}>
                            ${tx.amount.toFixed(2)}
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
