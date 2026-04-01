import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (res) => {
    window.dispatchEvent(new Event('server-up'));
    return res;
  },
  (err) => {
    if (err.message === 'Network Error' || (err.response && err.response.status >= 500)) {
      window.dispatchEvent(new Event('server-down'));
    } else {
      window.dispatchEvent(new Event('server-up'));
    }
    
    if (err.response?.status === 401) {
      localStorage.removeItem('tp_token');
      localStorage.removeItem('tp_user');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export default api;
