import { Link } from '@tanstack/react-router';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { EmptyState } from '@/components/shared/empty-state';
import { useWishlistStore } from '@/store/wishlist';
import { WishlistItemImage } from './wishlist-item-image';

interface WishlistViewProps {
  onAddToCart: (id: string) => void;
}

export function WishlistView({ onAddToCart }: WishlistViewProps) {
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.remove);

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Heart className="size-16 text-muted-foreground/30" strokeWidth={1} />}
          title="Tu lista de deseos está vacía"
          description="Guarda tus productos favoritos acá para encontrarlos rápido después."
          action={{ label: 'Ver productos', onClick: () => window.history.back() }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
            <Link to="/products">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lista de deseos</h1>
            <p className="text-sm text-muted-foreground/60">{items.length} producto(s)</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-border/50 bg-card p-4 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start gap-4 sm:flex-col">
              <WishlistItemImage item={item} />

              <div className="flex-1 min-w-0 sm:mt-3">
                <Link
                  to="/products/$productId"
                  params={{ productId: item.id }}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">SKU: {item.sku}</p>

                <div className="flex items-center justify-between mt-3">
                  <PriceDisplay price={item.price} size="sm" variant="default" className="font-semibold" />

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label={`Sacar ${item.name} de favoritos`}
                      className="size-7 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => onAddToCart(item.id)}
                      disabled={!item.is_in_stock}
                      className="size-7 transition-all hover:scale-110 active:scale-95"
                    >
                      <ShoppingCart className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
