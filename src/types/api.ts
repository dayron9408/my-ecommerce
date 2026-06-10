/**
 * Tipos compartidos para la comunicación con la API de Django.
 */

// Respuesta paginada de DRF (PageNumberPagination)
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages?: number;
  current_page?: number;
  page_size?: number;
  results: T[];
}

// Error de la API (formato de nuestro custom exception handler)
export interface ApiErrorResponse {
  code: string;
  message: string;
  details: Record<string, string[]>;
}

// Filtros genéricos
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface OrderingParams {
  ordering?: string; // Ej: '-created_at', 'price'
}