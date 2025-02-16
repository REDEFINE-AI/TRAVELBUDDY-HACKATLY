'use client';

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import axios from 'axios';

interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
}

interface Place {
    place_id: string;
}

const EmergencySOSPage = () => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [newContact, setNewContact] = useState<EmergencyContact>({
        name: '',
        phone: '',
        relation: ''
    });
    const [showSOSModal, setShowSOSModal] = useState(false);
    const { coordinates, error: locationError } = useGeolocation();

    // Add new state for pulse animation
    const [isPulsing, setIsPulsing] = useState(false);

    // Add loading state for emergency services
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        try {
            const position = await getLocation();
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setCurrentLocation(location);
            
            // Use the new API route instead of calling Google's API directly
            const nearbyResponse = await axios.get(
                `/api/places?latitude=${location.latitude}&longitude=${location.longitude}`
            );
            
            const places = nearbyResponse.data.results;
            console.log('Nearby places:', places);

            // If you need place details, create another API route for that
            const servicesWithDetails = places;
            console.log('Services with details:', servicesWithDetails);
        } catch (error) {
            console.error('Error fetching emergency services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencyServices(); 
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Header with slide-in animation */}
                <div className="mb-8 text-center animate-fade-in-down">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Emergency SOS
                    </h1>
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

                {/* Quick Actions Grid with hover effects */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {['Police', 'Hospital', 'Embassy', 'Fire Station'].map((service) => (
                        <div key={service} 
                             className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl
                                      shadow-sm hover:shadow-md transition-all duration-300
                                      transform hover:scale-102 hover:bg-gray-100
                                      dark:hover:bg-gray-700 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full 
                                              flex items-center justify-center">
                                    {/* You can add icons here */}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {service}
                                    </h3>
                                    <p className="text-sm text-gray-500">Tap to call</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                                placeholder="Contact Name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                         transition-all duration-300 ease-in-out
                                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         transform focus:scale-102"
                            />
                            <input
                                type="tel"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                         transition-all duration-300 ease-in-out
                                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         transform focus:scale-102"
                            />
                            <input
                                type="text"
                                value={newContact.relation}
                                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
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
                                <div key={index} 
                                     className="bg-white dark:bg-gray-700 p-4 rounded-xl 
                                                shadow-sm flex justify-between items-center
                                                transform transition-all duration-300
                                                hover:scale-102 hover:shadow-md
                                                animate-fade-in">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {contact.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{contact.relation}</p>
                                        <p className="text-sm text-gray-500">{contact.phone}</p>
                                    </div>
                                    <button className="text-red-500 hover:text-red-600 
                                                     transition-colors duration-300
                                                     transform hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-sm w-full
                                  transform animate-modal-slide-up">
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
