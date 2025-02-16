'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FaHotel, FaMapMarkerAlt, FaCalendar, FaEdit, FaTrash, FaUtensils, FaCamera, FaPlus, FaSearch, FaWalking } from 'react-icons/fa';
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

  useEffect(() => {
    const savedTripData = localStorage.getItem('tripData');
    if (savedTripData) {
      setTripData(JSON.parse(savedTripData));
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

  // Update handleDateSelect to filter activities
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (!tripData) return;
    
    const dayPlan = tripData.packages.packages[0]?.itinerary.find(
      (day) => day.date === date
    );
    setFilteredActivities(dayPlan?.dayPlan || []);
  };

  // Handle activity reordering
  const handleReorder = (newOrder: { date: string; dayPlan: any[]; }[]) => {
    if (!tripData) return;
    
    const updatedPackages = {...tripData.packages};
    updatedPackages.packages[0].itinerary = newOrder;
    setTripData({...tripData, packages: updatedPackages});
  };

  // Handle activity deletion
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

  // Render activity card with appropriate icon and details
  const renderActivityCard = (activity: any, dayDate: string, index: number) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'hotel': return <FaHotel className="text-xl text-teal-600" />;
        case 'food': return <FaUtensils className="text-xl text-orange-600" />;
        case 'attraction': return <FaCamera className="text-xl text-blue-600" />;
        default: return <FaWalking className="text-xl text-green-600" />;
      }
    };

    return (
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start gap-4">
          {getActivityIcon(activity.type)}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-lg">{activity.activity}</h4>
              {editMode && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingActivity(activity.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <FaEdit className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteActivity(dayDate, index)}
                    className="p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <FaTrash className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
            {activity.price > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-teal-600 font-semibold">${activity.price}</span>
                {activity.bookingUrl && (
                  <a href={activity.bookingUrl} 
                     className="text-sm text-teal-600 hover:underline">
                    Book Now
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced AddActivityModal with suggestions
  const AddActivityModal = () => (
    <Dialog open={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
      <Transition appear show={isAddActivityOpen} as={Fragment}>
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Add New Activity</h3>
            
            {/* Enhanced Search with Popular Suggestions */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full px-4 py-3 border rounded-lg"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
              
              {/* Popular/Trending Activities */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Popular Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {['Museums', 'Restaurants', 'Tours', 'Shopping'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-teal-50 hover:text-teal-600"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Results with Ratings and Reviews */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {suggestions.map((activity) => (
                <div key={activity.id} 
                     className="flex gap-4 p-4 border rounded-lg hover:border-teal-500 cursor-pointer">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                    <Image
                      src={activity.image || '/placeholder.jpg'}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400">★★★★☆</span>
                      <span className="text-sm text-gray-600">(128 reviews)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-teal-600">${activity.price}</div>
                    <button className="mt-2 px-4 py-1 bg-teal-600 text-white rounded-lg text-sm">
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Transition>
    </Dialog>
  );

  if (!tripData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Hero Section */}
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

      {/* Simplified Navigation - Only Itinerary */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8 -mb-px">
            <div className="py-4 px-1 border-b-2 border-teal-500 text-teal-600">
              Itinerary
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Date Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tripData.packages.packages[0]?.itinerary.map(({ date }) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-6 py-3 rounded-full flex-shrink-0 transition-colors ${
                selectedDate === date 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>

        {/* Updated Itinerary Items */}
        <Reorder.Group 
          axis="y" 
          values={tripData?.packages.packages[0]?.itinerary || []} 
          onReorder={handleReorder}
          className="space-y-6"
        >
          {tripData?.packages.packages[0]?.itinerary.map((day) => (
            <Reorder.Item key={day.date} value={day}>
              <motion.div 
                layout
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{formatDate(day.date)}</h3>
                  {editMode && (
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <FaEdit className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <FaTrash className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {day.dayPlan.map((activity, index) => (
                    <Reorder.Item key={index} value={activity}>
                      <motion.div layout className="flex gap-4">
                        <div className="w-20 text-gray-600">{activity.time}</div>
                        {renderActivityCard(activity, day.date, index)}
                      </motion.div>
                    </Reorder.Item>
                  ))}
                  
                  {/* Add Activity Button */}
                  <button
                    onClick={() => setIsAddActivityOpen(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg
                             text-gray-500 hover:border-teal-500 hover:text-teal-500
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Activity
                  </button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Save Changes Button */}
        {editMode && (
          <motion.button
            onClick={handleSaveChanges}
            className="mt-8 w-full bg-teal-600 text-white px-6 py-3 rounded-xl font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
        )}
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal />
    </div>
  );
};

export default ItineraryPage; 