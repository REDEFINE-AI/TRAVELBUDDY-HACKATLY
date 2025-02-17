'use client';

import { motion } from 'framer-motion';
import useAuthStore from '@/store/useAuthStore';
import { FaCrown } from 'react-icons/fa';

const SubscriptionStatus = () => {
  const { user } = useAuthStore();

  if (!user?.subscriptions) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="mt-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-4"
    >
      <div className="flex items-center gap-3">
        <div className="bg-amber-500 p-2 rounded-lg">
          <FaCrown className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-amber-900 font-medium capitalize">{user.subscriptions.plan}</h3>
          <p className="text-amber-700 text-xs">
            Valid till {new Date(user.subscriptions.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionStatus;
