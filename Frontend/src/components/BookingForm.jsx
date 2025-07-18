import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Shield, DollarSign, Car, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

// Mock context for demo
const mockCar = {
  _id: 'car123',
  name: 'BMW X5 Premium',
  pricePerDay: 2500,
  bookedDates: ['2025-07-20', '2025-07-21', '2025-07-25']
};

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

// Mock API call
const bookCar = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
};

const BookingForm = ({ car = mockCar, onClose = () => {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      amount: 5000,
      gadgets: '',
      vehicles: ''
    }
  });

  const [errors, setErrors] = useState({});

  const formatDate = date => date.toISOString().split('T')[0];

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
      if (formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
      if (car.bookedDates && isRangeOverlappingBookedDates(formData.startDate, formData.endDate, car.bookedDates)) {
        newErrors.startDate = 'This car is already booked for the selected dates';
        newErrors.endDate = 'This car is already booked for the selected dates';
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

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        await bookCar({
          carId: car._id || car.id,
          startDate: formatDate(formData.startDate),
          endDate: formatDate(formData.endDate),
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateTotalPrice = () => {
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.pricePerDay;
  };

  const stepIcons = [Calendar, User, Shield];
  const stepTitles = ['Select Dates', 'Personal Info', 'Collateral'];

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your booking for <span className="font-semibold text-blue-600">{car.name}</span> has been successfully confirmed.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Booking Details:</strong><br />
                {formatDate(formData.startDate)} to {formatDate(formData.endDate)}<br />
                Total: ₹{calculateTotalPrice().toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          <Car className="text-blue-600 mr-3" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Book {car.name}</h2>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {stepIcons.map((Icon, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    Step {stepNumber}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                    {stepTitles[index]}
                  </p>
                </div>
                {index < stepIcons.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${currentStep > stepNumber ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {car.bookedDates && car.bookedDates.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Unavailable Dates</h4>
                  <p className="text-sm text-orange-700">
                    {car.bookedDates.join(', ')}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formatDate(formData.startDate)}
                    min={currentDate}
                    onChange={e => handleDateChange('startDate', e.target.value)}
                    className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    required
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDate(formData.endDate)}
                    min={formatDate(formData.startDate)}
                    onChange={e => handleDateChange('endDate', e.target.value)}
                    className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    required
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-blue-600">₹{calculateTotalPrice().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.userName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  required
                />
                {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Driving License</label>
                <input
                  type="file"
                  name="drivingLicense"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.drivingLicense ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  required
                />
                {errors.drivingLicense && <p className="text-red-500 text-sm mt-1">{errors.drivingLicense}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Collateral */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Collateral Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'amount', label: 'Amount', icon: DollarSign, color: 'green' },
                    { value: 'gadgets', label: 'Gadgets', icon: Shield, color: 'blue' },
                    { value: 'vehicles', label: 'Vehicles', icon: Car, color: 'purple' }
                  ].map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleCollateralTypeChange(value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.collateralType === value
                          ? `border-${color}-500 bg-${color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={24} className={`mx-auto mb-2 ${
                        formData.collateralType === value ? `text-${color}-600` : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        formData.collateralType === value ? `text-${color}-700` : 'text-gray-600'
                      }`}>
                        {label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.collateralType === 'amount' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    name="collateral.amount"
                    value={formData.collateral.amount}
                    onChange={handleInputChange}
                    className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors['collateral.amount'] ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-green-500'
                    }`}
                    min={1000}
                    step={100}
                    placeholder="Minimum ₹1000"
                    required
                  />
                  {errors['collateral.amount'] && <p className="text-red-500 text-sm mt-1">{errors['collateral.amount']}</p>}
                </div>
              )}
              
              {formData.collateralType === 'gadgets' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gadgets Details</label>
                  <textarea
                    name="collateral.gadgets"
                    value={formData.collateral.gadgets}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors['collateral.gadgets'] ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="List your gadgets (e.g., iPhone 14, MacBook Pro, etc.)"
                    required
                  />
                  {errors['collateral.gadgets'] && <p className="text-red-500 text-sm mt-1">{errors['collateral.gadgets']}</p>}
                </div>
              )}
              
              {formData.collateralType === 'vehicles' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Details</label>
                  <textarea
                    name="collateral.vehicles"
                    value={formData.collateral.vehicles}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full border-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors['collateral.vehicles'] ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="List your vehicles (e.g., Honda City 2020, Yamaha R15, etc.)"
                    required
                  />
                  {errors['collateral.vehicles'] && <p className="text-red-500 text-sm mt-1">{errors['collateral.vehicles']}</p>}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium ml-auto"
              >
                Next
                <ArrowRight size={20} className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ml-auto ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;