import axios from 'axios';

// Create a custom axios instance to reliably inject the token
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medlearn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global 401 handler
    if (error.response?.status === 401) {
      localStorage.removeItem('medlearn_token');
      // Only redirect if we're not already on a public auth page
      if (!window.location.pathname.match(/^\/(login|register|forgot-password|reset-password)$/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
