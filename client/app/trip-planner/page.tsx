'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import Image from 'next/image';
import TravelPackages from './components/TravelPackages';
import axios from 'axios';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TravelersSelector from './components/TravelersSelector';

interface Place {
  label: string;
  value: string;
  image?: string;
}

interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: { latitude: number; longitude: number };
  description: string;
  amenities: Record<string, any>;
  image: string;
  booking_url: string;
}

interface Activity {
  id: string;
  time: string;
  description: string;
  price: number;
  location: string;
  image: string;
  booking_url: string;
  duration: string;
  category: string;
}

interface Attraction {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

interface Package {
  id: string;
  type: string;
  title: string;
  description: string;
  price: number;
  hotel: {
    name: string;
    pricePerNight: number;
    rating: number;
    amenities: string[];
  };
  itinerary: Array<{
    date: string;
    activities: Array<{
      time: string;
      description: string;
      price: number;
      bookingUrl: string;
    }>;
  }>;
}

interface TripResponse {
  trip_details: {
    hotels: Hotel[];
    activities: Activity[];
    attractions: Attraction[];
  };
  packages: {
    packages: Package[];
  };
}

interface LocationSuggestion {
  formatted: string;
  city?: string;
  country?: string;
}

const TripPlanner = () => {
  const router = useRouter();
  const [destination, setDestination] = useState<Place | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [travelers, setTravelers] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

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

  // Function to fetch location suggestions
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: query,
          key: 'eff4152b754f41cdae480219c2bf84df',
          limit: 5,
          no_annotations: 1,
        },
      });
      if (response.data.results.length > 0) {
        const suggestions = response.data.results.map((result: any) => ({
          formatted: result.formatted,
          city: result.components.city || result.components.town,
          country: result.components.country,
        }));
        setLocationSuggestions(suggestions);
      } else {
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationSuggestions([]);
    }
  };

  // Update destination input to use suggestions
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination({ label: value, value });
    fetchLocationSuggestions(value);
  };

  const handleNext = async () => {
    if (!destination || !dateRange.startDate || !dateRange.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('destination', 'munnar');
      // Format dates to day-month-year
      const startDateFormatted = dateRange.startDate
        ?.toLocaleDateString('en-GB')
        .split('/')
        .reverse()
        .join('-');
      const endDateFormatted = dateRange.endDate
        ?.toLocaleDateString('en-GB')
        .split('/')
        .reverse()
        .join('-');
      formData.append('start_date', startDateFormatted || '');
      formData.append('end_date', endDateFormatted || '');
      formData.append('travelers', travelers.toString());

      const response = await axiosInstance.post<TripResponse>('/trip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store the response data in localStorage or state management
      localStorage.setItem('tripData', JSON.stringify(response.data));

      // Navigate to the itinerary page
      router.push('/trip-planner/itinerary');
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b pb-20 from-teal-50 to-white px-4 py-4">
      <div className="max-w-md mx-auto">
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
            <input
              type="text"
              value={destination?.value || ''}
              onChange={handleDestinationChange}
              placeholder="Where would you like to go?"
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col"
                    onClick={() => {
                      setDestination({
                        label: suggestion.formatted,
                        value: suggestion.formatted,
                      });
                      setLocationSuggestions([]);
                    }}
                  >
                    <span className="font-medium text-gray-900">{suggestion.formatted}</span>
                    {suggestion.city && suggestion.country && (
                      <span className="text-sm text-gray-500">
                        {suggestion.city}, {suggestion.country}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dates Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 z-[990]">
            <div className="flex items-center gap-3 mb-3">
              <FaCalendarAlt className="text-teal-500 text-lg" />
              <span className="text-sm font-medium text-gray-700">Travel Dates</span>
            </div>
            <div className="flex gap-2">
              <DatePicker
                selected={dateRange.startDate}
                onChange={date => setDateRange({ ...dateRange, startDate: date || undefined })}
                selectsStart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                placeholderText="Start Date"
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <DatePicker
                selected={dateRange.endDate}
                onChange={date => setDateRange({ ...dateRange, endDate: date || undefined })}
                selectsEnd
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate}
                placeholderText="End Date"
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>
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
          <motion.button
            onClick={handleNext}
            className="w-full bg-teal-600 text-white px-4 py-3 rounded-xl text-sm font-medium
                     hover:bg-teal-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating your trip...
              </span>
            ) : (
              'Continue'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
