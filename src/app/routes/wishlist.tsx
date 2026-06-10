import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useAddToCart } from '@/hooks/use-cart';
import { WishlistView } from '@/features/wishlist/wishlist-view';
import { useCallback } from 'react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: WishlistPage,
});

function WishlistPage() {
  const addToCart = useAddToCart();

  const handleAddToCart = useCallback(
    (productId: string) => {
      addToCart.mutate({ product_id: productId, quantity: 1 });
    },
    [addToCart],
  );

  return <WishlistView onAddToCart={handleAddToCart} />;
}
