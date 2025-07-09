const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  endDate: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  note: String,
  drivingLicense: String, // Store file path or URL if you handle uploads
  collateralType: String,
  collateral: {
    amount: Number,
    gadgets: String,
    vehicles: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);