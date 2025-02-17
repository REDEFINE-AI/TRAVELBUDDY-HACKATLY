'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MdOutlineArrowOutward } from 'react-icons/md';

const places = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8',
  },
  {
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
  },
];

const DiscoverPlaces = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm text-black font-medium">Best Places to Discover</h2>
        <Link
          href="/trip-planner"
          className="text-[.7rem] flex items-center justify-center gap-1 text-orange-500 font-medium hover:underline"
        >
          View All <MdOutlineArrowOutward />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {places.map(place => (
          <Link href="/trip-planner" key={place.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-24 rounded-xl overflow-hidden"
            >
              <img src={place.image} alt={place.name}  className="object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium">{place.name}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPlaces;
