import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { productKeys } from './query-keys';
import type { ProductFilters, ProductCreatePayload, ProductUpdatePayload } from '@/types/product';
import type { ApiErrorResponse } from '@/types/api';
import { useToast } from './use-toast';

// ---------------------------------------------------------------------------
// Queries (lecturas)
// ---------------------------------------------------------------------------

/**
 * Hook para listar productos con filtros y paginación.
 *
 * Uso:
 *   const { data, isLoading, error } = useProducts({ search: 'camiseta', in_stock: true });
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list((filters ?? {}) as Record<string, unknown>),
    queryFn: () => productsApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos (productos cambian poco)
  });
}

/**
 * Hook para obtener el detalle de un producto.
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId, // No ejecutar si no hay ID
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para verificar stock de un producto.
 */
export function useProductStock(productId: string, quantity: number = 1) {
  return useQuery({
    queryKey: productKeys.stock(productId),
    queryFn: () => productsApi.checkStock(productId, quantity),
    enabled: !!productId && quantity > 0,
    staleTime: 30 * 1000, // 30 segundos (stock cambia más)
  });
}

// ---------------------------------------------------------------------------
// Mutations (escrituras)
// ---------------------------------------------------------------------------

/**
 * Hook para crear un producto (admin).
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ProductCreatePayload) => productsApi.create(payload),
    onSuccess: () => {
      // Invalidar todas las listas de productos para reflejar el nuevo producto
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast({ title: 'Producto creado', description: 'El producto se creó exitosamente.' });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: 'Error al crear producto',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para actualizar un producto (admin).
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductUpdatePayload }) =>
      productsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast({ title: 'Producto actualizado', description: 'Los cambios se guardaron exitosamente.' });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: 'Error al actualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}