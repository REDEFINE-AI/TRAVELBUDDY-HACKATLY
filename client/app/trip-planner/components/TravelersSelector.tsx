'use client';

import React from 'react';
import { FaUser, FaUsers, FaUserFriends } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';
import { MdFamilyRestroom } from 'react-icons/md';

interface TravelersSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const TravelersSelector: React.FC<TravelersSelectorProps> = ({ value, onChange }) => {
  const mainOptions = [
    { label: 'Solo', value: 1, icon: FaUser },
    { label: 'Duo', value: 2, icon: FaUserFriends },
    { label: 'Group', value: 4, icon: HiUserGroup },
    { label: 'Family', value: 3, icon: MdFamilyRestroom },
  ];

  const customOption = { label: 'Custom', value: 'custom', icon: FaUsers };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {mainOptions.map(option => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.label}
              onClick={() => onChange(option.value as number)}
              className={`flex items-center p-2.5 rounded-lg border transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-teal-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
              <span className="ml-2 text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom option in full width */}
      <div className="w-full">
        <button
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
            value > 4
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-gray-200 hover:border-teal-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <customOption.icon
              className={`w-4 h-4 ${value > 4 ? 'text-teal-600' : 'text-gray-400'}`}
            />
            <span className="ml-2 text-sm font-medium">{customOption.label}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={e => {
                e.stopPropagation();
                onChange(Math.max(1, value - 1));
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-700">{value}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                onChange(value + 1);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TravelersSelector;
