import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProductDetail } from '@/types/product';

/**
 * Component que renderiza la imagen del producto con fallback y badges.
 * Extraído de product-detail.tsx para evitar recreación en cada render.
 */
export function ProductImage({ product }: { product: ProductDetail }) {
  if (!product.image || product.image.trim() === '') {
    // Fallback: icono de paquete cuando no hay imagen
    return (
      <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br from-muted/80 via-muted/40 to-muted/20 overflow-hidden border border-border/50">
        <Package className="size-32 text-muted-foreground/25" strokeWidth={1} />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/3 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Imagen disponible
  return (
    <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br from-muted/80 via-muted/40 to-muted/20 overflow-hidden border border-border/50">
      <img
        src={product.image}
        alt={`${product.name} - ${product.sku}`}
        className="absolute inset-0 h-full w-full object-scale-down transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
      {/* Overlay de gradiente para mejorar legibilidad */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60" />
      {!product.is_in_stock && (
        <Badge variant="destructive" className="absolute top-4 left-4 text-xs uppercase tracking-wider shadow-sm">
          Agotado
        </Badge>
      )}
    </div>
  );
}