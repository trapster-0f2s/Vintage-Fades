const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/auth'));

// Test route
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
  res.json({ status: 'OK', message: 'Server is running' });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server listening on ${server.address().address}:${server.address().port}`);
});