import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useProducts } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductSearch } from '@/features/products/product-search';
import { ProductFilters } from '@/features/products/product-filters';
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductSearchParams {
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  page?: number;
  ordering?: string;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductSearchParams => ({
    search: search.search as string | undefined,
    min_price: search.min_price as number | undefined,
    max_price: search.max_price as number | undefined,
    in_stock: search.in_stock as boolean | undefined,
    page: search.page as number | undefined,
    ordering: search.ordering as string | undefined,
  }),
});

function ProductsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id });
  const [searchQuery, setSearchQuery] = useState(search.search ?? '');

  const filters = {
    search: search.search,
    min_price: search.min_price,
    max_price: search.max_price,
    in_stock: search.in_stock,
    page: search.page,
    ordering: search.ordering,
  };

  const { data, isLoading, isError } = useProducts(filters);
  const addToCart = useAddToCart();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      navigate({
        to: '/products',
        search: (prev) => ({ ...prev, search: query || undefined, page: undefined }),
      });
    },
    [navigate]
  );

  const handleFilters = useCallback(
    (newFilters: { minPrice?: string; maxPrice?: string; inStock?: boolean }) => {
      navigate({
        to: '/products',
        search: (prev) => ({
          ...prev,
          min_price: newFilters.minPrice ? Number(newFilters.minPrice) : undefined,
          max_price: newFilters.maxPrice ? Number(newFilters.maxPrice) : undefined,
          in_stock: newFilters.inStock || undefined,
          page: undefined,
        }),
      });
    },
    [navigate]
  );

  const handleAddToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      addToCart.mutate({ product_id: productId, quantity });
    },
    [addToCart]
  );

  const currentPage = data?.current_page ?? 1;
  const totalPages = data?.total_pages ?? 1;

  const hasActiveFilters = search.min_price || search.max_price || search.in_stock;

  return (
    <div className="space-y-8">
      {/* Header con gradiente sutil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          {data && (
            <p className="mt-1 text-sm text-muted-foreground/60">
              {data.count} producto(s) encontrados
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ProductSearch onSearch={handleSearch} defaultValue={searchQuery} />
          <ProductFilters onApplyFilters={handleFilters} />
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Filtros activos:</span>
          {search.min_price && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">Mín: ${search.min_price}</span>}
          {search.max_price && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">Máx: ${search.max_price}</span>}
          {search.in_stock && <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400">En stock</span>}
        </div>
      )}

      <ProductGrid
        products={data?.results}
        isLoading={isLoading}
        isError={isError}
        onAddToCart={handleAddToCart}
      />

      {/* Paginación premium */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/products',
                search: (prev) => ({ ...prev, page: Math.max(1, currentPage - 1) }),
              })
            }
            disabled={currentPage <= 1}
            className="rounded-xl border-border/60 gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = currentPage <= 3
                ? i + 1
                : currentPage + i - 2;
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: '/products',
                      search: (prev) => ({ ...prev, page: pageNum }),
                    })
                  }
                  className={`min-w-9 rounded-xl ${pageNum === currentPage
                    ? 'shadow-sm'
                    : 'border-border/60'
                    }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/products',
                search: (prev) => ({ ...prev, page: Math.min(totalPages, currentPage + 1) }),
              })
            }
            disabled={currentPage >= totalPages}
            className="rounded-xl border-border/60 gap-1.5"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
