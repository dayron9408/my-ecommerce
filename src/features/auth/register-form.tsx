import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useRegister } from '@/hooks/use-auth';
import { UserPlus, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validaciones del lado del frontend (las del backend se muestran aparte)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!username.trim()) {
      errs.username = 'El nombre de usuario es obligatorio.';
    } else if (username.length > 150) {
      errs.username = 'Máximo 150 caracteres.';
    }

    if (!email.trim()) {
      errs.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Ingresá un email válido.';
    }

    if (!password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (password.length < 8) {
      errs.password = 'Mínimo 8 caracteres.';
    } else if (/^\d+$/.test(password)) {
      errs.password = 'No puede ser completamente numérica.';
    }

    if (password !== password2) {
      errs.password2 = 'Las contraseñas no coinciden.';
    }

    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      await register.mutateAsync({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      navigate({ to: '/auth/login' });
    } catch (err) {
      const apiErr = err as { details?: Record<string, string[]> };
      if (apiErr?.details) {
        const mapped: Record<string, string> = {};
        for (const [field, msgs] of Object.entries(apiErr.details)) {
          mapped[field] = msgs[0];
        }
        setErrors(mapped);
      }
    }
  };

  const fieldError = (field: string): string | undefined =>
    errors[field] ?? clientErrors[field];

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Crear cuenta
          </CardTitle>
          <CardDescription>
            Completá el formulario para registrarte en la tienda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-username"
                className="text-sm font-medium text-foreground/80"
              >
                Usuario
              </label>
              <Input
                id="reg-username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={register.isPending}
                autoComplete="username"
                autoFocus
                aria-invalid={!!fieldError('username')}
              />
              {fieldError('username') && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <XCircle className="size-3" />
                  {fieldError('username')}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-email"
                className="text-sm font-medium text-foreground/80"
              >
                Email
              </label>
              <Input
                id="reg-email"
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={register.isPending}
                autoComplete="email"
                aria-invalid={!!fieldError('email')}
              />
              {fieldError('email') && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <XCircle className="size-3" />
                  {fieldError('email')}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="text-sm font-medium text-foreground/80"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={register.isPending}
                  autoComplete="new-password"
                  aria-invalid={!!fieldError('password')}
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
              {fieldError('password') && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <XCircle className="size-3" />
                  {fieldError('password')}
                </p>
              )}
              {/* Password strength hints */}
              {password && !fieldError('password') && (
                <ul className="mt-1 space-y-0.5">
                  <li className="flex items-center gap-1 text-xs text-muted-foreground">
                    {password.length >= 8 ? (
                      <CheckCircle2 className="size-3 text-emerald-500" />
                    ) : (
                      <XCircle className="size-3 text-muted-foreground/40" />
                    )}
                    Mínimo 8 caracteres
                  </li>
                  <li className="flex items-center gap-1 text-xs text-muted-foreground">
                    {!/^\d+$/.test(password) ? (
                      <CheckCircle2 className="size-3 text-emerald-500" />
                    ) : (
                      <XCircle className="size-3 text-muted-foreground/40" />
                    )}
                    No completamente numérica
                  </li>
                </ul>
              )}
            </div>

            {/* Confirmar password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password2"
                className="text-sm font-medium text-foreground/80"
              >
                Confirmar contraseña
              </label>
              <Input
                id="reg-password2"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repetí la contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                disabled={register.isPending}
                autoComplete="new-password"
                aria-invalid={!!fieldError('password2')}
              />
              {fieldError('password2') && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <XCircle className="size-3" />
                  {fieldError('password2')}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-9 gap-2"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Crear cuenta
                </>
              )}
            </Button>

            {/* Link a login */}
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
