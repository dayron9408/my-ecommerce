import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect, useRef } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function ProductSearch({ onSearch, defaultValue = '' }: ProductSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);

  // Debounce: buscar después de que el usuario deje de escribir (500ms)
  useEffect(() => {
    if (!value.trim()) {
      onSearch('');
      return;
    }

    // Cancelar timeout anterior si hay uno pendiente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Nuevo timeout para buscar después de 500ms sin escribir
    timeoutRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 500);

    // Limpiar timeout al desmontar o si el valor cambia antes de que expire
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <form className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos..."
        className="h-9 pl-9 pr-9 bg-secondary/50 border-border/60 rounded-xl text-sm placeholder:text-muted-foreground/50 focus-visible:bg-background transition-all duration-200"
        aria-label="Buscar productos"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </form>
  );
}
