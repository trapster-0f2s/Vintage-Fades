const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Booking = require('../models/booking');
const auth = require('../middleware/auth');
const {
  calculateBookingPricing,
  dateOnlyToDate,
  isFutureDate,
  isTimeWithinBusinessHours,
  getMembershipPlan,
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

const subscriptionValidator = [
  body('subscriptionStatus')
    .optional()
    .isIn(['none', 'active', 'signup'])
    .withMessage('Choose a valid subscription option'),
  body('subscriptionReference')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('Subscription reference is too long'),
  body('subscriptionReference').custom((value, { req }) => {
    if (req.body.subscriptionStatus === 'active' && !String(value || '').trim()) {
      throw new Error('Enter the phone or name linked to your monthly subscription');
    }
    return true;
  }),
  body('subscriptionPlan')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('Membership type is too long'),
  body('subscriptionPlan').custom((value, { req }) => {
    if (['active', 'signup'].includes(req.body.subscriptionStatus) && !getMembershipPlan(value)) {
      throw new Error('Choose a valid membership type');
    }
    return true;
  })
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
  ...subscriptionValidator,
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
  ...serviceValidator,
  ...subscriptionValidator
];

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateBookingId = param('id').custom((value) => {
  if (!uuidPattern.test(value)) {
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

const getSubscriptionStatus = (value) => (
  ['active', 'signup'].includes(value) ? value : 'none'
);

const buildServicePayload = ({
  serviceIds,
  services,
  subscriptionStatus,
  subscriptionPlan,
  subscriptionReference
}) => {
  const selectedServices = resolveSelectedServices({ serviceIds, services });
  if (!selectedServices || selectedServices.length === 0) {
    return { error: 'Invalid service selection' };
  }

  const resolvedSubscriptionStatus = getSubscriptionStatus(subscriptionStatus);
  const selectedMembership = getMembershipPlan(subscriptionPlan);
  const resolvedSubscriptionPlan = resolvedSubscriptionStatus === 'none'
    ? ''
    : (selectedMembership || getMembershipPlan('founding')).name;
  const pricing = calculateBookingPricing(
    selectedServices,
    resolvedSubscriptionStatus,
    resolvedSubscriptionPlan
  );

  if (resolvedSubscriptionStatus !== 'none' && pricing.subscriptionDiscount === 0) {
    return {
      error: 'Monthly subscriptions can only be used with a haircut, fade, lineup, trim, or bald service.'
    };
  }

  return {
    payload: {
      serviceIds: selectedServices.map((service) => service.id),
      services: selectedServices.map((service) => service.name),
      subtotal: pricing.subtotal,
      subscriptionStatus: resolvedSubscriptionStatus,
      subscriptionReference: resolvedSubscriptionStatus === 'active'
        ? String(subscriptionReference || '').trim()
        : '',
      subscriptionPlan: resolvedSubscriptionStatus === 'none' ? '' : resolvedSubscriptionPlan,
      subscriptionCoveredService: pricing.coveredService?.name || '',
      subscriptionDiscount: pricing.subscriptionDiscount,
      subscriptionCharge: pricing.subscriptionCharge,
      total: pricing.total
    }
  };
};

router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [total, confirmed, completed, cancelled, monthlySubscriptions, bookings] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ subscriptionStatus: { $in: ['active', 'signup'] } }),
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
      monthlySubscriptions,
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

router.get('/:id', auth, [validateBookingId], async (req, res) => {
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
    if (servicePayload.error) {
      return res.status(400).json({ message: servicePayload.error });
    }

    const booking = new Booking({
      name: req.body.name,
      phone: req.body.phone,
      date: dateOnlyToDate(req.body.date),
      time: req.body.time,
      ...servicePayload.payload
    });

    await booking.save();
    return res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', auth, [
  validateBookingId,
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
  validateBookingId,
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

    const hasServiceUpdate = req.body.serviceIds !== undefined || req.body.services !== undefined;
    const hasSubscriptionUpdate = (
      req.body.subscriptionStatus !== undefined ||
      req.body.subscriptionPlan !== undefined ||
      req.body.subscriptionReference !== undefined
    );

    if (hasServiceUpdate || hasSubscriptionUpdate) {
      const existingBooking = await Booking.findById(req.params.id);
      if (!existingBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const servicePayload = buildServicePayload({
        serviceIds: hasServiceUpdate ? req.body.serviceIds : existingBooking.serviceIds,
        services: hasServiceUpdate ? req.body.services : existingBooking.services,
        subscriptionStatus: hasSubscriptionUpdate
          ? req.body.subscriptionStatus
          : existingBooking.subscriptionStatus,
        subscriptionPlan: hasSubscriptionUpdate
          ? req.body.subscriptionPlan
          : existingBooking.subscriptionPlan,
        subscriptionReference: hasSubscriptionUpdate
          ? req.body.subscriptionReference
          : existingBooking.subscriptionReference
      });

      if (servicePayload.error) {
        return res.status(400).json({ message: servicePayload.error });
      }
      Object.assign(updateData, servicePayload.payload);
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

router.delete('/:id', auth, [validateBookingId], async (req, res) => {
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
