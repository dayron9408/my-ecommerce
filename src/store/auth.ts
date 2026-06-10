import { create } from "zustand";
import type { User } from "@/types/auth";

// ---------------------------------------------------------------------------
// Claves de localStorage
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
} as const;

// ---------------------------------------------------------------------------
// Helpers de persistencia
// ---------------------------------------------------------------------------
function getStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string | null) {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // localStorage no disponible (SSR, bloqueado, etc.)
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export interface AuthState {
  /** Usuario autenticado o null */
  user: User | null;
  /** Access token JWT */
  accessToken: string | null;
  /** Refresh token JWT */
  refreshToken: string | null;
  /** true si hay un token válido guardado */
  isAuthenticated: boolean;
  /** true mientras se restaura sesión al cargar la app */
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  setAccessToken: (access: string) => void;
  login: (access: string, refresh: string, user: User) => void;
  logout: () => void;
  /** Restaurar tokens desde localStorage al iniciar la app */
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // ← true hasta que initialize() termine

  setUser: (user) => set({ user }),

  setTokens: (access, refresh) => {
    setStored(STORAGE_KEYS.ACCESS_TOKEN, access);
    setStored(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setAccessToken: (access) => {
    setStored(STORAGE_KEYS.ACCESS_TOKEN, access);
    set({ accessToken: access });
  },

  login: (access, refresh, user) => {
    setStored(STORAGE_KEYS.ACCESS_TOKEN, access);
    setStored(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    set({
      user,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    setStored(STORAGE_KEYS.ACCESS_TOKEN, null);
    setStored(STORAGE_KEYS.REFRESH_TOKEN, null);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    const access = getStored(STORAGE_KEYS.ACCESS_TOKEN);
    const refresh = getStored(STORAGE_KEYS.REFRESH_TOKEN);

    if (access && refresh) {
      set({
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
