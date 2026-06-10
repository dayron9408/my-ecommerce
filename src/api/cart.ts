import apiClient from './client';
import type { CartSummaryResponse, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';

/**
 * Servicio de API para el dominio de Carrito.
 *
 * El carrito usa cookies de sesión para identificar al usuario.
 * withCredentials: true en el cliente Axios envía las cookies automáticamente.
 */

export const cartApi = {
  /**
   * GET /api/v1/cart/
   * Obtiene el resumen del carrito con todos sus items.
   */
  getSummary: async (): Promise<CartSummaryResponse> => {
    const { data } = await apiClient.get<CartSummaryResponse>('/cart/');
    return data;
  },

  /**
   * POST /api/v1/cart/items/
   * Agrega un producto al carrito.
   */
  addItem: async (payload: AddToCartPayload): Promise<CartSummaryResponse> => {
    const { data } = await apiClient.post<CartSummaryResponse>('/cart/items/', payload);
    return data;
  },

  /**
   * PATCH /api/v1/cart/items/{id}/
   * Actualiza la cantidad de un item del carrito.
   */
  updateItem: async (itemId: string, payload: UpdateCartItemPayload): Promise<CartSummaryResponse> => {
    const { data } = await apiClient.patch<CartSummaryResponse>(`/cart/items/${itemId}/`, payload);
    return data;
  },

  /**
   * DELETE /api/v1/cart/items/{id}/
   * Elimina un item del carrito.
   */
  removeItem: async (itemId: string): Promise<CartSummaryResponse> => {
    const { data } = await apiClient.delete<CartSummaryResponse>(`/cart/items/${itemId}/`);
    return data;
  },

  /**
   * DELETE /api/v1/cart/
   * Vacía todo el carrito.
   */
  clear: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>('/cart/');
    return data;
  },
};