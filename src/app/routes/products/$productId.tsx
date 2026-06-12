import { createRoute, useParams } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useProduct } from '@/hooks/use-products';
import { useCart, useAddToCart, useUpdateCartItem } from '@/hooks/use-cart';
import { ProductDetailView } from '@/features/products/product-detail';
import { useCallback, useMemo } from 'react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = useParams({ from: Route.id });
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();

  const cartItem = useMemo(() => cart?.items.find((item) => item.product_id === productId), [cart, productId]);
  const cartQuantity = cartItem?.quantity ?? 0;
  const cartItemId = cartItem?.id;

  const handleSetCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (cartQuantity === 0 && quantity > 0) {
        addToCart.mutate({ product_id: productId, quantity });
      } else if (cartQuantity > 0 && cartItemId) {
        updateCartItem.mutate({ itemId: cartItemId, payload: { quantity } });
      }
    },
    [cartQuantity, cartItemId, addToCart, updateCartItem]
  );

  const isUpdating = addToCart.isPending || updateCartItem.isPending;

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
      cartQuantity={cartQuantity}
      onSetCartQuantity={handleSetCartQuantity}
      isUpdating={isUpdating}
    />
  );
}
