import { createRoute, useParams, Link, redirect } from '@tanstack/react-router';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { Route as rootRoute } from '../__root';
import { useOrder, useCancelOrder } from '@/hooks/use-orders';
import { useAuthStore } from '@/store/auth';
import { OrderStatusBadge } from '@/features/orders/order-status-badge';
import { OrderItemsTable } from '@/features/orders/order-items-table';
import { PriceDisplay } from '@/components/shared/price-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: OrderDetailPage,
  beforeLoad: async () => {
    // Initialize auth store from localStorage before checking auth
    useAuthStore.getState().initialize();
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: '/orders' } });
    }
  },
});

function OrderDetailPage() {
  const { orderId } = useParams({ from: Route.id });
  const { data: order, isLoading, isError } = useOrder(orderId);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48 bg-muted/60" />
        <Skeleton className="h-6 w-64 bg-muted/40" />
        <Skeleton className="h-48 w-full rounded-xl bg-muted/60" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <EmptyState
        title="Orden no encontrada"
        description="La orden que buscas no existe o no tenés acceso."
        action={{ label: 'Volver a órdenes', onClick: () => window.history.back() }}
      />
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header con volver */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
          <Link to="/orders">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{order.order_number}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground/60 ml-[52px]">
            Creada el {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      {/* Items */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Items de la orden</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderItemsTable items={order.items} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resumen */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{order.items_count}</span>
            </div>
            <Separator className="bg-border/30" />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <PriceDisplay price={order.total_amount} size="md" className="font-bold text-primary" />
            </div>
            {order.notes && (
              <>
                <Separator className="bg-border/30" />
                <div>
                  <span className="text-sm text-muted-foreground">Notas:</span>
                  <p className="mt-1 text-sm bg-muted/30 rounded-lg p-3">{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Acciones */}
        {canCancel && (
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 p-3 mb-4">
                <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Podés cancelar esta orden si todavía no fue procesada.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => cancelOrder.mutate(order.id)}
                disabled={cancelOrder.isPending}
                className="rounded-xl w-full sm:w-auto"
              >
                {cancelOrder.isPending ? 'Cancelando...' : 'Cancelar orden'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
