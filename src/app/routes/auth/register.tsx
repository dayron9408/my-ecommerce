import { createRoute, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { RegisterForm } from '@/features/auth/register-form';
import { useAuthStore } from '@/store/auth';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/register',
  component: RegisterPage,
  beforeLoad: async () => {
    // Initialize auth store from localStorage before checking auth
    useAuthStore.getState().initialize();
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/products' });
    }
  },
});

function RegisterPage() {
  return <RegisterForm />;
}
