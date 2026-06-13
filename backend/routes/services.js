const express = require('express');
const {
  membershipPlans,
  monthlySubscription,
  serviceCatalog,
  flattenServices
} = require('../config/services');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    categories: serviceCatalog,
    services: flattenServices(),
    monthlySubscription,
    membershipPlans
  });
});

module.exports = router;
