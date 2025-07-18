import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useCars } from '../context/CarContext';
import ImageCarousel from './ImageCarousel';

const CarCard = ({ car, onClick }) => {
  const { savedCars, toggleSaved, selectedDate, isCarBookedOnDate } = useCars();
  const isSaved = savedCars.includes(car.id);
  const isBookedOnSelectedDate = isCarBookedOnDate(car.id, selectedDate);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSaved(car.id);
  };

  return (
    <div 
      onClick={onClick}
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer ${isBookedOnSelectedDate ? 'opacity-70' : ''}`}
    >
      <div className="relative h-48">
        <ImageCarousel 
          images={car.images} 
          alt={car.name}
          className="h-full"
        />
        <button 
          onClick={handleSaveClick}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-colors z-20"
        >
          <Heart 
            size={20} 
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
          />
        </button>
        
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
          <div className="flex items-center text-sm">
            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
            <span>{car.rating}/5</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1">{car.type} • {car.location}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <p className="text-gray-700">
            <span className="font-bold text-blue-600">₹{car.pricePerDay}</span>/day
          </p>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {car.transmission}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
