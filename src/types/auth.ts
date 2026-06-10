/**
 * Tipos para el sistema de autenticación JWT.
 */

export interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  is_staff: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export interface AuthError {
  code: string;
  message: string;
  details: Record<string, string[]>;
}
