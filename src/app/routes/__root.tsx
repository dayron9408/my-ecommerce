import { createRootRoute } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/main-layout';
import { useAuthStore } from '@/store/auth';

export const Route = createRootRoute({
  beforeLoad: () => {
    // Initialize auth store from localStorage BEFORE any component renders
    useAuthStore.getState().initialize();
  },
  component: MainLayout,
});
