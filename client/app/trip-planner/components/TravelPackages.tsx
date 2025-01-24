'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaSave, FaHotel, FaPlane, FaCar, FaMapMarkerAlt, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';
import { defaultImages } from '@/app/constants/defaultImages';

interface Transportation {
  type: 'flight' | 'train' | 'bus';
  provider: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  image: string;
  bookingUrl: string;
}

interface Activity {
  time: string;
  description: string;
  price: number;
  location: string;
  image: string;
  bookingUrl: string;
  isEditing?: boolean;
  duration: string;
  category: 'sightseeing' | 'food' | 'culture' | 'adventure' | 'relaxation';
}

interface Hotel {
  name: string;
  pricePerNight: number;
  rating: number;
  location: string;
  description: string;
  amenities: string[];
  image: string;
  bookingUrl: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
}

interface DayPlan {
  date: Date;
  transportation?: Transportation;
  activities: Activity[];
  meals: {
    breakfast?: Activity;
    lunch?: Activity;
    dinner?: Activity;
  };
}

interface TravelPackage {
  id: string;
  type: 'budget' | 'comfort' | 'luxury';
  title: string;
  description: string;
  price: number;
  hotel: Hotel;
  itinerary: DayPlan[];
  image: string;
  highlights: string[];
  inclusions: string[];
  cancellationPolicy: string;
}

interface TravelPackagesProps {
  tripData: {
    destination: string;
    startDate: Date;
    endDate: Date;
    travelers: number;
  };
  onBack: () => void;
}

const defaultPackage: TravelPackage = {
  id: '1',
  type: 'comfort',
  title: 'Default Package',
  description: 'Loading package details...',
  price: 0,
  image: defaultImages.destination,
  highlights: [],
  inclusions: [],
  cancellationPolicy: '',
  hotel: {
    name: 'Sample Hotel',
    pricePerNight: 0,
    rating: 4,
    location: 'City Center',
    description: '',
    amenities: [],
    image: defaultImages.hotel,
    bookingUrl: '#',
    roomType: 'Standard Room',
    checkIn: '14:00',
    checkOut: '12:00'
  },
  itinerary: []
};

const TravelPackages = ({ tripData, onBack }: TravelPackagesProps) => {
  const [packages, setPackages] = useState<TravelPackage[]>([defaultPackage]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>(defaultPackage.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'hotel'>('overview');

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPackages = async () => {
      if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
        setError('Missing trip data');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/generate-packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: tripData.destination,
            startDate: tripData.startDate.toISOString(),
            endDate: tripData.endDate.toISOString(),
            travelers: tripData.travelers
          }),
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }

        const data = await response.json();
        
        if (!data.packages || !Array.isArray(data.packages) || data.packages.length === 0) {
          throw new Error('No packages available');
        }

        setPackages(data.packages);
        setSelectedPackage(data.packages[0].id);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Failed to generate packages:', error);
        setError('Failed to generate travel packages. Please try again.');
        // Keep the default package when there's an error
        setPackages([defaultPackage]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();

    return () => {
      controller.abort();
    };
  }, [tripData.destination, tripData.startDate, tripData.endDate, tripData.travelers]);

  const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage) || defaultPackage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Travel Packages</h2>
            <p className="text-sm text-gray-500">
              {tripData.destination} • {format(tripData.startDate, 'MMM dd')} - {format(tripData.endDate, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto" />
          <p className="mt-4 text-gray-600">Generating perfect travel packages for you...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Package Selection Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={clsx(
                  "cursor-pointer rounded-xl overflow-hidden shadow-sm transition-all",
                  selectedPackage === pkg.id ? "ring-2 ring-teal-500" : "hover:shadow-md"
                )}
              >
                <div className="relative h-48">
                  <img
                    src={pkg.image || defaultImages.destination}
                    alt={pkg.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <div className="text-sm font-medium px-2 py-1 bg-teal-500 rounded-full inline-block mb-2">
                      {pkg.type}
                    </div>
                    <h3 className="text-lg font-semibold">{pkg.title}</h3>
                    <p className="text-sm opacity-90">${pkg.price} per person</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Package Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex">
                  {['overview', 'itinerary', 'hotel'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={clsx(
                        "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                        activeTab === tab
                          ? "border-b-2 border-teal-500 text-teal-600"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedPackageData.title}
                      </h3>
                      <p className="text-gray-600">{selectedPackageData.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Price per person</div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${selectedPackageData.price}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {selectedPackageData.itinerary.length} days
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Hotel Rating</div>
                        <div className="text-lg font-semibold text-gray-900 flex items-center">
                          {selectedPackageData.hotel.rating}
                          <FaStar className="text-yellow-400 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Package Highlights</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPackageData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-teal-500 rounded-full" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-8">
                    {selectedPackageData.itinerary.map((day, dayIndex) => (
                      <div key={dayIndex} className="space-y-4">
                        <h4 className="font-medium text-gray-900">
                          Day {dayIndex + 1} - {format(new Date(day.date), 'EEEE, MMM dd')}
                        </h4>

                        {/* Transportation */}
                        {day.transportation && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={day.transportation.image || defaultImages[day.transportation.type]}
                                alt={day.transportation.provider}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      {day.transportation.provider}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {day.transportation.departureTime} - {day.transportation.arrivalTime}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-gray-900">
                                      ${day.transportation.price}
                                    </div>
                                    <Link
                                      href={day.transportation.bookingUrl}
                                      target="_blank"
                                      className="text-sm text-teal-600 hover:text-teal-700"
                                    >
                                      Book now
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        <div className="space-y-4">
                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="bg-white border rounded-lg overflow-hidden"
                            >
                              <div className="relative h-48">
                                <img
                                  src={activity.image || defaultImages.activity}
                                  alt={activity.description}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm text-gray-500">{activity.time}</div>
                                    <h5 className="font-medium text-gray-900">{activity.description}</h5>
                                    <p className="text-sm text-gray-600">{activity.location}</p>
                                    <p className="text-sm text-gray-600">{activity.duration}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-gray-900">${activity.price}</div>
                                    {activity.bookingUrl && (
                                      <Link
                                        href={activity.bookingUrl}
                                        target="_blank"
                                        className="text-sm text-teal-600 hover:text-teal-700"
                                      >
                                        Book now
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'hotel' && (
                  <div className="space-y-6">
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <img
                        src={selectedPackageData.hotel.image || defaultImages.hotel}
                        alt={selectedPackageData.hotel.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedPackageData.hotel.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{selectedPackageData.hotel.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-yellow-400">
                          {Array.from({ length: selectedPackageData.hotel.rating }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                        <span className="text-gray-500">
                          ${selectedPackageData.hotel.pricePerNight} per night
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Room Type</h4>
                        <p className="text-gray-600">{selectedPackageData.hotel.roomType}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Check-in/Check-out</h4>
                        <p className="text-gray-600">
                          Check-in: {selectedPackageData.hotel.checkIn} •{' '}
                          Check-out: {selectedPackageData.hotel.checkOut}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {selectedPackageData.hotel.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-600 text-sm"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedPackageData.hotel.bookingUrl && (
                      <Link
                        href={selectedPackageData.hotel.bookingUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <FaHotel />
                        Book Hotel
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPackages; 