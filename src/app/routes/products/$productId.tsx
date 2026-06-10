import { createRoute, useParams } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useProduct } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { ProductDetailView } from '@/features/products/product-detail';
import { useCallback, useState } from 'react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = useParams({ from: Route.id });
  const { data: product, isLoading, isError } = useProduct(productId);
  const addToCart = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback(
    (productId: string, quantity: number) => {
      setIsAdding(true);
      addToCart.mutate(
        { product_id: productId, quantity },
        { onSettled: () => setIsAdding(false) },
      );
    },
    [addToCart]
  );

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
      onAddToCart={handleAddToCart}
      isAdding={isAdding}
    />
  );
}
