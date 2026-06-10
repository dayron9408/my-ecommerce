import { useAuthStore } from '@/store/auth';
import { useLogout } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, CalendarDays, ShieldCheck, Mail, LogOut } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function ProfileView() {
  const user = useAuthStore((s) => s.user);
  const { isLoading } = useProfile();
  const logout = useLogout();

  if (isLoading && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="mx-auto mb-3 size-12 rounded-2xl bg-muted/60" />
            <Skeleton className="mx-auto h-7 w-40 bg-muted/60" />
            <Skeleton className="mx-auto mt-2 h-4 w-56 bg-muted/40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg bg-muted/40" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // No debería pasar porque la ruta ya protege
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
            <User className="size-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {user.username}
          </CardTitle>
          <CardDescription>
            {user.is_staff ? 'Administrador' : 'Cliente'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm font-medium truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Fecha de registro */}
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CalendarDays className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                Miembro desde
              </p>
              <p className="text-sm font-medium">
                {formatDate(user.date_joined)}
              </p>
            </div>
          </div>

          {/* Rol */}
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                Rol
              </p>
              <p className="text-sm font-medium">
                {user.is_staff ? 'Administrador' : 'Cliente'}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full gap-2 border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
          <p className="text-xs text-muted-foreground/50 text-center">
            Al cerrar sesión, necesitarás volver a ingresar para comprar.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
