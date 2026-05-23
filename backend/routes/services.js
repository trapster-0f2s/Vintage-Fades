const express = require('express');
const { serviceCatalog, flattenServices } = require('../config/services');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    categories: serviceCatalog,
    services: flattenServices()
  });
});

module.exports = router;
