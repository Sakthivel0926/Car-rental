import React, { useState } from 'react';
import { X, Star, Users, Fuel, Gauge, ArrowLeft, Calendar } from 'lucide-react';
import BookingForm from './BookingForm';
import ImageCarousel from './ImageCarousel';

const CarDetail = ({ car, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Defensive: fallback if car is not passed
  if (!car) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
          <span>Car not found.</span>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </div>
      </div>
    );
  }

  // Check if the selected date is booked
  const isBookedOnSelectedDate = car.bookedDates?.includes(
    selectedDate.toISOString().split('T')[0]
  );

  const handleBookingClick = () => {
    setShowBookingForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm z-10"
          >
            <X size={20} className="text-gray-700" />
          </button>
          
          <div className="relative h-64">
            <ImageCarousel 
              images={car.images || []} 
              alt={car.name || ""}
              className="h-full"
              aspectRatio="wide"
              showControls={true}
            />
            <button 
              onClick={onClose}
              className="absolute top-2 left-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm z-10"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            {isBookedOnSelectedDate && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <span className="px-3 py-1 bg-red-500 text-white font-medium rounded-md">
                  Booked on {selectedDate.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
              <div className="flex items-center">
                <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{car.rating}/5</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{car.type} • {car.location}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Fuel size={18} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users size={18} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Seating</p>
                  <p className="font-medium">{car.seatingCapacity} People</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge size={18} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">{car.mileage}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-blue-600 mr-2" />
                <p className="text-sm text-gray-500">Availability</p>
              </div>
              {car.bookedDates && car.bookedDates.length > 0 ? (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Booked dates:</span> {car.bookedDates.map(date => 
                      new Date(date).toLocaleDateString()
                    ).join(', ')}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Note: Cars are available for new bookings starting on checkout dates.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-green-600 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Available on all dates
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Rental Price</p>
                <p className="text-xl font-bold text-blue-600">₹{car.pricePerDay}<span className="text-sm font-normal text-gray-500">/day</span></p>
              </div>
              <button
                onClick={handleBookingClick}
                disabled={isBookedOnSelectedDate}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isBookedOnSelectedDate 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isBookedOnSelectedDate ? 'Unavailable' : 'Book Now'}
              </button>
            </div>
            
            {isBookedOnSelectedDate && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-red-600">
                  This car is already booked for {selectedDate.toLocaleDateString()}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showBookingForm && (
        <BookingForm car={car} onClose={() => setShowBookingForm(false)} />
      )}
    </>
  );
};

export default CarDetail;