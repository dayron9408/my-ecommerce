import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración global de TanStack Query.
 *
 * Estrategia:
 * - Datos de productos: staleTime alto (5 min) porque cambian poco.
 * - Datos del carrito: staleTime bajo (30s) porque deben reflejar cambios rápido.
 * - Datos de órdenes: staleTime medio (2 min).
 * - Por defecto: staleTime 1 minuto, gcTime 5 minutos.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minuto
      gcTime: 5 * 60 * 1000,          // 5 minutos
      retry: 2,                         // Reintentar 2 veces antes de error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,      // No refetchear al volver a la pestaña
      refetchOnReconnect: true,         // Sí refetchear al recuperar conexión
    },
    mutations: {
      retry: 1,                         // Reintentar mutaciones 1 vez
    },
  },
});