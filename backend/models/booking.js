const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // `email` was removed per request; only phone number is stored now.
  phone: {
    type: Number,
    required: true,
    // we'll enforce integer values in validation
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    required: true
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);