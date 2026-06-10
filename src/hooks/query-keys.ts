/**
 * Query Key Factory.
 *
 * Patrón recomendado por TanStack Query para organizar las keys.
 * Permite invalidación granular:
 *   - queryClient.invalidateQueries({ queryKey: productKeys.all() })  → todas las queries de productos
 *   - queryClient.invalidateQueries({ queryKey: productKeys.lists() }) → todas las listas
 *   - queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }) → un producto específico
 */

export const productKeys = {
  all: () => ['products'] as const,
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stock: (id: string) => [...productKeys.detail(id), 'stock'] as const,
};

export const cartKeys = {
  all: () => ['cart'] as const,
  summary: () => [...cartKeys.all(), 'summary'] as const,
};

export const orderKeys = {
  all: () => ['orders'] as const,
  lists: () => [...orderKeys.all(), 'list'] as const,
  list: (filters: Record<string, unknown>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all(), 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};