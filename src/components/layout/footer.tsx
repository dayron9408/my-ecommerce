import { Link } from '@tanstack/react-router';
import { Store } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Store className="size-4" />
              </div>
              <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tu tienda online de confianza. Productos de calidad con los mejores precios.
            </p>
          </div>

          {/* Navegación */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Productos
              </Link>
              <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mis órdenes
              </Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Carrito
              </Link>
            </nav>
          </div>

          {/* Ayuda */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              Ayuda
            </h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground cursor-not-allowed">Preguntas frecuentes</span>
              <span className="text-sm text-muted-foreground cursor-not-allowed">Envíos</span>
              <span className="text-sm text-muted-foreground cursor-not-allowed">Devoluciones</span>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              Contacto
            </h4>
            <p className="text-sm text-muted-foreground">
              ¿Tenés preguntas? Escribinos a:
              <br />
              <span className="text-foreground">admin@{APP_NAME.toLowerCase().replace(/\s+/g, '')}.com</span>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6">
          <p className="text-center text-xs text-muted-foreground/60">
            &copy; {year} {APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
