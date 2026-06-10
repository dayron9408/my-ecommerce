import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { orderKeys, cartKeys } from './query-keys';
import type { OrderFilters, CreateOrderPayload, OrderStatusUpdatePayload } from '@/types/order';
import type { ApiErrorResponse } from '@/types/api';
import { useToast } from './use-toast';

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list((filters ?? {}) as Record<string, unknown>),
    queryFn: () => ordersApi.list(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload?: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: () => {
      // Invalidar ordenes y carrito (carrito queda vacío)
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast({
        title: 'Orden creada',
        description: 'Tu orden ha sido procesada exitosamente.',
      });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: 'Error al crear orden',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancel(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast({
        title: 'Orden cancelada',
        description: 'La orden ha sido cancelada exitosamente.',
      });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: 'Error al cancelar orden',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OrderStatusUpdatePayload }) =>
      ordersApi.updateStatus(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast({
        title: 'Estado actualizado',
        description: 'El estado de la orden fue actualizado.',
      });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        title: 'Error al actualizar estado',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}