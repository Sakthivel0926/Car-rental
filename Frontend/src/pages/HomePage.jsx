import React, { useState } from 'react';
import { useCars } from '../context/CarContext';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import CarDetail from '../components/CarDetail';

const HomePage = () => {
  const { filteredCars } = useCars();
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="pb-20">
      <div className="sticky top-16 bg-white z-8 px-4 pt-2 pb-2 shadow-sm">
        <SearchBar />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Cars</h2>

        {filteredCars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No cars found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCars.map(car => (
              <CarCard 
                key={car._id || car.id} 
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

export default HomePage;