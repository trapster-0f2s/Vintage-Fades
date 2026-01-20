# Vintage Fades Barbershop

A full-stack web application for managing barber shop bookings and administration.

## Project Structure

This is a monorepo containing:
- `backend/`: Node.js/Express API server with MongoDB
- `frontend/`: React application with Tailwind CSS

## Features

- Admin authentication and dashboard
- Booking management system
- Responsive design with Tailwind CSS
- RESTful API with JWT authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vintage-fades
   ```

2. Install root dependencies:
   ```bash
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   npm install
   # Create .env file with required variables (see .env.example)
   npm run dev
   ```

4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   # Create .env file if needed for production API URL
   npm start
   ```

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/vintage-fades
JWT_SECRET=your-jwt-secret-here
ADMIN_PASSWORD=your-admin-password
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking

### Health Check
- `GET /api/health` - Server health status

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend is ready for deployment as is
```

## Deployment

The frontend is configured for Netlify deployment via `netlify.toml`. Update the build settings and environment variables in Netlify dashboard.

For the backend, deploy to services like Heroku, Vercel, or AWS.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

ISC