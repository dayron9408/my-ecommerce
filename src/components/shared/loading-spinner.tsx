import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', sizeClasses[size], className)}
      role="status"
      aria-label="Cargando"
      style={{ color: 'oklch(0.42 0.18 260 / 0.6)' }}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
