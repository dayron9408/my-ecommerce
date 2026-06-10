import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/use-cart';
import { useCreateOrder } from '@/hooks/use-orders';
import { useAuthStore } from '@/store/auth';
import { CartEmpty } from '@/features/cart/cart-empty';
import { CartItemRow } from '@/features/cart/cart-item-row';
import { CartSummaryCard } from '@/features/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Usuario no logueado: redirigir a login, volver al carrito después
      navigate({ to: '/auth/login', search: { redirect: '/cart' } });
      return;
    }
    createOrder.mutate(undefined, {
      onSuccess: (data) => {
        navigate({ to: '/orders/$orderId', params: { orderId: data.id } });
      },
    });
  };

  if (!isLoading && (!cart || cart.items.length === 0)) {
    return <CartEmpty />;
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
            <h1 className="text-3xl font-bold tracking-tight">Carrito</h1>
            {cart && (
              <p className="text-sm text-muted-foreground/60">{cart.items.length} producto(s)</p>
            )}
          </div>
        </div>
        {cart && cart.items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
            className="rounded-xl border-border/60 gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="size-4" />
            Vaciar carrito
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="divide-y divide-border/30">
              {cart?.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(itemId, quantity) =>
                    updateItem.mutate({ itemId, payload: { quantity } })
                  }
                  onRemove={(itemId) => removeItem.mutate(itemId)}
                  disabled={updateItem.isPending || removeItem.isPending}
                />
              ))}
            </div>
          </div>

          {/* Seguir comprando */}
          <div className="mt-4">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground">
              <Link to="/products">
                <ArrowLeft className="size-4" />
                Seguir comprando
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <CartSummaryCard
            cart={cart}
            onCheckout={handleCheckout}
            isCheckingOut={createOrder.isPending}
          />
        </div>
      </div>
    </div>
  );
}