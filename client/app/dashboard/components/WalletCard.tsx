'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import Image from 'next/image';

const WalletCard = () => {
  const { user } = useAuthStore();

  return (
    <Link href="/wallet">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full bg-gradient-to-br from-[#4287f5] to-[#42c7c7] rounded-2xl p-4 shadow-lg mt-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-white/90 text-lg font-medium">Travel Buddy Wallet</h3>
          <div className="bg-white/20 rounded-full p-2">
            <Image src="/coin.png" alt="Coin" width={20} height={20} />
          </div>
        </div>

        <p className="text-white text-2xl font-bold mb-3">
          ${user?.wallet?.balance?.toFixed(2) || '0.00'}
        </p>

        <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
          <Image src="/coin.png" alt="Coin" width={16} height={16} />
          <p className="text-white text-sm">
            <span className="font-semibold">{user?.wallet?.coins || 0}</span> Travel Coins
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default WalletCard;
