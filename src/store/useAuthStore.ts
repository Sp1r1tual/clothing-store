import type { IUser } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: IUser | null;
  isLoading: boolean;

  setLoading: (isLoading: boolean) => void;
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (data: Partial<IUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setLoading: (isLoading) => set({ isLoading }),

  login: (user) => set({ user, isLoading: false }),

  logout: () => set({ user: null, isLoading: false }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
