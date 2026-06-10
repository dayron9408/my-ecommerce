import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
        {icon ?? <PackageOpen className="size-10 text-muted-foreground/40" strokeWidth={1} />}
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground/70 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6 rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all duration-200">
          {action.label}
        </Button>
      )}
    </div>
  );
}
