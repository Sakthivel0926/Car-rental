import React from 'react';
import { Calendar } from 'lucide-react';
import { useCars } from '../context/CarContext';

const HeaderNavbar = () => {
  const { selectedDate, setSelectedDate } = useCars();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate 30 days from today for max date
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const maxDate = thirtyDaysLater.toISOString().split('T')[0];
  
  return (
    <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 shadow-sm flex items-center justify-between">
      <img src="https://i.postimg.cc/5tp2hf4L/Screenshot-2025-06-14-115433.png" alt="External Logo" width="90" />
      
      <h1 className="text-xl font-bold text-black-100">RentYourCar</h1>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Calendar size={18} />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
          max={maxDate}
          className="calendar-glow pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <span className="text-xs text-gray-500 absolute -bottom-5 right-0">
          30-day range
        </span>
      </div>
    </div>
  );
};

export default HeaderNavbar;
