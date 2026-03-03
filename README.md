# Vintage Fades Barbershop

A full-stack web application for managing barber shop bookings and administration.

## Project Structure

This is a monorepo containing:
- `backend/`: Node.js/Express API server with MongoDB
- `frontend/`: React application with Tailwind CSS

## Features

- Admin authentication and dashboard

**Note**: The admin dashboard has been moved to its own standalone site located in the `admin` directory. The public frontend no longer contains links or navigation to the admin panel.

### Admin site setup
1. Navigate to `admin` folder:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

The admin site is a standalone React app that communicates with your backend via an API base URL configured by the `REACT_APP_API_URL` environment variable. If the API is served from the same host as the admin UI (e.g. your admin URL is `https://vintageadmin.netlify.app/` and the server responds at `https://vintageadmin.netlify.app/api`), you do **not** need to set the variable – the code now defaults to `window.location.origin + '/api'`. Otherwise set it explicitly.

To run the admin locally against the production backend:

```bash
# in admin/.env
REACT_APP_API_URL=https://your-backend-url.com/api
```

When you deploy, build the admin app with `npm run build` and host it independently (e.g. on Netlify). For your Netlify admin site (`https://vintageadmin.netlify.app`), you can either rely on the automatic same‑origin default or configure the environment variable under **Site settings → Build & deploy → Environment**.

If you want Netlify to inject a default at build time, the following snippet in `admin/netlify.toml` ensures a placeholder:

```toml
[build.environment]
  REACT_APP_API_URL = "https://vintageadmin.netlify.app/api"  # adjust if backend lives elsewhere
```

After deployment your admin dashboard will request bookings from the API URL and bookings should load correctly.
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