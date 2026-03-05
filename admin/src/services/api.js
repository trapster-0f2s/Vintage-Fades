import axios from 'axios';

// default to environment variable, otherwise assume API lives under the same origin
// guard window access so build servers (Node) won't crash
const baseOrigin = typeof window !== 'undefined' ? window.location.origin : '';
// build URL prefix with optional /api suffix
let API_URL = process.env.REACT_APP_API_URL || (baseOrigin ? `${baseOrigin}/api` : ''); // when deployed the origin is automatically used

// ensure api root ends with `/api` so callers don't need to remember it
if (API_URL && !API_URL.endsWith('/api')) {
  // trim any trailing slash then append
  API_URL = API_URL.replace(/\/+$/, '') + '/api';
}

console.debug('Resolved API_URL:', API_URL);

console.info('Admin API base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats/summary'),
};

export default api;
