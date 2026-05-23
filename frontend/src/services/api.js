import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'https://vintage-fades.onrender.com';

const API_URL = RAW_API_URL.replace(/\/+$/, '') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const servicesAPI = {
  getAll: () => api.get('/services'),
};

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
