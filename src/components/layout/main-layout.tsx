import { Outlet } from '@tanstack/react-router';
import { Header } from './header';
import { Footer } from './footer';
import { useAuthInitializer } from '@/hooks/use-auth';

export function MainLayout() {
  // Sincronizar sesión: fetchea el perfil si hay tokens guardados
  useAuthInitializer();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
