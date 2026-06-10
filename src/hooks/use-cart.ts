import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api/cart";
import { cartKeys } from "./query-keys";
import { useAuthStore } from "@/store/auth";
import type {
  AddToCartPayload,
  UpdateCartItemPayload,
  CartSummary,
} from "@/types/cart";
import type { ApiErrorResponse } from "@/types/api";
import { useToast } from "./use-toast";

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

/**
 * Hook para obtener el resumen del carrito.
 *
 * El carrito se refresca automáticamente cada 30 segundos
 * para mantenerse sincronizado con el servidor.
 * Espera a que la autenticación se inicialice antes de fetchear.
 */
export function useCart() {
  const isLoading = useAuthStore((s) => s.isLoading);

  return useQuery({
    queryKey: cartKeys.summary(),
    queryFn: cartApi.getSummary,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Polling cada 30s (para sincronizar entre pestañas)
    enabled: !isLoading, // Esperar a que auth termine de inicializar
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Hook para agregar un producto al carrito.
 *
 * OPTIMISTIC UPDATE: Actualiza la UI instantáneamente antes
 * de recibir la respuesta del servidor. Si falla, revierte.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addItem(payload),

    // Optimistic update: actualizar UI instantáneamente
    onMutate: async (payload) => {
      // Cancelar queries en vuelo para evitar sobreescribir nuestro optimistic update
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });

      // Snapshot del estado actual para rollback
      const previousCart = queryClient.getQueryData<CartSummary>(
        cartKeys.summary(),
      );

      // Optimistic: incrementar cantidad o agregar item
      if (previousCart) {
        const existingItem = previousCart.items.find(
          (item) => item.product_id === payload.product_id,
        );

        if (existingItem) {
          // Producto ya en carrito: incrementar cantidad
          const newQuantity = existingItem.quantity + (payload.quantity ?? 1);
          queryClient.setQueryData<CartSummary>(cartKeys.summary(), {
            ...previousCart,
            items: previousCart.items.map((item) =>
              item.product_id === payload.product_id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: (
                      parseFloat(item.unit_price) * newQuantity
                    ).toFixed(2),
                  }
                : item,
            ),
            subtotal: previousCart.items
              .reduce((sum, item) => {
                const qty =
                  item.product_id === payload.product_id
                    ? item.quantity + (payload.quantity ?? 1)
                    : item.quantity;
                return sum + parseFloat(item.unit_price) * qty;
              }, 0)
              .toFixed(2),
          });
        }
      }

      return { previousCart };
    },

    onError: (error: ApiErrorResponse, _variables, context) => {
      // Rollback al estado anterior
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.summary(), context.previousCart);
      }
      toast({
        title: "Error al agregar al carrito",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.summary(), data);
      toast({
        title: "Producto agregado",
        description: `Ahora tienes ${data.total_items} item(s) en el carrito.`,
      });
    },
  });
}

/**
 * Hook para actualizar la cantidad de un item del carrito.
 *
 * OPTIMISTIC UPDATE: La cantidad cambia instantáneamente en la UI.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCartItemPayload;
    }) => cartApi.updateItem(itemId, payload),

    onMutate: async ({ itemId, payload }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });
      const previousCart = queryClient.getQueryData<CartSummary>(
        cartKeys.summary(),
      );

      if (previousCart) {
        queryClient.setQueryData<CartSummary>(cartKeys.summary(), {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: payload.quantity,
                  subtotal: (
                    parseFloat(item.unit_price) * payload.quantity
                  ).toFixed(2),
                }
              : item,
          ),
          subtotal: previousCart.items
            .reduce((sum, item) => {
              const qty = item.id === itemId ? payload.quantity : item.quantity;
              return sum + parseFloat(item.unit_price) * qty;
            }, 0)
            .toFixed(2),
        });
      }

      return { previousCart };
    },

    onError: (error: ApiErrorResponse, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.summary(), context.previousCart);
      }
      toast({
        title: "Error al actualizar",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.summary(), data);
    },
  });
}

/**
 * Hook para eliminar un item del carrito.
 *
 * OPTIMISTIC UPDATE: El item desaparece instantáneamente.
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });
      const previousCart = queryClient.getQueryData<CartSummary>(
        cartKeys.summary(),
      );

      if (previousCart) {
        const filteredItems = previousCart.items.filter(
          (item) => item.id !== itemId,
        );
        queryClient.setQueryData<CartSummary>(cartKeys.summary(), {
          ...previousCart,
          items: filteredItems,
          total_items: filteredItems.length,
          subtotal: filteredItems
            .reduce(
              (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
              0,
            )
            .toFixed(2),
        });
      }

      return { previousCart };
    },

    onError: (error: ApiErrorResponse, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.summary(), context.previousCart);
      }
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.summary(), data);
      toast({ title: "Producto eliminado del carrito" });
    },
  });
}

/**
 * Hook para vaciar todo el carrito.
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cartApi.clear,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });
      const previousCart = queryClient.getQueryData<CartSummary>(
        cartKeys.summary(),
      );

      // Optimistic: carrito vacío
      if (previousCart) {
        queryClient.setQueryData<CartSummary>(cartKeys.summary(), {
          ...previousCart,
          items: [],
          total_items: 0,
          subtotal: "0.00",
        });
      }

      return { previousCart };
    },

    onError: (error: ApiErrorResponse, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.summary(), context.previousCart);
      }
      toast({
        title: "Error al vaciar carrito",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast({ title: "Carrito vaciado" });
    },
  });
}
