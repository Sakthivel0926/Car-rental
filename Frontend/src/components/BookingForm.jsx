import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCars } from '../context/CarContext';

// Helper to get the next available date
function getNextAvailableDate(bookedDates = []) {
  const today = new Date();
  let date = new Date(today);
  while (bookedDates.includes(date.toISOString().split('T')[0])) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

// Helper to check if selected range overlaps with booked dates
function isRangeOverlappingBookedDates(start, end, bookedDates) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const bookedSet = new Set(bookedDates);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (bookedSet.has(d.toISOString().split('T')[0])) {
      return true;
    }
  }
  return false;
}

// API call to book a car
const bookCar = async ({
  carId,
  startDate,
  endDate,
  userName,
  mobileNumber,
  note,
  drivingLicense,
  collateralType,
  collateral
}) => {
  const res = await fetch('https://car-rental-2-w085.onrender.com/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carId,
      startDate,
      endDate,
      userName,
      mobileNumber,
      note,
      drivingLicense,
      collateralType,
      collateral
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking failed');
  return data;
};

const BookingForm = ({ car, onClose }) => {
  const { selectedDate } = useCars() || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  const currentDate = new Date().toISOString().split('T')[0];
  const initialStartDate = getNextAvailableDate(car.bookedDates || []);
  const initialEndDate = new Date(initialStartDate);
  initialEndDate.setDate(initialEndDate.getDate() + 1);

  const [formData, setFormData] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    userName: '',
    mobileNumber: '',
    note: '',
    drivingLicense: '',
    collateralType: 'amount',
    collateral: {
      amount: 0,
      gadgets: '',
      vehicles: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Update form dates if selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    let newStartDate = new Date(selectedDate);
    if (car.bookedDates && car.bookedDates.includes(newStartDate.toISOString().split('T')[0])) {
      newStartDate = getNextAvailableDate(car.bookedDates);
    }
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 1);

    setFormData(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate
    }));
    // eslint-disable-next-line
  }, [selectedDate, car.bookedDates]);

  const formatDate = date => date.toISOString().split('T')[0];

  // --- Real-time date overlap check added here ---
  const handleDateChange = (field, value) => {
    const date = new Date(value);

    setFormData(prev => {
      const newData = { ...prev, [field]: date };
      if (field === 'startDate' && date >= prev.endDate) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        newData.endDate = newEndDate;
      }
      return newData;
    });

    // Real-time date overlap check
    let start = field === 'startDate' ? date : formData.startDate;
    let end = field === 'endDate' ? date : formData.endDate;
    const startStr = formatDate(start);
    const endStr = formatDate(end);

    if (
      car.bookedDates &&
      isRangeOverlappingBookedDates(startStr, endStr, car.bookedDates)
    ) {
      setErrors(prev => ({
        ...prev,
        dateRange: 'Selected dates overlap with an existing booking',
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateRange;
        return newErrors;
      });
    }

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCollateralTypeChange = type => {
    setFormData(prev => ({ ...prev, collateralType: type }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['collateral.amount'];
      delete newErrors['collateral.gadgets'];
      delete newErrors['collateral.vehicles'];
      return newErrors;
    });
  };

  // For demo, just store file name as string (no upload)
  const handleFileChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, drivingLicense: e.target.files[0].name }));
      if (errors.drivingLicense) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.drivingLicense;
          return newErrors;
        });
      }
    }
  };

  const validateStep = step => {
    const newErrors = {};

    if (step === 1) {
      const startDateStr = formatDate(formData.startDate);
      const endDateStr = formatDate(formData.endDate);

      if (car.bookedDates && isRangeOverlappingBookedDates(startDateStr, endDateStr, car.bookedDates)) {
        newErrors.dateRange = 'Selected dates overlap with an existing booking';
      }
      if (formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    } else if (step === 2) {
      if (!formData.userName.trim()) newErrors.userName = 'Name is required';
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      }
      if (!formData.drivingLicense) newErrors.drivingLicense = 'Driving license is required';
    } else if (step === 3) {
      if (formData.collateralType === 'amount') {
        if (!formData.collateral.amount || formData.collateral.amount <= 0) {
          newErrors['collateral.amount'] = 'Valid amount is required';
        } else if (formData.collateral.amount < 1000) {
          newErrors['collateral.amount'] = 'Minimum collateral amount is ₹1000';
        }
      } else if (formData.collateralType === 'gadgets' && !formData.collateral.gadgets.trim()) {
        newErrors['collateral.gadgets'] = 'At least one gadget is required';
      } else if (formData.collateralType === 'vehicles' && !formData.collateral.vehicles.trim()) {
        newErrors['collateral.vehicles'] = 'At least one vehicle is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const fromDate = formatDate(formData.startDate);
      const toDate = formatDate(formData.endDate);
      try {
        await bookCar({
          carId: car._id || car.id,
          startDate: fromDate,
          endDate: toDate,
          userName: formData.userName,
          mobileNumber: formData.mobileNumber,
          note: formData.note,
          drivingLicense: formData.drivingLicense,
          collateralType: formData.collateralType,
          collateral: formData.collateral
        });
        setBookingSuccess(true);
      } catch (err) {
        setErrors(prev => ({ ...prev, submit: err.message }));
      }
    }
  };

  const calculateTotalPrice = () => {
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.pricePerDay;
  };

  // --- UI rendering ---
  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <button onClick={onClose} className="absolute top-2 right-2">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 text-green-700">Booking Successful!</h2>
          <p className="mb-4">Your booking for <b>{car.name}</b> is confirmed.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Book {car.name}</h2>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              {/* Show booked dates from backend */}
              {car.bookedDates && car.bookedDates.length > 0 && (
                <div className="mb-2 text-xs text-gray-500">
                  <b>Booked Dates:</b> {car.bookedDates.join(', ')}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formatDate(formData.startDate)}
                  min={currentDate}
                  onChange={e => handleDateChange('startDate', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.startDate && <p className="text-red-600 text-xs">{errors.startDate}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formatDate(formData.endDate)}
                  min={formatDate(formData.startDate)}
                  onChange={e => handleDateChange('endDate', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.endDate && <p className="text-red-600 text-xs">{errors.endDate}</p>}
              </div>
              {errors.dateRange && <p className="text-red-600 text-xs mb-2">{errors.dateRange}</p>}
              <div className="mb-4">
                <p className="text-sm">Total Price: <b>₹{calculateTotalPrice()}</b></p>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.userName && <p className="text-red-600 text-xs">{errors.userName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {errors.mobileNumber && <p className="text-red-600 text-xs">{errors.mobileNumber}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Driving License</label>
                <input
                  type="file"
                  name="drivingLicense"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
                {errors.drivingLicense && <p className="text-red-600 text-xs">{errors.drivingLicense}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Note</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Collateral Type</label>
                <select
                  value={formData.collateralType}
                  onChange={e => handleCollateralTypeChange(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="amount">Amount</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="vehicles">Vehicles</option>
                </select>
              </div>
              {formData.collateralType === 'amount' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="collateral.amount"
                    value={formData.collateral.amount}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded"
                    min={1000}
                    required
                  />
                  {errors['collateral.amount'] && <p className="text-red-600 text-xs">{errors['collateral.amount']}</p>}
                </div>
              )}
              {formData.collateralType === 'gadgets' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Gadgets</label>
                  <input
                    type="text"
                    name="collateral.gadgets"
                    value={formData.collateral.gadgets}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  {errors['collateral.gadgets'] && <p className="text-red-600 text-xs">{errors['collateral.gadgets']}</p>}
                </div>
              )}
              {formData.collateralType === 'vehicles' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Vehicles</label>
                  <input
                    type="text"
                    name="collateral.vehicles"
                    value={formData.collateral.vehicles}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  {errors['collateral.vehicles'] && <p className="text-red-600 text-xs">{errors['collateral.vehicles']}</p>}
                </div>
              )}
            </>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-4 py-2 rounded ml-auto"
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded ml-auto"
              >
                Confirm Booking
              </button>
            )}
          </div>
          {errors.submit && <p className="text-red-600 text-xs mt-2">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;