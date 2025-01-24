import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { getDestinationImages, searchHotels, searchFlights, searchActivities } from '@/app/utils/api';
import { defaultImages } from '@/app/constants/defaultImages';

// Add your API keys in .env.local
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
});

// Example hotel and activity APIs (replace with your actual API keys)
const BOOKING_API_KEY = process.env.BOOKING_COM_API_KEY;
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
  bookingUrl: string;
  amenities: string[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  bookingUrl: string;
  location: string;
  category: string;
}

interface Transport {
  type: 'flight' | 'train' | 'bus' | 'car';
  provider: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  bookingUrl: string;
}

async function fetchHotels(destination: string): Promise<Hotel[]> {
  try {
    // Example using Booking.com API (replace with actual implementation)
    const response = await axios.get(`https://booking-com.p.rapidapi.com/v1/hotels/search`, {
      params: {
        dest_id: destination,
        room_number: "1",
        order_by: "popularity"
      },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    });

    return response.data.result.map((hotel: any) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      rating: hotel.review_score,
      price: hotel.min_total_price,
      image: hotel.max_photo_url,
      bookingUrl: hotel.url,
      amenities: hotel.facilities
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

async function fetchActivities(destination: string): Promise<Activity[]> {
  try {
    // Example using Viator/TripAdvisor API (replace with actual implementation)
    const response = await axios.get(`https://api.viator.com/v1/destinations/${destination}/activities`, {
      headers: {
        'Accept': 'application/json',
        'exp-api-key': process.env.VIATOR_API_KEY
      }
    });

    return response.data.data.map((activity: any) => ({
      id: activity.id,
      name: activity.title,
      description: activity.description,
      price: activity.price.amount,
      duration: activity.duration,
      image: activity.primaryImage,
      bookingUrl: activity.bookingLink,
      location: activity.location,
      category: activity.category
    }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

async function fetchDestinationImage(destination: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: destination,
        orientation: 'landscape',
        per_page: 1
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`
      }
    });

    return response.data.results[0].urls.regular;
  } catch (error) {
    console.error('Error fetching image:', error);
    return '';
  }
}

async function generateAIPackages(destination: string, startDate: Date, endDate: Date, travelers: number) {
  try {
    const prompt = `Create 3 travel packages (Budget, Comfort, and Luxury) for ${travelers} travelers to ${destination} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. 
    For each package include:
    - Specific hotel recommendations with price range
    - Daily activities with times and booking prices
    - Transportation options
    Format as JSON with this structure: {
      "packages": [
        {
          "id": "1",
          "type": "Budget",
          "title": "Budget Explorer",
          "description": "Perfect for budget travelers",
          "price": 1000,
          "hotel": {
            "name": "Sample Hotel",
            "pricePerNight": 100,
            "rating": 4,
            "amenities": ["WiFi", "Pool"]
          },
          "itinerary": [
            {
              "date": "2024-03-20",
              "activities": [
                {
                  "time": "09:00 AM",
                  "description": "Specific activity description",
                  "price": 50,
                  "bookingUrl": "https://example.com"
                }
              ]
            }
          ]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('AI Generation Error:', error);
    return null;
  }
}

export async function POST(request: Request) {
  let requestData;
  try {
    requestData = await request.json();
    const { destination, startDate, endDate, travelers } = requestData;

    // Try to fetch real data, but use fallback if APIs fail
    try {
      const [hotels, flights, activities, images] = await Promise.all([
        searchHotels({
          destination,
          checkIn: startDate,
          checkOut: endDate,
          guests: travelers
        }),
        searchFlights({
          origin: requestData.origin,
          destination,
          date: startDate,
          passengers: travelers
        }),
        searchActivities(destination),
        getDestinationImages(destination)
      ]);

      // If we got real data, use it
      if (hotels?.length && flights?.length && activities?.length && images?.length) {
        // Create packages based on real data
        const packages = [
          {
            id: '1',
            type: 'budget',
            title: `${destination} Explorer`,
            description: 'Perfect for budget-conscious travelers',
            price: calculatePackagePrice(hotels[0], flights[0], activities.slice(0, 3), 'budget'),
            image: images[0].url,
            highlights: generateHighlights(hotels[0], activities.slice(0, 3)),
            hotel: hotels[0],
            transportation: flights[0],
            activities: activities.slice(0, 3),
            itinerary: generateItinerary(startDate, endDate, flights[0], hotels[0], activities.slice(0, 3))
          },
          // Add comfort and luxury packages similarly
        ];

        return NextResponse.json({ packages });
      }
    } catch (apiError) {
      console.error('API fetch failed, using fallback data:', apiError);
    }

    // Use fallback data if API calls failed
    return NextResponse.json({ 
      packages: generateFallbackPackages(destination, startDate, endDate)
    });

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({ 
      packages: generateFallbackPackages(requestData?.destination || 'Unknown', requestData?.startDate || '', requestData?.endDate || '')
    });
  }
}

// Helper functions for package generation
function calculatePackagePrice(hotel: any, flight: any, activities: any[], type: string) {
  const basePrice = hotel.price + flight.price + activities.reduce((sum, act) => sum + act.price, 0);
  const markup = type === 'budget' ? 1.1 : type === 'comfort' ? 1.2 : 1.3;
  return Math.round(basePrice * markup);
}

function generateHighlights(hotel: any, activities: any[]) {
  return [
    `${hotel.rating}-star rated accommodation`,
    ...activities.map(act => act.title).slice(0, 3),
    'All transfers included'
  ];
}

function generateItinerary(startDate: string, endDate: string, flight: any, hotel: any, activities: any[]) {
  // Generate day-by-day itinerary based on real activities
  // Implementation details...
}

function generateDefaultItinerary(startDate: string, endDate: string, destination: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    days.push({
      date: new Date(currentDate),
      transportation: {
        type: 'flight',
        provider: 'Local Airlines',
        departureTime: '10:00 AM',
        arrivalTime: '12:00 PM',
        price: 299,
        image: defaultImages.flight,
        bookingUrl: 'https://www.expedia.com'
      },
      activities: [
        {
          time: '09:00 AM',
          description: 'City Tour',
          price: 89,
          location: `${destination} City Center`,
          image: defaultImages.activity,
          bookingUrl: 'https://www.viator.com',
          duration: '3 hours',
          category: 'sightseeing'
        },
        {
          time: '02:00 PM',
          description: 'Cultural Experience',
          price: 65,
          location: `${destination} Cultural District`,
          image: defaultImages.culture,
          bookingUrl: 'https://www.getyourguide.com',
          duration: '2 hours',
          category: 'culture'
        },
        {
          time: '07:00 PM',
          description: 'Local Dining Experience',
          price: 45,
          location: `${destination} Restaurant District`,
          image: defaultImages.food,
          bookingUrl: 'https://www.opentable.com',
          duration: '2 hours',
          category: 'food'
        }
      ],
      meals: {
        breakfast: {
          time: '08:00 AM',
          description: 'Breakfast at Hotel',
          price: 0,
          location: 'Hotel Restaurant',
          image: defaultImages.food,
          bookingUrl: '',
          duration: '1 hour',
          category: 'food'
        },
        lunch: {
          time: '12:30 PM',
          description: 'Local Restaurant',
          price: 25,
          location: 'City Center',
          image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f',
          bookingUrl: 'https://www.opentable.com',
          duration: '1 hour',
          category: 'food'
        },
        dinner: {
          time: '07:00 PM',
          description: 'Dinner Experience',
          price: 45,
          location: 'Local Restaurant',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
          bookingUrl: 'https://www.opentable.com',
          duration: '2 hours',
          category: 'food'
        }
      }
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
}

function generateFallbackPackages(destination: string, startDate: string, endDate: string) {
  return [{
    id: '1',
    type: 'standard',
    title: `${destination} Experience`,
    description: 'A balanced travel package',
    price: 1499,
    image: defaultImages.destination,
    highlights: ['Comfortable stay', 'Guided tours', 'Local experiences'],
    hotel: {
      name: 'City Hotel',
      pricePerNight: 150,
      rating: 4,
      location: `${destination} City Center`,
      description: 'Comfortable hotel in a great location',
      image: defaultImages.hotel,
      bookingUrl: 'https://www.booking.com',
      amenities: ['WiFi', 'Pool', 'Restaurant'],
      roomType: 'Standard Room',
      checkIn: '15:00',
      checkOut: '11:00'
    },
    itinerary: generateDefaultItinerary(startDate, endDate, destination)
  }];
} 