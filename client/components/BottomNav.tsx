 "use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiUsers,
  HiPlusCircle,
  HiExclamationTriangle,
  HiUserCircle,
} from 'react-icons/hi2';

export default function BottomNav() {
  const pathname = usePathname();

  // Don't render on landing page
  if (pathname === '/landing') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-teal-50 rounded-t-2xl shadow-2xl">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {/* Home */}
        <Link href="/dashboard" className="inline-flex flex-col items-center justify-center group">
          <HiHome className="w-7 h-7 text-gray-400 group-hover:text-teal-600 transition-colors duration-200" />
          <span className="text-xs text-gray-500 group-hover:text-teal-600 transition-colors duration-200">
            Home
          </span>
        </Link>

        {/* Forum */}
        <Link href="/forum" className="inline-flex flex-col items-center justify-center group">
          <HiUsers className="w-7 h-7 text-gray-400 group-hover:text-teal-600 transition-colors duration-200" />
          <span className="text-xs text-gray-500 group-hover:text-teal-600 transition-colors duration-200">
            Forum
          </span>
        </Link>

        {/* AI Trip (Center) */}
        <Link
          href="/trip-planner"
          className="relative inline-flex flex-col items-center justify-center group"
        >
          <div className="absolute -top-6">
            <HiPlusCircle className="w-16 h-16 text-teal-600 bg-white rounded-full p-1 shadow-lg hover:text-teal-700 transition-colors duration-200" />
          </div>
          <span className="mt-9 text-xs text-gray-500 group-hover:text-teal-600 transition-colors duration-200">
            AI Trip
          </span>
        </Link>

        {/* Emergency SOS */}
        <Link
          href="/emergency-sos"
          className="inline-flex flex-col items-center justify-center group"
        >
          <HiExclamationTriangle className="w-7 h-7 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
          <span className="text-xs text-gray-500 group-hover:text-red-600 transition-colors duration-200">
            SOS
          </span>
        </Link>

        {/* Profile */}
        <Link href="/profile" className="inline-flex flex-col items-center justify-center group">
          <HiUserCircle className="w-7 h-7 text-gray-400 group-hover:text-teal-600 transition-colors duration-200" />
          <span className="text-xs text-gray-500 group-hover:text-teal-600 transition-colors duration-200">
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
