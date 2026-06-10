import { ShoppingCart } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { useNavigate } from '@tanstack/react-router';

export function CartEmpty() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <EmptyState
        icon={<ShoppingCart className="size-16 text-muted-foreground/30" strokeWidth={1} />}
        title="Tu carrito está vacío"
        description="Agrega productos para empezar a comprar. Te esperamos con los mejores precios."
        action={{
          label: 'Ver productos',
          onClick: () => navigate({ to: '/products' }),
        }}
      />
    </div>
  );
}
