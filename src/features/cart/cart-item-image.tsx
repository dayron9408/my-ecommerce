import { Package } from 'lucide-react';
import type { CartItem } from '@/types/cart';

/**
 * Component que renderiza la imagen del producto en el carrito con fallback.
 * Extraído de cart-item-row.tsx para evitar recreación en cada render.
 */
export function CartItemImage({ item }: { item: CartItem }) {
  if (!item.product_image || item.product_image.trim() === '') {
    // Fallback: icono de paquete cuando no hay imagen
    return (
      <div className="hidden sm:flex size-16 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-muted/80 to-muted/40 border border-border/50">
        <Package className="size-6 text-muted-foreground/30" strokeWidth={1.5} />
      </div>
    );
  }

  // Imagen disponible
  return (
    <div className="hidden sm:flex size-16 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-muted/80 to-muted/40 border border-border/50 overflow-hidden">
      <img
        src={item.product_image}
        alt={`${item.product_name} - ${item.product_sku}`}
        className="size-full object-cover transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />
    </div>
  );
}