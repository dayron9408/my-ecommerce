import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 999,
  onChange,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className={cn('flex items-center', className)}>
      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-l-xl rounded-r-none border-border/60 bg-background hover:bg-secondary/80 transition-all duration-200"
        onClick={() => onChange(value - 1)}
        disabled={disabled || !canDecrement}
        aria-label="Disminuir cantidad"
      >
        <Minus className="size-3.5" />
      </Button>
      <div
        className="flex h-9 w-14 items-center justify-center border-y border-border/60 bg-background text-sm font-semibold tabular-nums text-foreground select-none"
        aria-live="polite"
        aria-label={`Cantidad: ${value}`}
      >
        {value}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-r-xl rounded-l-none border-border/60 bg-background hover:bg-secondary/80 transition-all duration-200"
        onClick={() => onChange(value + 1)}
        disabled={disabled || !canIncrement}
        aria-label="Aumentar cantidad"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
