import React, { createContext, useState, useContext, useEffect } from 'react';


const CarContext = createContext(undefined);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [savedCars, setSavedCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/cars")
    .then(res => res.json())
    .then(data => setCars(data))
    .catch(() => setCars([]));
  }, []);

  const toggleSaved = (carId) => {
    setSavedCars((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };


  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate < lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const bookCar = (carId, fromDate, toDate) => {
    const datesToBook = getDatesInRange(fromDate, toDate);

    setCars((prev) =>
      prev.map((car) =>
        car.id === carId
          ? {
              ...car,
              bookedDates: [...new Set([...car.bookedDates, ...datesToBook])],
            }
          : car
      )
    );

    console.log(`Car ${carId} has been booked from ${fromDate} to ${toDate} (checkout)`);
  };

  const cancelBooking = (carId, date) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === carId
          ? {
              ...car,
              bookedDates: car.bookedDates.filter((d) => d !== date),
            }
          : car
      )
    );

    console.log(`Booking for car ${carId} on ${date} has been cancelled`);
  };

  const isCarBookedOnDate = (carId, date) => {
    const car = cars.find((c) => c.id === carId);
    return car ? car.bookedDates.includes(date) : false;
  };

  const isDateRangeAvailable = (carId, fromDate, toDate) => {
    const car = cars.find((c) => c.id === carId);
    if (!car) return false;

    const datesToCheck = getDatesInRange(fromDate, toDate);
    return !datesToCheck.some((date) => car.bookedDates.includes(date));
  };

  const getNextAvailableDate = (carId) => {
    const car = cars.find((c) => c.id === carId);
    if (!car || car.bookedDates.length === 0) return null;

    const sortedDates = [...car.bookedDates].sort();
    const today = new Date().toISOString().split('T')[0];
    const lastBookedDate = sortedDates.filter((date) => date >= today).pop();

    if (!lastBookedDate) return null;

    const nextDate = new Date(lastBookedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0];
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSavedCars = () => {
    return cars.filter((car) => savedCars.includes(car.id));
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        savedCars,
        searchTerm,
        selectedDate,
        setSearchTerm,
        setSelectedDate,
        toggleSaved,
        bookCar,
        cancelBooking,
        isCarBookedOnDate,
        isDateRangeAvailable,
        getNextAvailableDate,
        filteredCars,
        getSavedCars,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
