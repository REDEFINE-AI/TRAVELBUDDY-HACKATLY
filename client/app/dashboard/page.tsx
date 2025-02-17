'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import CardContainer from './components/SmallCardContainer';
import Title from './components/Title';
import Tools from './Tools';
import WalletCard from './components/WalletCard';
import DiscoverPlaces from './components/DiscoverPlaces';
import SubscriptionStatus from './components/SubscriptionStatus';
import { motion } from 'framer-motion';

interface TripData {
  trip_details: {
    hotels: Array<{
      name: string;
      image: string;
      rating: number;
    }>;
    activities: Array<{
      description: string;
      image: string;
      time: string;
    }>;
  };
}

export default function Page() {
  const [tripData, setTripData] = useState<TripData | null>(null);

  useEffect(() => {
    const savedTripData = localStorage.getItem('tripData');
    if (savedTripData) {
      setTripData(JSON.parse(savedTripData));
    }
  }, []);

  return (
    <div className="w-full h-screen mb-64 bg-white px-4 pt-4">
      <Header />
      <Title />
      <CardContainer />
      <Tools />
      <WalletCard />
      <DiscoverPlaces />

      {/* Active Trip Section - Balanced View */}
      {tripData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-lg overflow-hidden shadow-md border border-gray-100"
        >
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3">
            <h2 className="text-sm font-medium text-white flex items-center gap-2">
              <span>✈️</span> Active Trip
            </h2>
          </div>

          <div className="bg-white p-4">
            {/* Current Hotel - Brief View */}
            {tripData.trip_details.hotels[0] && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={tripData.trip_details.hotels[0].image}
                    alt="Hotel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {tripData.trip_details.hotels[0].name}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs text-gray-600">
                      {tripData.trip_details.hotels[0].rating}/5
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Activity */}
            {tripData.trip_details.activities[0] && (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={tripData.trip_details.activities[0].image}
                    alt="Activity"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {tripData.trip_details.activities[0].description}
                  </p>
                  <p className="text-xs text-teal-600 mt-1">
                    Next up: {tripData.trip_details.activities[0].time}
                  </p>
                </div>
                <button
                  className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  onClick={() => (window.location.href = '/trip-planner/itinerary')}
                >
                  View Itinerary
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
