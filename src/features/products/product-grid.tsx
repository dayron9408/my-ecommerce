import { ProductCard } from './product-card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  isError: boolean;
  onAddToCart: (productId: string) => void;
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none bg-muted/60" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-muted/60" />
        <Skeleton className="h-3 w-1/3 bg-muted/40" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20 bg-muted/60" />
          <Skeleton className="size-8 rounded-lg bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, isError, onAddToCart }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<LoadingSpinner size="lg" />}
        title="Error al cargar productos"
        description="No pudimos obtener los productos. Verificá tu conexión e intentá de nuevo."
        action={{ label: 'Reintentar', onClick: () => window.location.reload() }}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No hay productos"
        description="No se encontraron productos con los filtros actuales."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
          />
        </div>
      ))}
    </div>
  );
}
