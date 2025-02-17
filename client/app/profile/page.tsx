'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiEdit2, FiSettings, FiClock, FiHeart, FiMap, FiGlobe, FiMessageSquare, FiCalendar, FiUsers } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState({
    name: authUser?.username || 'Guest User',
    email: authUser?.email || 'guest@example.com',
    subscription: authUser?.subscriptions?.plan || 'Free Plan',
    credits: {
      aiPlanning: authUser?.subscriptions?.translator_limit || 0,
      liveTranslator: authUser?.subscriptions?.trip_limit || 0,
      arExploration: authUser?.subscriptions?.ar_limit || 0
    },  
    coins: authUser?.wallet?.coins || 0,
  });
  console.log(authUser,"authUser");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  
  const [tripHistory] = useState([
    { 
      id: 1, 
      destination: 'Paris, France',
      date: '2024-03-15',
      duration: '5 days',
      image: '/destinations/paris-france.jpg',
      passengers: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
      liked: false,
      comments: 3
    },
    { 
      id: 2, 
      destination: 'Tokyo, Japan',
      date: '2024-02-20',
      duration: '7 days',
      image: '/destinations/tokyo-japan.jpg',
      passengers: ['Frank', 'Grace', 'Henry'],
      liked: true,
      comments: 5
    },
  ]);

  const [forumPosts] = useState([
    { id: 1, title: 'Best spots in Barcelona', likes: 24, comments: 12, date: '2024-03-10' },
    { id: 2, title: 'Hidden gems in Rome', likes: 15, comments: 8, date: '2024-03-05' },
  ]);

  return (
    <div className="min-h-screen bg-white p-4 pb-24 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsEditModalOpen(true)}
        >
          <FiEdit2 className="w-5 h-5 text-teal-600" />
        </button>
      </div>

      {/* Subscription & Credits */}
      <div className="bg-teal-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-teal-800">Current Plan</h2>
          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
            {user.subscription}
          </span>
        </div>
        
        {/* Updated Credits Display */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AI Planning</span>
              <FiSettings className="text-teal-600 w-4 h-4" />
            </div>
            <p className="text-xl font-semibold text-teal-800">{user.credits.aiPlanning}</p>
            <span className="text-xs text-gray-500">credits left</span>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Translator</span>
              <FiGlobe className="text-teal-600 w-4 h-4" />
            </div>
            <p className="text-xl font-semibold text-teal-800">{user.credits.liveTranslator}</p>
            <span className="text-xs text-gray-500">credits left</span>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AR Explore</span>
              <FiMap className="text-teal-600 w-4 h-4" />
            </div>
            <p className="text-xl font-semibold text-teal-800">{user.credits.arExploration}</p>
            <span className="text-xs text-gray-500">credits left</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg p-2 px-3">
          <Image src="/coin.png" alt="Coins" width={20} height={20} />
          <span className="text-teal-800 font-medium">{user.coins}</span>
          <span className="text-gray-600 text-sm">coins available</span>
        </div>
      </div>

      {/* Modified Features Grid - Remove credit-related cards */}
      <div className="grid grid-cols-2 gap-4">
        <FeatureCard 
          icon={<FiMap />}
          title="Trip History"
          description="View your past adventures"
          onClick={() => setIsHistoryModalOpen(true)}
        />
        <FeatureCard 
          icon={<FiMessageSquare />}
          title="Your Posts"
          description="View your forum activity"
        />
      </div>

      {/* Edit Profile Modal */}
      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsEditModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full">
                      <FiEdit2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Email"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Trip History Modal */}
      <Transition show={isHistoryModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsHistoryModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-x-0 bottom-0">
            <Dialog.Panel className="bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Trip History</h2>
                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="text-gray-600">✕</span>
                </button>
              </div>
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <div 
                    key={trip.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden relative bg-gray-100">
                        <Image
                          src={trip.image || `/destinations/${trip.destination.toLowerCase().replace(', ', '-')}.jpg`}
                          alt={trip.destination}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{trip.destination}</h3>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                              <FiHeart className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                              <FiMessageSquare className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiClock className="w-4 h-4" />
                            <span>{trip.duration}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiCalendar className="w-4 h-4" />
                              <div>
                                <p>Start: {formatDate(trip.date)}</p>
                                <p>End: {formatEndDate(trip.date, trip.duration)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i}
                                  className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center"
                                >
                                  <span className="text-xs font-medium text-teal-600">
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">+2 more</span>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1.5 text-sm bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100">
                            View Details
                          </button>
                          <button className="px-3 py-1.5 text-sm bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100">
                            Share Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Feature Modal */}
      <AnimatePresence>
        {isFeatureModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-50"
          >
            <Dialog onClose={() => setIsFeatureModalOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/30" />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed inset-x-0 bottom-0"
              >
                <Dialog.Panel className="bg-white rounded-t-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Feature Details</h2>
                    <button onClick={() => setIsFeatureModalOpen(false)}>✕</button>
                  </div>
                  {/* Add feature-specific content here */}
                </Dialog.Panel>
              </motion.div>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
        <div className="text-teal-600">{icon}</div>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatEndDate(startDate: string, duration: string) {
  const days = parseInt(duration);
  const end = new Date(startDate);
  end.setDate(end.getDate() + days);
  return formatDate(end.toISOString());
}
