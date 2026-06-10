import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState, useCallback } from 'react';

interface ProductFiltersProps {
  onApplyFilters: (filters: { minPrice?: string; maxPrice?: string; inStock?: boolean }) => void;
  defaultValues?: { minPrice?: string; maxPrice?: string; inStock?: boolean };
}

export function ProductFilters({ onApplyFilters, defaultValues }: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState(defaultValues?.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(defaultValues?.maxPrice ?? '');
  const [inStock, setInStock] = useState(defaultValues?.inStock ?? false);
  const [open, setOpen] = useState(false);

  const handleApply = useCallback(() => {
    onApplyFilters({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      inStock: inStock || undefined,
    });
    setOpen(false);
  }, [minPrice, maxPrice, inStock, onApplyFilters]);

  const handleClear = useCallback(() => {
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    onApplyFilters({});
    setOpen(false);
  }, [onApplyFilters]);

  const hasActiveFilters = minPrice || maxPrice || inStock;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/60 bg-secondary/50 hover:bg-secondary transition-all duration-200 gap-2 relative">
          <SlidersHorizontal className="size-4" />
          Filtros
          {hasActiveFilters && (
            <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-lg font-semibold">Filtros</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6 px-4">
          {/* Precio */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Precio</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min={0}
                step="0.01"
                aria-label="Precio mínimo"
                className="bg-secondary/50 border-border/60"
              />
              <span className="text-muted-foreground/60 text-sm">—</span>
              <Input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={0}
                step="0.01"
                aria-label="Precio máximo"
                className="bg-secondary/50 border-border/60"
              />
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 rounded-xl" onClick={handleApply}>
              Aplicar filtros
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl border-border/60" onClick={handleClear}>
              Limpiar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
