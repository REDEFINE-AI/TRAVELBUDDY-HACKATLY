interface TravelersCounterProps {
    value: number; 
    onIncrement: () => void; 
    onDecrement: () => void; 
  }
  
  export default function TravelersCounter({
    value,
    onIncrement,
    onDecrement,
  }: TravelersCounterProps) {
    return (
      <div className="w-full mb-6">
        <label className="block text-teal-700 font-semibold mb-2">Travelers</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={onDecrement}
            className="px-3 py-1 bg-teal-500 text-white rounded"
          >
            -
          </button>
          <span className="text-teal-700">{value}</span>
          <button
            onClick={onIncrement}
            className="px-3 py-1 bg-teal-500 text-white rounded"
          >
            +
          </button>
        </div>
      </div>
    );
  }
  