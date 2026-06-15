import { create } from "zustand";

interface FavoritesState {
  ids: string[];
  isLoading: boolean;
  setFavorites: (ids: string[]) => void;
  setLoading: (loading: boolean) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => boolean;
  has: (productId: string) => boolean;
  getCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  isLoading: false,

  setFavorites: (ids) => set({ ids }),
  setLoading: (isLoading) => set({ isLoading }),

  add: (productId) =>
    set((state) => ({
      ids: state.ids.includes(productId) ? state.ids : [...state.ids, productId],
    })),

  remove: (productId) =>
    set((state) => ({
      ids: state.ids.filter((id) => id !== productId),
    })),

  toggle: (productId) => {
    const current = get().ids.includes(productId);
    if (current) {
      set((state) => ({ ids: state.ids.filter((id) => id !== productId) }));
    } else {
      set((state) => ({ ids: [...state.ids, productId] }));
    }
    return !current;
  },

  has: (productId) => get().ids.includes(productId),

  getCount: () => get().ids.length,
}));
