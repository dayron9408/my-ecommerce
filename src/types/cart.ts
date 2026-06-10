// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------

/** Item del carrito (campos planos del producto) */
export interface CartItem {
  id: string;            // UUID del CartItem
  product_id: string;    // UUID del Product
  product_name: string;
  product_sku: string;
  product_image: string | null;
  product_stock: number;
  quantity: number;
  unit_price: string;    // Decimal como string
  subtotal: string;      // Decimal como string
}

/** Resumen completo del carrito */
export interface CartSummary {
  cart_id: string;
  items: CartItem[];
  total_items: number;
  subtotal: string;      // Decimal como string
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface AddToCartPayload {
  product_id: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ---------------------------------------------------------------------------
// Respuestas
// ---------------------------------------------------------------------------

export type CartSummaryResponse = CartSummary;
