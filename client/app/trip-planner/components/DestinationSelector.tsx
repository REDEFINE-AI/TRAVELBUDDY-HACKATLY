import React, { useState, useEffect } from "react";
import Select from "react-select";
import { debounce } from "lodash";

interface Place {
  label: string;
  value: string;
  image: string;
}

interface DestinationSelectorProps {
  value: Place | null;
  onChange: (selectedOption: Place | null) => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Popular destinations - will be populated with images on component mount
  const [popularDestinations, setPopularDestinations] = useState<Place[]>([
    { label: "Paris, France", value: "paris", image: "" },
    { label: "Tokyo, Japan", value: "tokyo", image: "" },
    { label: "New York, USA", value: "new-york", image: "" },
    { label: "London, UK", value: "london", image: "" }
  ]);

  // Format location name to show only city and country
  const formatLocationName = (displayName: string): string => {
    const parts = displayName.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[parts.length - 1]}`;
    }
    return parts[0];
  };

  // Fetch images for popular destinations on component mount
  useEffect(() => {
    const fetchPopularImages = async () => {
      const updatedDestinations = await Promise.all(
        popularDestinations.map(async (dest) => {
          try {
            const response = await fetch(
              `https://api.unsplash.com/search/photos?query=${dest.label}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=1`
            );
            const data = await response.json();
            return {
              ...dest,
              image: data.results[0]?.urls?.small || "/api/placeholder/400/300"
            };
          } catch (error) {
            console.error(`Error fetching image for ${dest.label}:`, error);
            return { ...dest, image: "/api/placeholder/400/300" };
          }
        })
      );
      setPopularDestinations(updatedDestinations);
    };

    fetchPopularImages();
  }, []);

  const fetchPlacesWithImages = async (query: string) => {
    setIsLoading(true);
    try {
      // Fetch locations from LocationIQ
      const locationResponse = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&q=${query}&limit=4&dedupe=1&format=json`
      );
      const locations = await locationResponse.json();

      // For each location, fetch an image from Unsplash
      const placesWithImages = await Promise.all(
        locations.map(async (location: any) => {
          try {
            const formattedName = formatLocationName(location.display_name);
            const searchQuery = formattedName.split(',')[0]; // Use only city name for image search
            const imageResponse = await fetch(
              `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=1`
            );
            const imageData = await imageResponse.json();
            
            return {
              label: formattedName,
              value: location.place_id,
              image: imageData.results[0]?.urls?.small || "/api/placeholder/400/300"
            };
          } catch (error) {
            console.error('Error fetching image:', error);
            return {
              label: formatLocationName(location.display_name),
              value: location.place_id,
              image: "/api/placeholder/400/300"
            };
          }
        })
      );

      setSuggestions(placesWithImages);
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  const debouncedSearch = debounce(fetchPlacesWithImages, 300);

  const handleInputChange = (inputValue: string) => {
    if (inputValue.length >= 2) {
      debouncedSearch(inputValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions.length === 0) {
      setSuggestions(popularDestinations);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const customOption = ({ data, innerProps }: any) => (
    <div
      {...innerProps}
      className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
    >
      <img
        src={data.image}
        alt={data.label}
        className="w-16 h-12 object-cover rounded-md mr-3"
      />
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{data.label}</span>
      </div>
    </div>
  );

  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '50px',
      borderRadius: '0.5rem',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#cbd5e1'
      }
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      overflow: 'hidden'
    }),
    option: (base: any) => ({
      ...base,
      padding: 0
    })
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Where would you like to go?
      </label>
      <Select
        value={value}
        onChange={onChange}
        options={suggestions.length > 0 ? suggestions : (isFocused ? popularDestinations : [])}
        onInputChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isLoading={isLoading}
        components={{ Option: customOption }}
        styles={customStyles}
        placeholder="Search destinations..."
        isClearable
        className="w-full"
        classNamePrefix="select"
      />
    </div>
  );
};

export default DestinationSelector;