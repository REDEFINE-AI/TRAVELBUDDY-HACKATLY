

import {create} from "zustand";

// Define the state schema for the trip planning process
interface TripData {
  destination: string; // Primary destination
  startDate: Date | null;
  endDate: Date | null;
  travelers: number;
  travelStyle: string;
  interests: string[];
  pace: string;
  budget: number;
  
  // New: Multiple destinations (Including intermediate points)
  destinations: {
    name: string; // Destination Name
    arrivalDate: Date | null;
    departureDate: Date | null;
    pointsOfInterest: string[]; // Points of interest in this destination
  }[];

  activities: { 
    name: string; 
    duration: string; 
    description?: string; // Optional description of activity
  }[]; // List of selected activities
  
  // Transport details, now as an array for multi-leg journeys
  transport: {
    leg: number; // Leg number for multi-leg journeys (e.g., 1, 2, 3, etc.)
    mode: string; // Flight, Train, Car, etc.
    departureDate: Date | null; // Departure date for this leg
    arrivalDate: Date | null; // Arrival date for this leg
    departureLocation: string; // Departure location for the leg
    arrivalLocation: string; // Arrival location for the leg
    details: string; // Additional info (e.g., flight number, train number)
    booked: boolean; // Whether tickets are booked for this leg
  }[];

  // Accommodation details, now an array for multiple stays
  accommodation: {
    type: string; // Hotel, Hostel, Airbnb, etc.
    name: string; // Name of the accommodation
    location: string; // Location of the accommodation
    numberOfBeds: number; // Number of beds in the accommodation
    budget: number; // Estimated cost for this accommodation
    booked: boolean; // Whether this accommodation is booked
    details: string; // Booking info or additional details
  }[];

  // Additional info
  budgetSummary: {
    totalBudget: number; // Total budget for the trip
    spent: number; // Total spent so far
    remaining: number; // Remaining budget
  };
}

interface TripStore {
  tripData: TripData;
  setTripData: (data: TripData) => void;
  updateTripData: (key: keyof TripData, value: any) => void;
  resetTripData: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  tripData: {
    destination: "",
    startDate: null,
    endDate: null,
    travelers: 1,
    travelStyle: "",
    interests: [],
    pace: "Moderate", // Default value
    budget: 0,
    
    // Destinations with multiple points
    destinations: [{
      name: "", // Initial destination placeholder
      arrivalDate: null,
      departureDate: null,
      pointsOfInterest: [], // Placeholder for points of interest
    }],
    
    activities: [],
    
    // Transport details with multiple legs
    transport: [{
      leg: 1,
      mode: "", 
      departureDate: null,
      arrivalDate: null,
      departureLocation: "",
      arrivalLocation: "",
      details: "",
      booked: false,
    }],
    
    // Accommodation with potential for multiple stays
    accommodation: [{
      type: "",
      name: "",
      location: "",
      numberOfBeds: 1,
      budget: 0,
      booked: false,
      details: "",
    }],
    
    budgetSummary: {
      totalBudget: 0,
      spent: 0,
      remaining: 0,
    },
  },
  setTripData: (data) => set({ tripData: data }),
  updateTripData: (key, value) => set((state) => ({
    tripData: {
      ...state.tripData,
      [key]: value
    }
  })),
  resetTripData: () => set({
    tripData: {
      destination: "",
      startDate: null,
      endDate: null,
      travelers: 1,
      travelStyle: "",
      interests: [],
      pace: "Moderate",
      budget: 0,
      destinations: [{
        name: "",
        arrivalDate: null,
        departureDate: null,
        pointsOfInterest: [],
      }],
      activities: [],
      transport: [{
        leg: 1,
        mode: "",
        departureDate: null,
        arrivalDate: null,
        departureLocation: "",
        arrivalLocation: "",
        details: "",
        booked: false,
      }],
      accommodation: [{
        type: "",
        name: "",
        location: "",
        numberOfBeds: 1,
        budget: 0,
        booked: false,
        details: "",
      }],
      budgetSummary: {
        totalBudget: 0,
        spent: 0,
        remaining: 0,
      },
    }
  }), // Resetting the state to the initial state
}));
