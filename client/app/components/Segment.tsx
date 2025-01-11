import React from "react";

interface SegmentProps {
  tabValues: string[];
}

const Segment: React.FC<SegmentProps> = ({ tabValues }) => {
  return (
    <div className="flex">
      <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 px-2 dark:bg-neutral-700 dark:hover:bg-neutral-600">
        <nav className="flex gap-x-2">
          {tabValues.map((item) => (
            <button
              className="py-3 px-4 inline-flex items-center gap-2 bg-white text-sm text-gray-700 font-medium rounded-lg shadow-sm focus:outline-none dark:bg-neutral-800 dark:text-neutral-400"
              aria-current="page"
              key={item}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Segment;
