import { useState, useEffect } from 'react';

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const useGeolocation = () => {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            setError(error.message);
        };

        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return { coordinates, error };
}; 