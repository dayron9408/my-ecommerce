import { ShoppingBag, Loader2, ShieldCheck, Truck } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '@/components/shared/price-display';
import type { CartSummary } from '@/types/cart';

interface CartSummaryCardProps {
  cart?: CartSummary;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export function CartSummaryCard({ cart, onCheckout, isCheckingOut }: CartSummaryCardProps) {
  if (!cart) return null;

  return (
    <Card className="sticky top-24 border-border/60 shadow-lg shadow-primary/5">
      <CardContent className="p-5">
        <h3 className="text-base font-bold tracking-tight">Resumen del pedido</h3>
        <div className="mt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Productos</span>
            <span className="font-medium">{cart.total_items} item(s)</span>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal</span>
            <PriceDisplay price={cart.subtotal} size="md" className="font-bold" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Calculado al checkout</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <ShieldCheck className="size-3.5 text-emerald-500/70" />
            <span>Compra segura con pago protegido</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <Truck className="size-3.5 text-primary/70" />
            <span>Envíos a todo el país</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
          size="lg"
          onClick={onCheckout}
          disabled={isCheckingOut || cart.items.length === 0}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingBag className="size-4 mr-2" />
              Comprar ahora
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
