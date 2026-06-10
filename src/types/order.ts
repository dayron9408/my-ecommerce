import type { PaginatedResponse, PaginationParams, OrderingParams } from './api';

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

/** Item dentro de una orden (snapshot del producto) */
export interface OrderItem {
  id: string;
  product: string | null; // UUID o null si producto fue eliminado
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
}

/** Orden en listado (campos reducidos) */
export interface OrderListItem {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: string;
  items_count: number;
  created_at: string;
}

/** Orden en detalle (con items) */
export interface OrderDetail extends OrderListItem {
  notes: string;
  items: OrderItem[];
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface CreateOrderPayload {
  notes?: string;
}

export interface OrderStatusUpdatePayload {
  status: OrderStatus;
}

// ---------------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------------

export interface OrderFilters extends PaginationParams, OrderingParams {
  status?: OrderStatus;
}

// ---------------------------------------------------------------------------
// Respuestas
// ---------------------------------------------------------------------------

export type OrderListResponse = PaginatedResponse<OrderListItem>;
export type OrderDetailResponse = OrderDetail;