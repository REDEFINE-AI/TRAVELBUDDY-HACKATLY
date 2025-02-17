import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  subscriptions: {
    id: string;
    user_id: string;
    plan: string;
    start_date: string;
    translator_limit: number;
    trip_limit: number;
    ar_limit: number;
    end_date: string;
  };
  wallet: {
    id: string;
    balance: number;
    coins: number;
    user_id: string;
    transactions: {
      id: string;
      wallet_id: string;
      amount: number;
      transaction_type: string;
      transaction_date: string;
    }[];
  };
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore; 