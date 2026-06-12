# Vintage Fades Barbershop

Full-stack booking and administration system for Vintage Fades Barbershop.

## Project Structure

- `backend/` - Express API, Supabase Postgres, JWT admin auth, booking validation
- `frontend/` - Public Vite + React booking site
- `admin/` - Standalone Vite + React admin dashboard

## Features

- Public service catalog and appointment booking
- Server-owned pricing and booking totals
- Admin sign-in with JWT-protected booking management
- Booking status management: confirmed, completed, cancelled
- Responsive public and admin interfaces
- Rate limiting, security headers, configurable CORS, and dependency audit cleanup

## Requirements

- Node.js 20 or newer
- npm
- Supabase project URL and service role key

## Environment Variables

### Backend `.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_PASSWORD=replace-with-a-strong-admin-password
# Preferred for production:
# ADMIN_PASSWORD_HASH=bcrypt-hash
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Use `ADMIN_PASSWORD_HASH` in production when possible. `ADMIN_PASSWORD` remains supported for simple deployments.
Run `backend/supabase/schema.sql` in the Supabase SQL editor before starting the API.
Keep `SUPABASE_SERVICE_ROLE_KEY` on the backend only; never expose it to the Vite apps.

### Frontend and Admin

Vite exposes browser environment variables with the `VITE_` prefix:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is omitted, the public site defaults to the Render backend URL currently in the code. The admin app defaults to the current origin plus `/api`.

## Development

Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the public site:

```bash
cd frontend
npm run dev
```

Run the admin dashboard:

```bash
cd admin
npm run dev
```

Default local ports:

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3001`
- API: `http://localhost:5000`

## Build

```bash
cd frontend && npm run build
cd ../admin && npm run build
```

Both Vite apps output to `dist/`.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/services` - Public service catalog
- `POST /api/bookings` - Create public booking
- `POST /api/auth/login` - Admin login
- `GET /api/bookings` - Admin booking list
- `GET /api/bookings/:id` - Admin booking detail
- `PATCH /api/bookings/:id/status` - Admin status update
- `PUT /api/bookings/:id` - Admin booking update
- `DELETE /api/bookings/:id` - Admin booking delete
- `GET /api/bookings/stats/summary` - Admin dashboard stats

Admin booking routes require `Authorization: Bearer <token>`.

## Deployment

Netlify configs are included for the public and admin apps. Build command is `npm run build`; publish directory is `dist`.

Set production environment variables in your hosting dashboards:

- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`, `CORS_ORIGINS`
- Frontend/admin: `VITE_API_URL`

## Security Notes

- Booking totals are computed by the backend from the service catalog.
- Phone numbers are stored as strings to preserve country codes and formatting.
- Admin operations are JWT protected.
- API rate limits and Helmet security headers are enabled.
- Unknown routes return JSON 404 responses.
