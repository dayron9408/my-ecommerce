import { AlertCircle, ShieldCheck, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '@/components/shared/price-display';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { ProductDetail } from '@/types/product';
import { ProductImage } from './product-image';

interface ProductDetailViewProps {
  product?: ProductDetail;
  isLoading: boolean;
  isError: boolean;
  cartQuantity: number;
  onSetCartQuantity: (productId: string, quantity: number) => void;
  isUpdating?: boolean;
}

export function ProductDetailView({ product, isLoading, isError, cartQuantity, onSetCartQuantity, isUpdating }: ProductDetailViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl bg-muted/60" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-muted/60" />
          <Skeleton className="h-6 w-1/4 bg-muted/60" />
          <Skeleton className="h-24 w-full bg-muted/40" />
          <Skeleton className="h-12 w-40 bg-muted/60 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Producto no encontrado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El producto que buscas no existe o fue desactivado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
      {/* Imagen del producto */}
      <ProductImage product={product} />

      {/* Detalles */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground/60 font-mono">SKU: {product.sku}</p>
        </div>

        <PriceDisplay price={product.price} size="lg" className="text-3xl font-bold text-primary" />

        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description || 'Sin descripción disponible.'}
        </p>

        <Separator className="bg-border/50" />

        {/* Stock indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className={`inline-flex items-center gap-1.5 ${product.is_in_stock ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
            <span className={`size-2 rounded-full ${product.is_in_stock ? 'bg-emerald-500' : 'bg-destructive'} animate-pulse`} />
            {product.is_in_stock ? `Stock disponible: ${product.stock} unidades` : 'Producto agotado'}
          </span>
        </div>

        {product.is_in_stock && (
          <QuantitySelector
            value={cartQuantity}
            min={0}
            max={product.stock}
            onChange={(qty) => onSetCartQuantity(product.id, qty)}
            disabled={isUpdating}
          />
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-3">
            <Truck className="size-4 text-primary/70" />
            <div>
              <p className="text-xs font-medium text-foreground">Envío seguro</p>
              <p className="text-[10px] text-muted-foreground/60">A todo el país</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-3">
            <ShieldCheck className="size-4 text-emerald-500/70" />
            <div>
              <p className="text-xs font-medium text-foreground">Compra protegida</p>
              <p className="text-[10px] text-muted-foreground/60">Pago seguro</p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-1 text-xs text-muted-foreground/50">
          <p>Creado: {formatDate(product.created_at)}</p>
          {product.updated_at && <p>Actualizado: {formatDate(product.updated_at)}</p>}
        </div>
      </div>
    </div>
  );
}
