import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriceDisplay } from '@/components/shared/price-display';
import type { OrderItem } from '@/types/order';

interface OrderItemsTableProps {
  items: OrderItem[];
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">Producto</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">SKU</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">Cant.</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">Precio unit.</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground/70">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">{item.product_sku}</TableCell>
              <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
              <TableCell className="text-right">
                <PriceDisplay price={item.unit_price} size="sm" />
              </TableCell>
              <TableCell className="text-right font-semibold">
                <PriceDisplay price={item.subtotal} size="sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
