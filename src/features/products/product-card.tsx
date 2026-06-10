import { Link } from '@tanstack/react-router';
import { ShoppingCart, Heart } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { useState } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import type { Product } from '@/types/product';
import { ProductCardImage } from './product-card-image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Feedback visual instantáneo al agregar al carrito
  const [cartClicked, setCartClicked] = useState(false);
  // Wishlist
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [wishClicked, setWishClicked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.is_in_stock) return;

    setCartClicked(true);
    onAddToCart(product.id);
    setTimeout(() => setCartClicked(false), 200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setWishClicked(true);
    toggleWishlist(product);
    setTimeout(() => setWishClicked(false), 300);
  };

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group relative flex flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 rounded-lg"
    >
      <CardContent className="flex-1 p-2.5 relative">
        <ProductCardImage product={product} />

        {/* Botones en la esquina superior derecha */}
        <div className="absolute top-4 right-5 flex flex-col gap-1.5">
          {/* Wishlist */}
          <Button
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? `Sacar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
            className={`
              size-7 flex items-center justify-center rounded-lg
              transition-all duration-200 ease-out
              hover:scale-110 active:scale-95
              shadow-md
              ${inWishlist
                ? 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 shadow-rose-500/10'
                : 'bg-background/80 text-muted-foreground/50 hover:text-rose-400 hover:bg-background backdrop-blur-xs'
              }
              ${wishClicked ? 'scale-125' : ''}
            `}
          >
            <Heart
              className={`size-3.5 transition-all duration-200 ${inWishlist ? 'fill-rose-500 scale-110' : ''
                }`}
            />
          </Button>

          {/* Carrito */}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleAddToCart}
            disabled={!product.is_in_stock}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`
              size-7
              transition-all duration-150 ease-out
              hover:scale-110 active:scale-95
              shadow-md
              ${cartClicked
                ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30'
                : ''
              }
            `}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>

        {/* Stock badge */}
        {!product.is_in_stock && (
          <Badge variant="destructive" className="absolute top-3 left-3 text-[10px] uppercase tracking-wider shadow-sm">
            Agotado
          </Badge>
        )}

        {/* Info */}
        <div className="p-3 space-y-1.5">
          {product.name}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/60 font-mono">SKU: {product.sku}</p>
            <PriceDisplay price={product.price} size="sm" variant="default" />
          </div>
        </div>
      </CardContent>
    </Link>
  );
}
