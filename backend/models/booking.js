const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 24
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
  serviceIds: [{
    type: Number
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

BookingSchema.index({ date: 1, time: 1, status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
