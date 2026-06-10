import { Package } from 'lucide-react';
import type { WishlistItem } from '@/store/wishlist';

/**
 * Component que renderiza la imagen del producto en la lista de deseos con fallback.
 * Extraído de wishlist-view.tsx para evitar recreación en cada render.
 */
export function WishlistItemImage({ item }: { item: WishlistItem }) {
  if (!item.image || item.image.trim() === '') {
    return (
      <div className="size-20 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-muted/80 to-muted/40 border border-border/50">
        <Package className="size-8 text-muted-foreground/30" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="size-20 shrink-0 rounded-xl border border-border/50 overflow-hidden bg-linear-to-br from-muted/80 to-muted/40">
      <img
        src={item.image}
        alt={item.name}
        className="size-full object-cover"
        loading="lazy"
      />
    </div>
  );
}