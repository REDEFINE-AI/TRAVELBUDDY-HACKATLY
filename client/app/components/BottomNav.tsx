"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { HiOutlineUsers } from 'react-icons/hi';
import { MdOutlineLuggage, MdOutlineSmartToy } from 'react-icons/md';

export default function BottomNav() {
  const pathname = usePathname();

  // Only show bottom nav on these specific routes
  const showBottomNav = [
    '/ar-exploration',
    '/translator',
    '/trip-planner',
    '/dashboard'
  ].includes(pathname);

  if (!showBottomNav) return null;

  const menuItems = [
    { name: 'Home', href: '/', icon: AiOutlineHome },
    { name: 'Trips', href: '/trips', icon: MdOutlineLuggage },
    { name: 'Community', href: '/community', icon: HiOutlineUsers },
    { name: 'Tools', href: '/explore', icon: MdOutlineSmartToy },
    { name: 'Profile', href: '/profile', icon: AiOutlineUser },
  ];

  return (
    <div className="fixed z-[-1] bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-100 rounded-t-xl shadow-lg">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-teal-50 first:rounded-tl-xl last:rounded-tr-xl transition-colors ${
                isActive 
                  ? 'text-teal-600' 
                  : 'text-teal-500 hover:text-teal-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 