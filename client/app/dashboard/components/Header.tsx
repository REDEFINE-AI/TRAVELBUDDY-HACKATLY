'use client';
import { BiSolidNavigation } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function Header() {
  const { user } = useAuthStore();
  const [locationName, setLocationName] = useState('Loading...');

  useEffect(() => {
    const fetchLocationName = async () => {
      if (user?.location?.latitude && user?.location?.longitude) {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${user.location.latitude}+${user.location.longitude}&key=YOUR_OPENCAGE_API_KEY`,
          );
          const data = await response.json();
          if (data.results?.[0]?.components?.city) {
            setLocationName(data.results[0].components.city);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocationName('Location unavailable');
        }
      }
    };

    fetchLocationName();
  }, [user]);

  return (
    <header className="w-full h-14 flex items-center justify-between">
      <div className="">
        <span className="text-xss text-gray-400 font-medium">Current location</span>
        <h3 className="text-sm flex items-center justify-start gap-1 text-teal-600 font-semibold">
          <BiSolidNavigation /> {locationName}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/pricing"
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors"
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.5 7.25L12 2L21.5 7.25L12 12.5L2.5 7.25Z" />
            <path d="M2.5 11.25L12 16.5L21.5 11.25" />
            <path d="M2.5 15.25L12 20.5L21.5 15.25" />
          </svg>
          Upgrade
        </a>
        <button
          type="button"
          className="relative inline-flex justify-center items-center size-[30px] text-sm font-semibold rounded-lg  bg-gray-50 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-0 end-0 inline-flex items-center w-4 h-4 justify-center rounded-full text-xss font-medium transform -translate-y-1/2 translate-x-1/2 bg-orange-500 text-white">
            5
          </span>
        </button>
      </div>
    </header>
  );
}
