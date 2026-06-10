import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface PriceDisplayProps {
  price: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'destructive';
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base font-semibold',
  lg: 'text-2xl font-bold tracking-tight',
};

const variantStyles = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
};

export function PriceDisplay({ price, className, size = 'md', variant = 'default' }: PriceDisplayProps) {
  return (
    <span className={cn('tabular-nums', sizeStyles[size], variantStyles[variant], className)}>
      {formatPrice(price)}
    </span>
  );
}
