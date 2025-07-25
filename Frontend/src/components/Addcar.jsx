import React, { useState, useCallback, useRef } from "react";
import { Car, MapPin, Star, Fuel, Settings, Users, Gauge, DollarSign, Camera, Upload } from "lucide-react";

const Addcar = ({ onCarAdded }) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    image: "",
    images: [],
    fuelType: "",
    transmission: "",
    seatingCapacity: "",
    mileage: "",
    rating: "",
    pricePerDay: "",
    location: "",
    bookedDates: []
  });

  // Use useRef to prevent re-renders
  const formRef = useRef(form);

  // Memoize the change handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const newForm = {
      ...formRef.current,
      [name]: value
    };
    formRef.current = newForm;
    setForm(newForm);
  }, []);

  const handleImagesChange = useCallback((e) => {
    const value = e.target.value;
    const newForm = {
      ...formRef.current,
      images: value.split(",").map((url) => url.trim())
    };
    formRef.current = newForm;
    setForm(newForm);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const carData = {
      ...form,
      seatingCapacity: Number(form.seatingCapacity),
      rating: Number(form.rating),
      pricePerDay: Number(form.pricePerDay),
      bookedDates: [] // Ensure new cars start with empty bookedDates
    };
    try {
      const res = await fetch("https://car-rental-7-5f1j.onrender.com/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData)
      });
      if (res.ok) {
        setForm({
          name: "",
          type: "",
          image: "",
          images: [],
          fuelType: "",
          transmission: "",
          seatingCapacity: "",
          mileage: "",
          rating: "",
          pricePerDay: "",
          location: "",
          bookedDates: []
        });
        if (onCarAdded) onCarAdded();
        alert("Car added successfully!");
      } else {
        alert("Failed to add car.");
      }
    } catch (err) {
      alert("Error adding car.");
    }
  };

  // Memoize the FormField component to prevent unnecessary re-renders
  const FormField = useCallback(({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    type = "text", 
    icon: Icon,
    ...props 
  }) => (
    <div className="relative group">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Icon className="w-4 h-4 text-indigo-500" />
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full px-4 py-3 pl-12 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-indigo-300"
        {...props}
      />
      <Icon className="absolute left-4 top-12 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-red-300 p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Car className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Add Your Car</h1>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 space-y-8">
          
          {/* Basic Information Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Car className="w-6 h-6 text-indigo-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Car Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="BMW X5, Mercedes C-Class..."
                icon={Car}
                required
              />
              <FormField
                label="Car Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="SUV, Sedan, Hatchback..."
                icon={Settings}
                required
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              Vehicle Images
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Main Image URL"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/main-image.jpg"
                icon={Upload}
                required
              />
              <div className="relative group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Camera className="w-4 h-4 text-green-500" />
                  Additional Images (comma separated)
                </label>
                <input
                  name="images"
                  value={form.images.join(",")}
                  onChange={handleImagesChange}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className="w-full px-4 py-3 pl-12 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-green-300"
                />
                <Camera className="absolute left-4 top-12 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-orange-600" />
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                label="Fuel Type"
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                placeholder="Petrol, Diesel, Electric..."
                icon={Fuel}
                required
              />
              <FormField
                label="Transmission"
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                placeholder="Manual, Automatic..."
                icon={Settings}
                required
              />
              <FormField
                label="Seating Capacity"
                name="seatingCapacity"
                value={form.seatingCapacity}
                onChange={handleChange}
                placeholder="4, 5, 7..."
                type="number"
                min="1"
                icon={Users}
                required
              />
              <FormField
                label="Mileage"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                placeholder="15 kmpl, 20 miles/gallon..."
                icon={Gauge}
                required
              />
              <FormField
                label="Rating"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                type="number"
                step="0.1"
                min="0"
                max="5"
                icon={Star}
                required
              />
              <FormField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Mumbai, Delhi, Bangalore..."
                icon={MapPin}
                required
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-yellow-600" />
              Pricing Information
            </h3>
            <div className="max-w-md">
              <FormField
                label="Price Per Day (₹)"
                name="pricePerDay"
                value={form.pricePerDay}
                onChange={handleChange}
                placeholder="2500"
                type="number"
                min="0"
                icon={DollarSign}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              className="group relative px-12 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            >
              <span className="flex items-center gap-1">
                <Car className="w-6 h-4" />
                Add Car
                <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addcar;