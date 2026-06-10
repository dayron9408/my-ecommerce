import { Package } from 'lucide-react';
import type { Product } from '@/types/product';

/**
 * Component que renderiza la imagen del producto con efectos de hover y fallback.
 * Extraído de product-card.tsx para evitar recreación en cada render.
 */
export function ProductCardImage({ product }: { product: Product }) {
  if (!product.image || product.image.trim() === '') {
    return (
      <div className="relative flex aspect-square items-center justify-center bg-linear-to-br from-muted/80 via-muted/40 to-muted/20 overflow-hidden rounded-lg">
        <div className="relative transition-transform duration-500 group-hover:scale-110">
          <Package className="size-16 text-muted-foreground/40" strokeWidth={1.2} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-square items-center justify-center bg-linear-to-br from-muted/80 via-muted/40 to-muted/20 overflow-hidden rounded-lg">
      <img
        src={product.image}
        alt={`${product.name} - ${product.sku}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60" />
    </div>
  );
}