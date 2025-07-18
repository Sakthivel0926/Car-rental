const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Car = require('../models/car');
const Booking = require('../models/booking');

function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

router.post('/book', async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      userName,
      mobileNumber,
      note,
      drivingLicense,
      collateralType,
      collateral
    } = req.body;

    // Validate required fields
    if (
      !carId ||
      !startDate ||
      !endDate ||
      !userName ||
      !mobileNumber
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate carId format
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ error: 'Invalid carId' });
    }

    // Find the car
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    // Check for date overlap
    const requestedDates = getDatesInRange(startDate, endDate);
    const overlap = requestedDates.some(date => car.bookedDates.includes(date));
    if (overlap) {
      return res.status(400).json({ error: 'This car is already booked for the selected dates' });
    }

    // Add new booked dates to car
    car.bookedDates.push(...requestedDates);
    await car.save();

    // Create booking record
    const booking = new Booking({
      carId: car._id,
      userName,
      mobileNumber,
      note,
      drivingLicense,
      collateralType,
      collateral,
      startDate,
      endDate
    });
    await booking.save();

    res.json({ message: 'Booking successful', bookedDates: car.bookedDates, booking });
  } catch (err) {
    console.error(err); // <-- This will show the real error in your backend console
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;