import React from 'react';
import { Search } from 'lucide-react';
import { useCars } from '../context/CarContext';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useCars();

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by car name, type or location..."
        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
      />
    </div>
  );
};

export default SearchBar;
