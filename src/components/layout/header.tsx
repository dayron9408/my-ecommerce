import { Link } from '@tanstack/react-router';
import { ShoppingCart, Store, Moon, Sun, Package, User, LogIn, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth';
import { useWishlistStore } from '@/store/wishlist';
import { getCartTotalItems } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useState } from 'react';

export function Header() {
  const { data: cart } = useCart();
  const totalItems = cart ? getCartTotalItems(cart.items) : 0;
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Modo claro por defecto cuando no hay preferencia guardada
  const stored = localStorage.getItem('theme');
  const initialIsDark = stored === 'dark';
  const [isDark, setIsDark] = useState(initialIsDark);



  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-8">
          <Link to="/products" className="group flex items-center gap-2.5">
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
              <Store className="size-5" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="hidden sm:inline text-xl font-bold tracking-tight text-foreground">
              {APP_NAME}
            </span>
          </Link>


          {/* Navegación principal */}
          <nav className="hidden sm:flex items-center gap-1" aria-label="Navegación principal">
            <Button variant="ghost" size="sm" asChild className="gap-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Link to="/products">
                <Package className="size-4" />
                Productos
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" size="sm" asChild className="gap-2 font-medium text-muted-foreground hover:text-foreground">
                <Link to="/orders">
                  <Package className="size-4" />
                  Órdenes
                </Link>
              </Button>
            )}
          </nav>
        </div>


        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          >
            {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </Button>


          {/* Auth buttons */}
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div className="h-8 w-24 animate-pulse rounded-xl bg-muted/50" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground">
                <Link to="/auth/profile">
                  <User className="size-4.5" />
                  <span className="hidden sm:inline max-w-25 truncate">
                    {user?.username ?? <span className="animate-pulse bg-muted/50 rounded w-20 h-4 inline-block" />}
                  </span>
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground">
              <Link to="/auth/login">
                <LogIn className="size-4.5" />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            </Button>
          )}


          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
            aria-label={`Lista de deseos con ${wishlistCount} productos`}
          >
            <Heart className={`size-4.5 ${wishlistCount > 0 ? 'text-rose-500' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-scale-in">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>


          {/* Carrito con badge animado */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
            aria-label={`Carrito con ${totalItems} productos`}
          >
            <ShoppingCart className="size-4.5" />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-scale-in">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
