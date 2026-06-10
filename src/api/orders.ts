import apiClient from './client';
import type {
  OrderListResponse,
  OrderDetailResponse,
  CreateOrderPayload,
  OrderStatusUpdatePayload,
} from '@/types/order';

/**
 * Servicio de API para el dominio de Órdenes.
 */

export const ordersApi = {
  /**
   * GET /api/v1/orders/
   * Lista las órdenes del usuario autenticado.
   */
  list: async (params?: { status?: string; ordering?: string }): Promise<OrderListResponse> => {
    const { data } = await apiClient.get<OrderListResponse>('/orders/', { params });
    return data;
  },

  /**
   * GET /api/v1/orders/{id}/
   * Detalle de una orden.
   */
  getById: async (id: string): Promise<OrderDetailResponse> => {
    const { data } = await apiClient.get<OrderDetailResponse>(`/orders/${id}/`);
    return data;
  },

  /**
   * POST /api/v1/orders/
   * Crea una orden a partir del carrito.
   */
  create: async (payload?: CreateOrderPayload): Promise<OrderDetailResponse> => {
    const { data } = await apiClient.post<OrderDetailResponse>('/orders/', payload ?? {});
    return data;
  },

  /**
   * POST /api/v1/orders/{id}/cancel/
   * Cancela una orden pendiente.
   */
  cancel: async (id: string): Promise<OrderDetailResponse> => {
    const { data } = await apiClient.post<OrderDetailResponse>(`/orders/${id}/cancel/`);
    return data;
  },

  /**
   * PATCH /api/v1/orders/{id}/status/
   * Actualiza estado (solo admin).
   */
  updateStatus: async (id: string, payload: OrderStatusUpdatePayload): Promise<OrderDetailResponse> => {
    const { data } = await apiClient.patch<OrderDetailResponse>(`/orders/${id}/status/`, payload);
    return data;
  },
};