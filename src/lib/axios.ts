import axios from 'axios';
import { clearAuthTokenCookie, getAuthTokenFromCookie } from '@/lib/auth-cookie';
  
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

// CRIAR UMA INSTÂNCIA DE AXIOS PARA INJETAR O TOKEN DE FORMA RELIÁVEL
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR PARA INJETAR O TOKEN DE FORMA RELIÁVEL
api.interceptors.request.use((config) => {
  const token = getAuthTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // MANEIRA GLOBAL PARA MANIPULAR O STATUS 401
    if (error.response?.status === 401) {
      clearAuthTokenCookie();
      // REDIRECIONAR APENAS SE NÃO ESTIVER EM UMA PÁGINA DE AUTENTICAÇÃO PÚBLICA
      if (!window.location.pathname.match(/^\/(login|register|forgot-password|reset-password)$/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
