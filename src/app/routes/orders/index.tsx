import { createRoute, useNavigate, useSearch, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useOrders } from '@/hooks/use-orders';
import { useAuthStore } from '@/store/auth';
import { OrderCard } from '@/features/orders/order-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrdersSearchParams {
  status?: string;
  page?: number;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersPage,
  beforeLoad: async () => {
    // Initialize auth store from localStorage before checking auth
    useAuthStore.getState().initialize();
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
  validateSearch: (search: Record<string, unknown>): OrdersSearchParams => ({
    status: search.status as string | undefined,
    page: search.page as number | undefined,
  }),
});

function OrdersPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id });

  const filters = {
    status: search.status as import('@/types/order').OrderStatus | undefined,
    page: search.page,
  };

  const { data, isLoading, isError } = useOrders(filters);

  const handleOrderClick = (orderId: string) => {
    navigate({ to: '/orders/$orderId', params: { orderId } });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
              <Skeleton className="mb-3 h-5 w-1/3 bg-muted/60" />
              <Skeleton className="mb-2 h-4 w-1/2 bg-muted/40" />
              <Skeleton className="h-7 w-1/4 bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar órdenes"
        description="No pudimos obtener tus órdenes. Verificá tu conexión."
        action={{ label: 'Reintentar', onClick: () => window.location.reload() }}
      />
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
        <EmptyState
          icon={<Package className="size-16 text-muted-foreground/30" strokeWidth={1} />}
          title="No tienes órdenes"
          description="Tus órdenes aparecerán aquí después de tu primera compra."
          action={{ label: 'Ver productos', onClick: () => navigate({ to: '/products' }) }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
        <p className="mt-1 text-sm text-muted-foreground/60">
          {data.count} orden(es) encontrada(s)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.results.map((order, index) => (
          <div
            key={order.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
          </div>
        ))}
      </div>

      {/* Paginación */}
      {data.total_pages && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/orders',
                search: (prev) => ({ ...prev, page: Math.max(1, (search.page ?? 1) - 1) }),
              })
            }
            disabled={(search.page ?? 1) <= 1}
            className="rounded-xl border-border/60 gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            Pág. {data.current_page} de {data.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/orders',
                search: (prev) => ({ ...prev, page: Math.min(data.total_pages ?? 1, (search.page ?? 1) + 1) }),
              })
            }
            disabled={(search.page ?? 1) >= (data.total_pages ?? 1)}
            className="rounded-xl border-border/60 gap-1.5"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
