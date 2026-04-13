import axios from 'axios';

/** Em dev, o Vite faz proxy de `/api` → `VITE_API_ORIGIN`. Em produção (Vercel), use `VITE_API_ORIGIN` com a URL do backend (ex.: https://seu-app.onrender.com). */
function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '/api';
  }
  const origin = import.meta.env.VITE_API_ORIGIN;
  if (origin && origin.trim() !== '') {
    return `${origin.replace(/\/$/, '')}/api`;
  }
  return '/api';
}

/**
 * Converte caminhos `/api/...` em URL absoluta do backend em produção.
 * Necessário para `<video src>`, `<img>` etc., que não usam o axios.
 */
export function resolveApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (import.meta.env.DEV) return path;
  const origin = import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/$/, '');
  if (origin) return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  return path;
}

// Create a custom axios instance to reliably inject the token
export const api = axios.create({
  baseURL: getApiBaseUrl(),
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
