import { createRoute, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { ProfileView } from '@/features/auth/profile-view';
import { useAuthStore } from '@/store/auth';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/profile',
  component: ProfilePage,
  beforeLoad: async () => {
    // Initialize auth store from localStorage before checking auth
    useAuthStore.getState().initialize();
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
});

function ProfilePage() {
  return <ProfileView />;
}
