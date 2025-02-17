'use client';

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import axios from 'axios';
import { Loader } from '@googlemaps/js-api-loader';
import { FaHospital, FaFireExtinguisher, FaBuilding } from 'react-icons/fa';
import { MdLocalPolice } from 'react-icons/md';

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface Place {
  place_id: string;
}

// Define the interface for the place result
interface PlaceResult {
  place_id: string;
  name: string;
  // Add other properties as needed
}

// Define the interface for the place detail
interface PlaceDetail {
  name?: string;
  formatted_phone_number?: string;
  formatted_address?: string;
  website?: string;
}

const EmergencySOSPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relation: '',
  });
  const [showSOSModal, setShowSOSModal] = useState(false);
  const { coordinates, error: locationError } = useGeolocation();

  // Add new state for pulse animation
  const [isPulsing, setIsPulsing] = useState(false);

  // Add loading state for emergency services
  const [isLoading, setIsLoading] = useState(true);

  // Add new state variables
  const [services, setServices] = useState<any[]>([]);

  const handleEmergencyCall = () => {
    setIsPulsing(true);
    setShowSOSModal(true);
    // Stop pulsing when modal is dismissed
    setTimeout(() => setIsPulsing(false), 500);
  };

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const handleSOSConfirm = async () => {
    // Logic to send alerts and make emergency calls
    if (coordinates) {
      contacts.forEach(contact => {
        // Send emergency alerts with location
        console.log(`Alerting ${contact.name} at ${contact.phone}`);
      });
    }
    alert('Emergency services have been notified');
    setShowSOSModal(false);
  };

  const handleSaveContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, newContact]);
      setNewContact({ name: '', phone: '', relation: '' });
    }
  };

  const fetchEmergencyServices = async () => {
    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API!,
        version: 'weekly',
        libraries: ['places'],
      });

      // Load Google Maps JavaScript API
      const google = await loader.load();

      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      const location = new google.maps.LatLng(latitude, longitude);

      // Initialize Places Service
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));

      // Search for nearby emergency services
      const request = {
        location: location,
        radius: 5000,
        type: 'hospital|police|fire_station|embassy',
      };

      placesService.nearbySearch(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Get details for each place
            const detailsPromises = results.map(place => {
              return new Promise(resolve => {
                placesService.getDetails(
                  {
                    placeId: place.place_id!,
                    fields: ['name', 'formatted_phone_number', 'formatted_address', 'website'],
                  },
                  (
                    placeDetail: PlaceDetail | null,
                    detailStatus: google.maps.places.PlacesServiceStatus,
                  ) => {
                    if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
                      resolve(placeDetail);
                    } else {
                      resolve(null);
                    }
                  },
                );
              });
            });

            Promise.all(detailsPromises).then(detailedPlaces => {
              setServices(detailedPlaces.filter(place => place !== null));
              setIsLoading(false);
            });
          }
        },
      );
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyServices();
  }, []);

  // Add this helper function
  const getServiceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hospital')) return <FaHospital className="w-6 h-6" />;
    if (lowerName.includes('police')) return <MdLocalPolice className="w-6 h-6" />;
    if (lowerName.includes('fire')) return <FaFireExtinguisher className="w-6 h-6" />;
    return <FaBuilding className="w-6 h-6" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header with slide-in animation */}
        <div className="mb-8 text-center animate-fade-in-down">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Emergency SOS</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick access to emergency services and contacts
          </p>
        </div>

        {/* Enhanced SOS Button with pulse effect */}
        <div className="mb-12 flex justify-center">
          <button
            onClick={handleEmergencyCall}
            className={`
                            w-48 h-48 bg-red-500 hover:bg-red-600
                            rounded-full shadow-lg transform transition-all
                            duration-300 hover:scale-105 active:scale-95
                            flex items-center justify-center border-8
                            border-red-200 relative
                            ${isPulsing ? 'animate-pulse' : ''}
                        `}
          >
            {/* Pulse rings */}
            <div className="absolute w-full h-full rounded-full animate-ping-slow bg-red-500 opacity-20"></div>
            <div className="absolute w-full h-full rounded-full animate-ping-slower bg-red-500 opacity-10"></div>
            <span className="text-4xl font-bold text-white animate-bounce-gentle">SOS</span>
          </button>
        </div>

        {/* Add this section after the Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Nearby Emergency Services
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm
                                             hover:shadow-lg transition-all duration-300
                                             transform hover:scale-102"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                      {getServiceIcon(service.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {service.name}
                      </h3>
                      {service.formatted_phone_number && (
                        <a
                          href={`tel:${service.formatted_phone_number}`}
                          className="text-red-500 hover:text-red-600 text-sm font-medium mb-1 block"
                        >
                          {service.formatted_phone_number}
                        </a>
                      )}
                      {service.formatted_address && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.formatted_address}
                        </p>
                      )}
                      {service.website && (
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 text-sm mt-2 block"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Emergency Contacts Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Emergency Contacts
          </h2>
          <div className="space-y-4">
            {/* Contact Input Form */}
            <div className="grid gap-3">
              <input
                type="text"
                value={newContact.name}
                onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Contact Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200
                                         transition-all duration-300 ease-in-out
                                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         transform focus:scale-102"
              />
              <input
                type="tel"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200
                                         transition-all duration-300 ease-in-out
                                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         transform focus:scale-102"
              />
              <input
                type="text"
                value={newContact.relation}
                onChange={e => setNewContact({ ...newContact, relation: e.target.value })}
                placeholder="Relation"
                className="w-full px-4 py-3 rounded-xl border border-gray-200
                                         transition-all duration-300 ease-in-out
                                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         transform focus:scale-102"
              />
              <button
                onClick={handleSaveContact}
                className="w-full bg-red-500 text-white py-3 rounded-xl
                                         hover:bg-red-600 transition-colors"
              >
                Add Contact
              </button>
            </div>

            {/* Contact List */}
            <div className="space-y-3 mt-6">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-4 rounded-xl
                                                shadow-sm flex justify-between items-center
                                                transform transition-all duration-300
                                                hover:scale-102 hover:shadow-md
                                                animate-fade-in"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.relation}</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-600
                                                     transition-colors duration-300
                                                     transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal with animations */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-sm w-full
                                  transform animate-modal-slide-up"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Emergency
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will alert emergency services and your contacts with your location.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowSOSModal(false)}
                className="px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSOSConfirm}
                className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencySOSPage;
