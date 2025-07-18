import React, { useState } from 'react';
import { useCars } from '../context/CarContext';
import CarCard from '../components/CarCard';
import CarDetail from '../components/CarDetail';

const SavedCarsPage = () => {
  const { getSavedCars } = useCars();
  const savedCars = getSavedCars();
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="pb-20">
     
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Cars</h2>
        
        {savedCars.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved cars</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start saving cars you're interested in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedCars.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                onClick={() => setSelectedCar(car)} 
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedCar && (
        <CarDetail 
          car={selectedCar} 
          onClose={() => setSelectedCar(null)} 
        />
      )}
    </div>
  );
};

export default SavedCarsPage;
