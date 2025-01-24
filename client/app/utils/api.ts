import axios from 'axios';

// Hotel data from Booking.com API via RapidAPI
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
// Flight data from Amadeus API
const AMADEUS_API_KEY = process.env.NEXT_PUBLIC_AMADEUS_API_KEY;
// Activities from Viator API
const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY;
// Images from Unsplash
const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export async function searchHotels({ destination, checkIn, checkOut, guests }: HotelSearchParams) {
  try {
    const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
      params: {
        units: 'metric',
        order_by: 'popularity',
        checkin_date: checkIn,
        checkout_date: checkOut,
        adults_number: guests,
        filter_by_currency: 'USD',
        dest_type: 'city',
        locale: 'en-us',
        dest_id: destination,
        room_number: '1'
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
      location: hotel.address,
      description: hotel.hotel_name_trans,
      amenities: hotel.facilities,
      bookingUrl: hotel.url,
      roomType: 'Standard Room', // You can get room types from another API endpoint
      checkIn: hotel.checkin.from,
      checkOut: hotel.checkout.until
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
}

export async function searchFlights({ origin, destination, date, passengers }: FlightSearchParams) {
  try {
    // Using Amadeus API for flight search
    const response = await axios.get(`https://test.api.amadeus.com/v2/shopping/flight-offers`, {
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: passengers,
        max: 5
      },
      headers: {
        Authorization: `Bearer ${AMADEUS_API_KEY}`
      }
    });

    return response.data.data.map((flight: any) => ({
      id: flight.id,
      airline: flight.validatingAirlineCodes[0],
      price: flight.price.total,
      departure: flight.itineraries[0].segments[0].departure,
      arrival: flight.itineraries[0].segments[0].arrival,
      duration: flight.itineraries[0].duration,
      bookingUrl: `https://www.amadeus.com/flights/${flight.id}`
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
}

export async function searchActivities(destination: string) {
  try {
    const response = await axios.get(`https://api.viator.com/v1/destination/${destination}/activities`, {
      headers: {
        'exp-api-key': VIATOR_API_KEY
      }
    });

    return response.data.data.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      price: activity.price.amount,
      duration: activity.duration,
      image: activity.primaryImage,
      bookingUrl: activity.bookingLink,
      location: activity.location,
      category: activity.categories[0],
      rating: activity.rating
    }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}

export async function getDestinationImages(query: string, count: number = 5) {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query,
        per_page: count,
        orientation: 'landscape'
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`
      }
    });

    return response.data.results.map((image: any) => ({
      url: image.urls.regular,
      alt: image.alt_description,
      credit: image.user.name
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
} 