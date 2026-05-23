const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const auth = require('../middleware/auth');
const {
  calculateTotal,
  dateOnlyToDate,
  isFutureDate,
  isTimeWithinBusinessHours,
  resolveSelectedServices
} = require('../config/services');

const router = express.Router();

const timeValidator = body('time')
  .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  .withMessage('Choose a valid time')
  .custom((time, { req }) => {
    if (!req.body.date || !isTimeWithinBusinessHours(req.body.date, time)) {
      throw new Error('Choose a time during opening hours');
    }
    return true;
  });

const serviceValidator = [
  body('serviceIds')
    .optional()
    .isArray({ min: 1, max: 6 })
    .withMessage('Choose between 1 and 6 services'),
  body('serviceIds.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid service selected'),
  body('services')
    .optional()
    .isArray({ min: 1, max: 6 })
    .withMessage('Choose between 1 and 6 services'),
  body('services.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Invalid service selected')
];

const bookingValidators = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Enter a valid full name'),
  body('phone')
    .trim()
    .matches(/^\+?[0-9\s()-]{7,24}$/)
    .withMessage('Enter a valid phone number'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Choose a valid date')
    .custom((date) => {
      if (!isFutureDate(date)) {
        throw new Error('Choose today or a future date');
      }
      return true;
    }),
  timeValidator,
  ...serviceValidator,
  body().custom((value) => {
    if (!Array.isArray(value.serviceIds) && !Array.isArray(value.services)) {
      throw new Error('Choose at least one service');
    }
    return true;
  })
];

const optionalBookingValidators = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('phone').optional().trim().matches(/^\+?[0-9\s()-]{7,24}$/),
  body('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
  body('time').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  ...serviceValidator
];

const validateObjectId = param('id').custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid booking ID');
  }
  return true;
});

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  res.status(400).json({ errors: errors.array() });
  return true;
};

const buildServicePayload = ({ serviceIds, services }) => {
  const selectedServices = resolveSelectedServices({ serviceIds, services });
  if (!selectedServices || selectedServices.length === 0) {
    return null;
  }

  return {
    serviceIds: selectedServices.map((service) => service.id),
    services: selectedServices.map((service) => service.name),
    total: calculateTotal(selectedServices)
  };
};

router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [total, confirmed, completed, cancelled, bookings] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.find()
    ]);

    const totalRevenue = bookings
      .filter((booking) => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.total, 0);

    res.json({
      total,
      confirmed,
      completed,
      cancelled,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, [
  query('includePast').optional().isBoolean().toBoolean()
], async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filter = req.query.includePast ? {} : { date: { $gte: today } };
    const bookings = await Booking.find(filter).sort({ date: 1, time: 1, createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, [validateObjectId], async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', bookingValidators, async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const servicePayload = buildServicePayload(req.body);
    if (!servicePayload) {
      return res.status(400).json({ message: 'Invalid service selection' });
    }

    const booking = new Booking({
      name: req.body.name,
      phone: req.body.phone,
      date: dateOnlyToDate(req.body.date),
      time: req.body.time,
      ...servicePayload
    });

    await booking.save();
    return res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', auth, [
  validateObjectId,
  body('status').isIn(['confirmed', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, [
  validateObjectId,
  ...optionalBookingValidators
], async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const updateData = {};
    ['name', 'phone', 'time'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.date !== undefined) {
      updateData.date = dateOnlyToDate(req.body.date);
    }

    if (req.body.serviceIds !== undefined || req.body.services !== undefined) {
      const servicePayload = buildServicePayload(req.body);
      if (!servicePayload) {
        return res.status(400).json({ message: 'Invalid service selection' });
      }
      Object.assign(updateData, servicePayload);
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, [validateObjectId], async (req, res) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
