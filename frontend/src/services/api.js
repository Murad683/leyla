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
    if (error.response?.status === 401 && localStorage.getItem('adminToken')) {
      // Session expired or token invalid — clear it and send the admin back to login
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    const message = error.response?.data?.message || 'Bağlantı xətası baş verdi.';
    return Promise.reject({ ...error, message });
  }
);

export default api;
