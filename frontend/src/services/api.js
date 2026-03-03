import axios from 'axios';

const RAW_API_URL = process.env.REACT_APP_API_URL || 'https://vintage-fades.onrender.com';

const API_URL = RAW_API_URL.replace(/\/+$/, '') + '/api';

console.info('API base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bookings API
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