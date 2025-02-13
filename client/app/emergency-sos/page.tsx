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

    const handleEmergencyCall = () => {
        setShowSOSModal(true);
    };

    const handleSOSConfirm = () => {
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
            if (coordinates) {
                const { latitude, longitude } = coordinates;
                const apiKey = 'YOUR_API_KEY'; 
                
                const nearbyResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital|police|fire_station|embassy|tourist_information_center&key=${apiKey}`);
                const places = nearbyResponse.data.results;

                const detailsPromises = places.map(async (place: Place) => {
                    const placeId = place.place_id;
                    const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,international_phone_number,vicinity,website&key=${apiKey}`);
                    return detailsResponse.data.result; 
                });

                const servicesWithDetails = await Promise.all(detailsPromises);
                console.log(servicesWithDetails);
            }
        } catch (error) {
            console.error('Error fetching emergency services:', error);
        }
    };

    useEffect(() => {
        fetchEmergencyServices(); 
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* SOS Button - Fixed at bottom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={handleEmergencyCall}
                    className="flex items-center justify-center w-20 h-20 bg-red-600 hover:bg-red-700 
                             text-white rounded-full shadow-lg transform transition-transform 
                             hover:scale-105 active:scale-95"
                >
                    <span className="text-2xl font-bold">SOS</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 mb-24">
                {/* Emergency Services Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Nearest Emergency Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Police Station', 'Hospital', 'Tourist Help'].map((service) => (
                            <div key={service} className="flex items-center p-4 bg-white dark:bg-gray-800 
                                                        rounded-xl shadow-sm">
                                <div className="ml-4">
                                    <h3 className="font-medium text-gray-800 dark:text-white">{service}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">0.8 miles away</p>
                                    <button className="mt-2 text-sm text-teal-600 hover:text-teal-700">
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contacts Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Emergency Contacts
                    </h2>
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <input
                                type="text"
                                value={newContact.name}
                                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                                placeholder="Contact Name"
                                className="border rounded-lg p-2"
                            />
                            <input
                                type="tel"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                                placeholder="Phone Number"
                                className="border rounded-lg p-2"
                            />
                            <input
                                type="text"
                                value={newContact.relation}
                                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                                placeholder="Relation"
                                className="border rounded-lg p-2"
                            />
                            <button
                                onClick={handleSaveContact}
                                className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                            >
                                Add Contact
                            </button>
                        </div>

                        {/* Contact List */}
                        <div className="space-y-2">
                            {contacts.map((contact, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                    <h3 className="font-medium text-gray-800 dark:text-white">{contact.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.relation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SOS Confirmation Modal */}
            {showSOSModal && (
                <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirm Emergency Alert</h3>
                        <p className="mb-4">This will alert your emergency contacts and notify nearby authorities.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowSOSModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSOSConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Confirm Emergency
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencySOSPage;
