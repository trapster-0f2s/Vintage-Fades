import axios from 'axios';

// default to environment variable, otherwise assume API lives under the same origin
const API_URL = process.env.REACT_APP_API_URL || `${window.location.origin}/api`; // when deployed to https://vintageadmin.netlify.app, this becomes https://vintageadmin.netlify.app/api

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
