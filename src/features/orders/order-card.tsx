import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceDisplay } from '@/components/shared/price-display';
import { OrderStatusBadge } from './order-status-badge';
import { formatDate } from '@/lib/utils';
import { Package } from 'lucide-react';
import type { OrderListItem } from '@/types/order';

interface OrderCardProps {
  order: OrderListItem;
  onClick: (orderId: string) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 border-border/60 group"
      onClick={() => onClick(order.id)}
      role="button"
      tabIndex={0}
      aria-label={`Orden ${order.order_number}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(order.id);
        }
      }}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
              <Package className="size-4" />
            </div>
            <CardTitle className="text-sm font-semibold">{order.order_number}</CardTitle>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDate(order.created_at)}</span>
          <span className="text-xs">{order.items_count} item(s)</span>
        </div>
        <div className="mt-2">
          <PriceDisplay price={order.total_amount} size="md" className="font-bold" />
        </div>
      </CardContent>
    </Card>
  );
}
