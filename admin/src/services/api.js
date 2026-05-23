import axios from 'axios';

// default to environment variable, otherwise assume API lives under the same origin
// guard window access so build servers (Node) won't crash
const baseOrigin = typeof window !== 'undefined' ? window.location.origin : '';
// build URL prefix with optional /api suffix
let API_URL = import.meta.env.VITE_API_URL || (baseOrigin ? `${baseOrigin}/api` : '');

// ensure api root ends with `/api` so callers don't need to remember it
if (API_URL && !API_URL.endsWith('/api')) {
  // trim any trailing slash then append
  API_URL = API_URL.replace(/\/+$/, '') + '/api';
}

const TOKEN_KEY = 'vintage_fades_admin_token';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getStoredToken = () => (
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : ''
);

export const setStoredToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const authAPI = {
  login: (password) => api.post('/auth/login', { password }),
};

export const bookingsAPI = {
  getAll: (params = {}) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats/summary'),
};

export default api;
