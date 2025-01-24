'use client';

import { useState, useEffect } from 'react';
import { useTripStore } from '../store/useTripStore';
import DestinationSelector from './components/DestinationSelector';
import DateRangePicker from './components/DateRangePicker';
import TravelersSelector from './components/TravelersSelector';
import { FaMapMarkedAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import Image from 'next/image';
import TravelPackages from './components/TravelPackages';

interface Place {
  label: string;
  value: string;
  image?: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface TripStep {
  step: 'planning' | 'packages';
}

const TripPlanner = () => {
  const { tripData, updateTripData } = useTripStore();

  const [destination, setDestination] = useState<Place | null>(
    tripData.destination
      ? {
          label: tripData.destination,
          value: tripData.destination,
        }
      : null,
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: tripData.startDate || null,
    endDate: tripData.endDate || null,
  });
  const [travelers, setTravelers] = useState<number>(tripData.travelers || 1);

  // Add new state for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [currentStep, setCurrentStep] = useState<TripStep['step']>('planning');

  const destinationImages = [
    {
      src: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
      alt: 'Santorini, Greece',
    },
    {
      src: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
      alt: 'Machu Picchu, Peru',
    },
    {
      src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      alt: 'Bali, Indonesia',
    },
    {
      src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
      alt: 'Venice, Italy',
    },
    {
      src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
      alt: 'Dubai, UAE',
    },
    {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      alt: 'Paris, France',
    },
    {
      src: 'https://images.unsplash.com/photo-1508804052814-cd3ba865a116',
      alt: 'Great Wall, China',
    },
    {
      src: 'https://images.unsplash.com/photo-1548013146-72479768bada',
      alt: 'Taj Mahal, India',
    },
    {
      src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
      alt: 'Maldives',
    },
    {
      src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      alt: 'New York City, USA',
    },
  ];

  // Auto-rotate images with reduced timer (3 seconds instead of 5)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % destinationImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tripData.destination && !destination) {
      setDestination({
        label: tripData.destination,
        value: tripData.destination,
      });
    }
    if (tripData.startDate) setDateRange(prev => ({ ...prev, startDate: tripData.startDate }));
    if (tripData.endDate) setDateRange(prev => ({ ...prev, endDate: tripData.endDate }));
    if (tripData.travelers) setTravelers(tripData.travelers);
  }, [tripData, destination]);

  const handleNext = () => {
    if (!destination || !dateRange.startDate || !dateRange.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    updateTripData('destination', destination.value);
    updateTripData('startDate', dateRange.startDate);
    updateTripData('endDate', dateRange.endDate);
    updateTripData('travelers', travelers);
    setCurrentStep('packages');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b pb-20 from-teal-50 to-white px-4 py-4">
      <div className="max-w-md mx-auto">
        {currentStep === 'planning' ? (
          <>
            {/* Hero Card Carousel */}
            <div className="mb-10 mt-6 w-full h-48 relative rounded-xl overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={`${destinationImages[currentImageIndex].src}?auto=format&fit=crop&w=1200&q=80`}
                  alt={destinationImages[currentImageIndex].alt}
                  fill
                  className="object-cover transition-all duration-700 ease-in-out transform scale-105"
                  priority
                  unoptimized
                />
                {/* Reduced overlay opacity from 0.4 to 0.25 */}
                <div className="absolute inset-0 bg-black/25" />
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-2">Plan Your Trip</h1>
                <p className="text-sm text-white/90">Let's create your perfect journey</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Destination Section */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaMapMarkedAlt className="text-teal-500 text-lg" />
                  <span className="text-sm font-medium text-gray-700">Destination</span>
                </div>
                <DestinationSelector value={destination} onChange={setDestination} />
              </div>

              {/* Dates Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 z-[990]">
                <div className="flex items-center gap-3 mb-3">
                  <FaCalendarAlt className="text-teal-500 text-lg" />
                  <span className="text-sm font-medium text-gray-700">Travel Dates</span>
                </div>
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onChange={setDateRange}
                />
              </div>

              {/* Travelers Section */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaUsers className="text-teal-500 text-lg" />
                  <span className="text-sm font-medium text-gray-700">Travelers</span>
                </div>
                <TravelersSelector value={travelers} onChange={setTravelers} />
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full bg-teal-600 text-white px-4 py-3 rounded-xl text-sm font-medium
                         hover:bg-teal-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          tripData.startDate && tripData.endDate ? (
            <TravelPackages
              tripData={{
                ...tripData,
                startDate: tripData.startDate,
                endDate: tripData.endDate
              }}
              onBack={() => setCurrentStep('planning')}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
