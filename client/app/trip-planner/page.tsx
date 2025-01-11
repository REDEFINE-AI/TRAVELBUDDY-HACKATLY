"use client";

import { useState, useEffect } from "react";
import { useTripStore } from "../store/useTripStore";
import DestinationSelector from "./components/DestinationSelector";
import DatePickerField from "./components/DatePickerField";
import TravelersCounter from "./components/TravelersCounter";
import { SingleValue } from "react-select";

interface DestinationOption {
  label: string;
  value: string;
}

const Page1 = () => {
  const { tripData, updateTripData } = useTripStore();
  
  const [destination, setDestination] = useState<SingleValue<DestinationOption>>({
    label: tripData.destination || "",
    value: tripData.destination || "",
  });
  
  const [startDate, setStartDate] = useState<Date | null>(tripData.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(tripData.endDate || null);
  const [travelers, setTravelers] = useState<number>(tripData.travelers || 1);

  useEffect(() => {
    if (tripData.destination) setDestination({ label: tripData.destination, value: tripData.destination });
    if (tripData.startDate) setStartDate(tripData.startDate);
    if (tripData.endDate) setEndDate(tripData.endDate);
    if (tripData.travelers) setTravelers(tripData.travelers);
  }, [tripData]);

  const handleNext = () => {
    updateTripData("destination", destination?.value || "");
    updateTripData("startDate", startDate);
    updateTripData("endDate", endDate);
    updateTripData("travelers", travelers);
  };

  const handleDestinationChange = (selectedOption: SingleValue<DestinationOption>) => {
    if (selectedOption) {
      setDestination(selectedOption);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center p-4">
      <h1 className="text-teal-600 text-xl font-bold mb-4">Plan Your Trip</h1>
      
      <DestinationSelector 
        value={destination} 
        onChange={handleDestinationChange} 
      />
      
      <DatePickerField
        label="Start Date"
        selected={startDate}
        onChange={setStartDate}
        minDate={new Date()}
      />
      
      <DatePickerField
        label="End Date"
        selected={endDate}
        onChange={setEndDate}
        minDate={startDate || new Date()}
      />
      
      <TravelersCounter
        value={travelers}
        onIncrement={() => setTravelers(travelers + 1)}
        onDecrement={() => setTravelers(Math.max(travelers - 1, 1))}
      />
      
      <button
        onClick={handleNext}
        className="bg-teal-600 text-white px-6 py-2 rounded shadow mt-4"
      >
        Next: Customize Your Trip
      </button>
    </div>
  );
};

export default Page1;
