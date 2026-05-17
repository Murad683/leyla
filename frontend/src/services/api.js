import axios from 'axios';

/**
 * Production-ready Axios instance
 * Automatically switches between local and production endpoints
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout for better UX
});

// Response interceptor for centralized error handling on frontend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Bağlantı xətası baş verdi.';
    return Promise.reject({ ...error, message });
  }
);

export default api;
