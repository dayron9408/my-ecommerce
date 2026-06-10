import { createRoute, useSearch, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { LoginForm } from '@/features/auth/login-form';
import { useAuthStore } from '@/store/auth';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/login',
  component: LoginPage,
  validateSearch: (search) => ({
    redirect: search.redirect as string | undefined,
  }),
  beforeLoad: async () => {
    // Initialize auth store from localStorage before checking auth
    useAuthStore.getState().initialize();
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/products' });
    }
  },
});

function LoginPage() {
  const search = useSearch({ from: Route.id });
  const redirectTo = search.redirect ?? '/products';

  return <LoginForm redirectTo={redirectTo} />;
}
