import apiClient from './client';
import type {
  RegisterPayload,
  LoginPayload,
  TokenResponse,
  RefreshResponse,
  User,
} from '@/types/auth';

/**
 * API de autenticación — todos los endpoints públicos.
 *
 * Los endpoints que requieren token usan el interceptor del cliente
 * que inyecta automáticamente el header Authorization: Bearer <token>.
 */
export const authApi = {
  /**
   * POST /auth/register/
   * Crear una cuenta nueva.
   */
  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await apiClient.post<User>('/auth/register/', payload);
    return data;
  },

  /**
   * POST /auth/token/
   * Obtener tokens JWT (access + refresh).
   */
  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/auth/token/', payload);
    return data;
  },

  /**
   * POST /auth/token/refresh/
   * Refrescar access token.
   */
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await apiClient.post<RefreshResponse>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return data;
  },

  /**
   * GET /auth/me/
   * Obtener perfil del usuario autenticado.
   * Requiere token (lo inyecta el interceptor).
   */
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me/');
    return data;
  },
};
