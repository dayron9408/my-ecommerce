import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLogin } from '@/hooks/use-auth';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  /** Ruta a dónde redirigir después del login. Por defecto /products */
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/products' }: LoginFormProps) {
  const navigate = useNavigate();
  const login = useLogin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('El usuario es obligatorio.');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    try {
      await login.mutateAsync({ username: username.trim(), password });
      navigate({ to: redirectTo });
    } catch (err) {
      const apiErr = err as { message?: string; details?: Record<string, string[]> };
      if (apiErr?.details && Object.keys(apiErr.details).length > 0) {
        // Mostrar el primer error de validación
        const firstField = Object.keys(apiErr.details)[0];
        setError(apiErr.details[firstField]?.[0] ?? apiErr.message ?? 'Error al iniciar sesión.');
      } else {
        setError(apiErr.message ?? 'Error al iniciar sesión.');
      }
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LogIn className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Iniciar sesión
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-sm font-medium text-foreground/80"
              >
                Usuario
              </label>
              <Input
                id="login-username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={login.isPending}
                autoComplete="username"
                autoFocus
                aria-invalid={!!error}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground/80"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={login.isPending}
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-9 gap-2"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Ingresar
                </>
              )}
            </Button>

            {/* Link a registro */}
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link
                to="/auth/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Crear cuenta
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
