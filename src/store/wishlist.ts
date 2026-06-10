import { create } from 'zustand';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'wishlist_items';

export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string | null;
  sku: string;
  is_in_stock: boolean;
}

function loadFromStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage lleno o bloqueado
  }
}

interface WishlistState {
  items: WishlistItem[];
  /** Agregar o sacar un producto */
  toggle: (product: Product) => void;
  /** Eliminar un producto por ID (útil desde la lista de deseos) */
  remove: (productId: string) => void;
  /** Saber si un producto está en la lista */
  has: (productId: string) => boolean;
  /** Vaciar la lista */
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: loadFromStorage(),

  toggle: (product) => {
    const items = get().items;
    const exists = items.some((item) => item.id === product.id);

    const next = exists
      ? items.filter((item) => item.id !== product.id)
      : [
          ...items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            sku: product.sku,
            is_in_stock: product.is_in_stock,
          },
        ];

    saveToStorage(next);
    set({ items: next });
  },

  remove: (productId) => {
    const next = get().items.filter((item) => item.id !== productId);
    saveToStorage(next);
    set({ items: next });
  },

  has: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  clear: () => {
    saveToStorage([]);
    set({ items: [] });
  },
}));
