const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Admin Login
router.post('/login', [
  body('password').isString().isLength({ min: 1, max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Authentication is not configured' });
    }

    const { password } = req.body;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const passwordPlaintext = process.env.ADMIN_PASSWORD;
    const passwordMatches = passwordHash
      ? await bcrypt.compare(password, passwordHash)
      : passwordPlaintext && password === passwordPlaintext;

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, expiresIn: 86400, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
