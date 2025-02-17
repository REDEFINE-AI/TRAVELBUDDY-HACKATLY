'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FaHotel, FaMapMarkerAlt, FaCalendar, FaEdit, FaTrash, FaUtensils, FaCamera, FaPlus, FaSearch, FaWalking, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import axiosInstance from '@/lib/axios';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';

interface TripResponse {
  trip_details: {
    hotels: Array<{
      id: string;
      hotel_id: string;
      name: string;
      rating: number;
      location: Record<string, any>;
      specific_location: string[];
      description: string;
      amenities: string[];
      image: string;
      booking_url: string;
    }>;
    activities: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      location: string[];
      image: string;
      isBookable: boolean;
    }>;
    attractions: Array<{
      id: string;
      name: string;
      location: string;
      description: string;
      image: string;
    }>;
  };
  packages: {
    packages: Array<{
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
        dayPlan: Array<{
          time: string;
          type: string;
          activity: string;
          description: string;
          duration: string;
          price: number;
          bookingUrl: string;
        }>;
      }>;
    }>;
  };
}

const ItineraryPage = () => {
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState<'hotel' | 'activity' | 'attraction' | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isEditingActivity, setIsEditingActivity] = useState<string | null>(null);
  const [tempTripData, setTempTripData] = useState<TripResponse | null>(null);

  useEffect(() => {
    const savedTripData = localStorage.getItem('tripData');
    if (savedTripData) {
      const parsedData = JSON.parse(savedTripData);
      setTripData(parsedData);
      setTempTripData(parsedData);
      if (parsedData?.packages?.packages[0]?.itinerary?.length > 0) {
        setSelectedDate(parsedData.packages.packages[0].itinerary[0].date);
      }
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!tripData) return;
    
    try {
      await axiosInstance.put('/trip', tripData);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (!tripData) return;
    
    const dayPlan = tripData.packages.packages[0]?.itinerary.find(
      (day) => day.date === date
    );
    setFilteredActivities(dayPlan?.dayPlan || []);
  };

  const handleReorder = (newOrder: { date: string; dayPlan: any[]; }[]) => {
    if (!tripData) return;
    
    const updatedPackages = {...tripData.packages};
    updatedPackages.packages[0].itinerary = newOrder;
    setTripData({...tripData, packages: updatedPackages});
  };

  const handleDeleteActivity = (dayDate: string, activityIndex: number) => {
    if (!tripData) return;
    
    const updatedPackages = {...tripData.packages};
    const dayIndex = updatedPackages.packages[0].itinerary.findIndex(
      (day) => day.date === dayDate
    );
    
    if (dayIndex !== -1) {
      updatedPackages.packages[0].itinerary[dayIndex].dayPlan.splice(activityIndex, 1);
      setTripData({...tripData, packages: updatedPackages});
    }
  };

  const renderActivityCard = (activity: any, dayDate: string, index: number) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'hotel': return <FaHotel className="text-2xl text-teal-600" />;
        case 'food': return <FaUtensils className="text-2xl text-orange-600" />;
        case 'attraction': return <FaCamera className="text-2xl text-blue-600" />;
        default: return <FaWalking className="text-2xl text-green-600" />;
      }
    };

    return (
      <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-sm">
            {getActivityIcon(activity.type)}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h4 className="font-semibold text-xl text-gray-800 mb-2">{activity.activity}</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-sm" />
                    <span className="text-sm font-medium">{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-sm" />
                    <span className="text-sm font-medium">{activity.duration}</span>
                  </div>
                </div>
              </div>
              {editMode && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingActivity(activity.id)}
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaEdit className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteActivity(dayDate, index)}
                    className="p-2.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <FaTrash className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                <FaMapMarkerAlt className="mt-1 text-sm" />
                <p className="text-sm leading-relaxed">{activity.description}</p>
              </div>

              {activity.type === 'hotel' && activity.rating && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{activity.rating}</span>
                  </span>
                  <span className="text-sm text-gray-600">rating</span>
                </div>
              )}

              {activity.price > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-teal-600">
                      ${activity.price}
                    </span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                  
                  {activity.bookingUrl && (
                    <a 
                      href={activity.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
                    >
                      Book Now
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSuggestions = (type: string, query: string = '') => {
    if (!tripData) return [];
    
    const searchTerm = query.toLowerCase();
    switch (type) {
      case 'hotel':
        return tripData.trip_details.hotels.filter(h => 
          h.name.toLowerCase().includes(searchTerm));
      case 'activity':
        return tripData.trip_details.activities.filter(a => 
          a.name.toLowerCase().includes(searchTerm));
      case 'attraction':
        return tripData.trip_details.attractions.filter(a => 
          a.name.toLowerCase().includes(searchTerm));
      default:
        return [];
    }
  };

  const handleAddActivity = (item: any, type: string) => {
    if (!selectedDate || !tempTripData) return;

    const newActivity = {
      time: "12:00",
      type: type,
      activity: item.name,
      description: item.description,
      duration: "2 hours",
      price: item.price || 0,
      bookingUrl: item.booking_url || "",
      id: Date.now().toString()
    };

    const updatedTripData = {...tempTripData};
    const dayIndex = updatedTripData.packages.packages[0].itinerary.findIndex(
      day => day.date === selectedDate
    );

    if (dayIndex !== -1) {
      updatedTripData.packages.packages[0].itinerary[dayIndex].dayPlan.push(newActivity);
      setTempTripData(updatedTripData);
    }
    setIsAddActivityOpen(false);
  };

  const AddActivityModal = () => (
    <Dialog open={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl max-w-2xl w-full p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Activity</h3>
          
          <div className="flex gap-4 mb-6">
            {['hotel', 'activity', 'attraction'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedActivityType(type as any)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedActivityType === type 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {selectedActivityType && (
            <>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestions(getSuggestions(selectedActivityType, e.target.value));
                  }}
                  placeholder="Search..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {getSuggestions(selectedActivityType, searchQuery).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAddActivity(item, selectedActivityType)}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:border-teal-500 cursor-pointer transition-all"
                  >
                    <div className="w-32 h-32 relative overflow-hidden rounded-lg">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className='flex-1'> 
                      <h4 className="font-medium text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {('rating' in item) && item.rating && (
                        <p className="text-yellow-500">Rating: {item.rating} ★</p>
                      )}
                      <div className="mt-2">
                        <span className="text-teal-600 font-semibold">
                          {'price' in item ? `$${item.price}` : 'Price on request'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  if (!tripData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="relative h-64 bg-cover bg-center" 
           style={{ backgroundImage: `url(${tripData.trip_details.attractions[0]?.image || '/default-hero.jpg'})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-6xl mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {tripData.packages.packages[0]?.title || "Your Trip Itinerary"}
            </h1>
            <div className="flex items-center gap-3 text-white">
              <FaCalendar />
              <span>{formatDate(tripData.packages.packages[0]?.itinerary[0]?.date || '')}</span>
              <FaMapMarkerAlt />
              <span>
                {tripData.trip_details.hotels[0]?.location ? 
                  `${tripData.trip_details.hotels[0].location.latitude}, ${tripData.trip_details.hotels[0].location.longitude}` 
                  : 'Location'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8 -mb-px">
            <div className="py-4 px-1 border-b-2 border-teal-500 text-teal-600">
              Itinerary
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {tempTripData?.packages.packages[0]?.itinerary.map(({ date }, index) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center min-w-[120px] p-3 rounded-lg transition-all ${
                selectedDate === date 
                  ? 'bg-teal-600 text-white scale-105' 
                  : 'bg-white border hover:border-teal-500'
              }`}
            >
              <span className="text-sm opacity-75">Day {index + 1}</span>
              <span className="font-medium">{formatDate(date)}</span>
            </button>
          ))}
        </div>

        {selectedDate && (
          <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-teal-400 before:to-teal-100">
            {tempTripData?.packages.packages[0]?.itinerary
              .find(day => day.date === selectedDate)
              ?.dayPlan.map((activity, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-100 shadow-sm" />
                  <div className="ml-4 transform transition-all duration-300 hover:-translate-y-1">
                    {renderActivityCard(activity, selectedDate, index)}
                  </div>
                </div>
              ))}
            
            <button
              onClick={() => {
                setIsAddActivityOpen(true);
                setSelectedActivityType(null);
                setSearchQuery('');
              }}
              className="ml-4 px-6 py-4 bg-white border-2 border-dashed border-teal-300 
                         rounded-xl text-teal-600 hover:border-teal-500 transition-all
                         flex items-center justify-center gap-2 w-full sm:w-auto
                         hover:shadow-md hover:-translate-y-1 duration-300"
            >
              <FaPlus className="text-lg" /> 
              <span className="font-medium">Add New Activity</span>
            </button>
          </div>
        )}

        {editMode && tempTripData !== tripData && (
          <button
            onClick={handleSaveChanges}
            className="mt-8 w-full bg-teal-600 text-white px-6 py-3 rounded-lg
                     font-medium hover:bg-teal-700 transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>

      <AddActivityModal />
    </div>
  );
};

export default ItineraryPage; 