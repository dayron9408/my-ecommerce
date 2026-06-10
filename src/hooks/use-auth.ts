import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { cartKeys } from "./query-keys";
import type { ApiErrorResponse } from "@/types/api";
import type { RegisterPayload, LoginPayload } from "@/types/auth";
import { useToast } from "./use-toast";

// ---------------------------------------------------------------------------
// Query key para el perfil
// ---------------------------------------------------------------------------
export const authKeys = {
  profile: () => ["auth", "profile"] as const,
};

// ---------------------------------------------------------------------------
// Hook: useProfile — fetch del perfil (solo si hay token)
// ---------------------------------------------------------------------------

/**
 * Hook para obtener/cachear el perfil del usuario autenticado.
 *
 * Solo se ejecuta si hay un access token guardado. Se desactiva
 * (enabled: false) cuando el usuario cierra sesión.
 */
export function useProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const user = await authApi.getProfile();
      setUser(user);
      return user;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return query;
}

// ---------------------------------------------------------------------------
// Hook: useLogin
// ---------------------------------------------------------------------------

/**
 * Hook de login. Recibe username + password, llama al endpoint de token,
 * y si es exitoso, fetchea el perfil y guarda todo en el store.
 *
 * Retorna mutateAsync para poder hacer el redirect después del login.
 */
export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokens = await authApi.login(payload);
      setTokens(tokens.access, tokens.refresh);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Invalidate cart to refetch with authenticated user's session
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast({ title: "Inicio de sesión exitoso" });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Hook: useRegister
// ---------------------------------------------------------------------------

/**
 * Hook de registro. Crea el usuario y listo — no loguea automáticamente.
 * El componente llama mutateAsync y luego redirige a login.
 */
export function useRegister() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast({
        title: "Cuenta creada",
        description: "Ahora podés iniciar sesión con tus credenciales.",
      });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Hook: useLogout
// ---------------------------------------------------------------------------

/**
 * Hook para cerrar sesión: limpia store, query cache, y redirige.
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(() => {
    logout();
    queryClient.clear(); // Limpiar toda la caché (cart, orders, etc.)
    navigate({ to: "/products" });
  }, [logout, queryClient, navigate]);
}

// ---------------------------------------------------------------------------
// Hook: useRefreshToken
// ---------------------------------------------------------------------------

/**
 * Hook para refrescar el access token.
 * Se usa internamente desde el interceptor de axios.
 */
export function useRefreshToken() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const logout = useAuthStore((s) => s.logout);

  const refresh = useCallback(async (): Promise<string | null> => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const { access } = await authApi.refresh(refreshToken);
      setAccessToken(access);
      return access;
    } catch {
      logout();
      return null;
    }
  }, [refreshToken, setAccessToken, logout]);

  return refresh;
}

// ---------------------------------------------------------------------------
// Initializer: restaurar sesión al cargar la app
// ---------------------------------------------------------------------------

/**
 * Hook que se ejecuta UNA VEZ al montar la app para fetchear el perfil
 * si hay tokens guardados. El store ya se inicializa con los tokens de localStorage.
 */
export function useAuthInitializer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Si hay token, fetchear perfil automáticamente
  useProfile();

  return { isLoading, isAuthenticated };
}
