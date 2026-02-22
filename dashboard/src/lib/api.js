import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let browser set Content-Type with boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      if (hadToken) {
        const msg = err.response?.data?.message || 'Session expired. Please log in again.';
        window.dispatchEvent(new CustomEvent('auth:sessionExpired', { detail: msg }));
      }
      window.dispatchEvent(new Event('storage'));
    }
    return Promise.reject(err);
  }
);

export { API_BASE };
