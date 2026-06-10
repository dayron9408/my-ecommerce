import type { PaginatedResponse, PaginationParams, OrderingParams } from './api';

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------

/** Producto en listado (campos reducidos para performance) */
export interface Product {
  id: string;            // UUID
  name: string;
  price: string;         // Decimal como string desde la API
  sku: string;
  stock: number;
  is_in_stock: boolean;
  image: string | null;  // URL completa de la imagen o null
  created_at: string;    // ISO 8601
}

/** Producto en detalle (todos los campos) */
export interface ProductDetail extends Product {
  description: string;
  is_active: boolean;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Payloads (request bodies)
// ---------------------------------------------------------------------------

export interface ProductCreatePayload {
  name: string;
  description?: string;
  price: string;
  sku: string;
  stock?: number;
}

export interface ProductUpdatePayload {
  name?: string;
  description?: string;
  price?: string;
  sku?: string;
  stock?: number;
  is_active?: boolean;
}

// ---------------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------------

export interface ProductFilters extends PaginationParams, OrderingParams {
  search?: string;       // Búsqueda textual (name, description, sku)
  name?: string;         // Filtro por nombre (icontains)
  min_price?: number;
  max_price?: number;
  sku?: string;
  in_stock?: boolean;
}

// ---------------------------------------------------------------------------
// Respuestas de API
// ---------------------------------------------------------------------------

export type ProductListResponse = PaginatedResponse<Product>;
export type ProductDetailResponse = ProductDetail;