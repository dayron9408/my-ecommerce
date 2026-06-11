import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types/api';
import { useAuthStore } from '@/store/auth';
import { authApi } from './auth';

/**
 * Axios instance configurada para la API de Django.
 *
 * Características:
 * - Base URL con versionado (/api/v1/)
 * - CSRF token automático (Django requiere CSRF para mutations)
 * - Interceptores de request (auth, CSRF) y response (error formatting, refresh)
 * - Timeout de 15 segundos
 * - Proxy en desarrollo (ver vite.config.ts)
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Enviar cookies (sessionid, csrftoken)
});

// ---------------------------------------------------------------------------
// Request Interceptor: Auth Token (Bearer) + CSRF Token
// ---------------------------------------------------------------------------
// Django requiere un CSRF token para todas las mutations (POST, PUT, PATCH, DELETE).
// El token viene como cookie 'csrftoken' y debe enviarse como header 'X-CSRFToken'.
function getCSRFToken(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Adjuntar Bearer token si existe
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 2. Adjuntar CSRF token para mutations
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor: Error Formatting + Auto-Refresh en 401
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Transformar el error de la API en un formato consistente
    const apiError: ApiErrorResponse = {
      code: 'UNKNOWN_ERROR',
      message: 'Ha ocurrido un error inesperado.',
      details: {},
    };

    if (error.response) {
      const { status, data } = error.response;
      const errData = data as unknown as Record<string, unknown>;

      if (errData?.error && typeof errData.error === 'object') {
        const apiErr = errData.error as { code?: string; message?: string; details?: Record<string, string[]> };
        apiError.code = apiErr.code ?? `HTTP_${status}`;
        apiError.message = apiErr.message ?? `Error del servidor (${status}).`;
        apiError.details = apiErr.details ?? {};
      } else {
        apiError.code = `HTTP_${status}`;
        apiError.message =
          typeof errData?.detail === 'string'
            ? errData.detail
            : `Error del servidor (${status}).`;
      }

      // --- Auto-refresh en 401 ---
      if (status === 401 && !originalRequest._retry) {
        // No intentar refresh si la request fallida es al propio refresh endpoint
        const isRefreshEndpoint = originalRequest.url?.includes('/auth/token/refresh/');
        if (isRefreshEndpoint) {
          // Refresh falló — cerrar sesión
          useAuthStore.getState().logout();
          return Promise.reject(apiError);
        }

        if (isRefreshing) {
          // Ya hay un refresh en curso: encolar esta request
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            }
            return Promise.reject(apiError);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { refreshToken } = useAuthStore.getState();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const { access } = await authApi.refresh(refreshToken);
          useAuthStore.getState().setAccessToken(access);
          processQueue(null, access);

          // Reintentar request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          return Promise.reject(apiError);
        } finally {
          isRefreshing = false;
        }
      }
    } else if (error.request) {
      apiError.code = 'NETWORK_ERROR';
      apiError.message = 'Sin conexión al servidor. Verifica tu conexión a internet.';
    } else {
      apiError.code = 'CLIENT_ERROR';
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;