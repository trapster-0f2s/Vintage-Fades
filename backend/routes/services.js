const express = require('express');
const { monthlySubscription, serviceCatalog, flattenServices } = require('../config/services');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    categories: serviceCatalog,
    services: flattenServices(),
    monthlySubscription
  });
});

module.exports = router;
