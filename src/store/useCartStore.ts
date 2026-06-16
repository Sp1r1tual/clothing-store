import { create } from "zustand";

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  variantId: string | null;
  product: {
    id: string;
    nameUk: string;
    nameEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: { url: string; altText: string | null }[];
  };
  variant: {
    id: string;
    size: string;
    colorUk: string | null;
    colorEn: string | null;
  } | null;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  setCart: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItemId: (oldId: string, newId: string) => void;
  clear: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  setCart: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  updateItemId: (oldId, newId) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === oldId ? { ...i, id: newId } : i)),
    })),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== cartItemId),
    })),

  updateQuantity: (cartItemId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== cartItemId)
          : state.items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)),
    })),

  clear: () => set({ items: [] }),

  getTotalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, i) => {
      const price = i.product.discountPrice ?? i.product.price;
      return sum + price * i.quantity;
    }, 0),
}));
