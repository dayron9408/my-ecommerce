import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as cartRoute } from './routes/cart';
import { Route as productsIndexRoute } from './routes/products/index';
import { Route as productsProductIdRoute } from './routes/products/$productId';
import { Route as ordersIndexRoute } from './routes/orders/index';
import { Route as ordersOrderIdRoute } from './routes/orders/$orderId';
import { Route as loginRoute } from './routes/auth/login';
import { Route as registerRoute } from './routes/auth/register';
import { Route as profileRoute } from './routes/auth/profile';
import { Route as wishlistRoute } from './routes/wishlist';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  productsIndexRoute,
  productsProductIdRoute,
  ordersIndexRoute,
  ordersOrderIdRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  wishlistRoute,
]);
