const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: String,
    type: String,
    image: String,
    images: [String],
    fuelType: String,
    transmission: String,
    seatingCapacity: Number,
    mileage: String,
    rating: Number,
    pricePerDay: Number,
    location: String,
    bookedDates: [String]
});

module.exports = mongoose.model('Car', carSchema);