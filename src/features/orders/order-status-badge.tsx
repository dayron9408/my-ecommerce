import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import type { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${ORDER_STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground'}`}
    >
      <span className={`size-1.5 rounded-full ${getStatusDotColor(status)}`} />
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

function getStatusDotColor(status: OrderStatus): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    CONFIRMED: 'bg-blue-500',
    PROCESSING: 'bg-indigo-500',
    SHIPPED: 'bg-purple-500',
    DELIVERED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
  };
  return colors[status] ?? 'bg-muted-foreground';
}
