import apiClient from './client';
import type {
  ProductListResponse,
  ProductDetailResponse,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductFilters,
} from '@/types/product';

/**
 * Servicio de API para el dominio de Productos.
 *
 * Cada función mapea 1:1 a un endpoint del backend.
 * Retorna los datos tipados, sin envolver en { data: ... }.
 */

export const productsApi = {
  /**
   * GET /api/v1/products/
   * Lista productos activos con paginación, filtros y búsqueda.
   */
  list: async (params?: ProductFilters): Promise<ProductListResponse> => {
    const { data } = await apiClient.get<ProductListResponse>('/products/', { params });
    return data;
  },

  /**
   * GET /api/v1/products/{id}/
   * Detalle de un producto.
   */
  getById: async (id: string): Promise<ProductDetailResponse> => {
    const { data } = await apiClient.get<ProductDetailResponse>(`/products/${id}/`);
    return data;
  },

  /**
   * GET /api/v1/products/{id}/stock/?quantity=N
   * Verifica stock disponible.
   */
  checkStock: async (
    id: string,
    quantity: number = 1
  ): Promise<{ product_id: string; current_stock: number; requested_quantity: number; available: boolean }> => {
    const { data } = await apiClient.get(`/products/${id}/stock/`, {
      params: { quantity },
    });
    return data;
  },

  /**
   * POST /api/v1/products/
   * Crea un nuevo producto (requiere admin).
   */
  create: async (payload: ProductCreatePayload): Promise<ProductDetailResponse> => {
    const { data } = await apiClient.post<ProductDetailResponse>('/products/', payload);
    return data;
  },

  /**
   * PATCH /api/v1/products/{id}/
   * Actualización parcial de un producto (requiere admin).
   */
  update: async (id: string, payload: ProductUpdatePayload): Promise<ProductDetailResponse> => {
    const { data } = await apiClient.patch<ProductDetailResponse>(`/products/${id}/`, payload);
    return data;
  },

  /**
   * DELETE /api/v1/products/{id}/
   * Desactiva un producto (soft delete, requiere admin).
   */
  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}/`);
  },
};