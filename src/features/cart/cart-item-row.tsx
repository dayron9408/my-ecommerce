import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import type { CartItem } from '@/types/cart';
import { CartItemImage } from './cart-item-image';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove, disabled }: CartItemRowProps) {
  return (
    <div className="group flex items-center gap-4 py-5 first:pt-0">
      <CartItemImage item={item} />

      {/* Info */}
      <div className="flex flex-1 flex-col min-w-0">
        <span className="font-medium text-sm truncate">{item.product_name}</span>
        <span className="text-xs text-muted-foreground/60 font-mono mt-0.5">SKU: {item.product_sku}</span>
        <PriceDisplay price={item.unit_price} size="sm" variant="muted" className="mt-1" />
      </div>

      <QuantitySelector
        value={item.quantity}
        min={1}
        max={item.product_stock}
        onChange={(qty) => onUpdateQuantity(item.id, qty)}
        disabled={disabled}
        className="shrink-0"
      />

      <div className="w-24 text-right shrink-0">
        <PriceDisplay price={item.subtotal} size="sm" className="font-semibold" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        disabled={disabled}
        aria-label={`Eliminar ${item.product_name} del carrito`}
        className="size-8 shrink-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
