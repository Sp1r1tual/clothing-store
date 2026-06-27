"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getCartAction } from "@/actions/cart.actions";
import { getFavoriteIdsAction } from "@/actions/favorites.actions";
import { useRouter } from "@/i18n/navigation";
import type { IUser } from "@/types";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

import { getCurrentUserAction } from "@/common/auth/actions";
import { getSupabaseBrowser } from "@/common/utils/supabase/client";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: IUser | null;
  initialCart: CartItem[];
  initialFavorites: string[];
}

async function hydrateUserData() {
  try {
    const [cartItems, favoriteIds] = await Promise.all([
      getCartAction().catch(() => []),
      getFavoriteIdsAction().catch(() => []),
    ]);
    useCartStore.setState({ items: cartItems as never });
    useFavoritesStore.setState({ ids: favoriteIds });
  } catch {
    // silently fail — stores stay empty
  }
}

export const AuthProvider = ({
  children,
  initialUser,
  initialCart,
  initialFavorites,
}: AuthProviderProps) => {
  const router = useRouter();
  const { login, logout } = useAuthStore();
  const tAuth = useTranslations("AuthModal");
  const tProfile = useTranslations("Profile");

  const routerRef = useRef(router);
  const tAuthRef = useRef(tAuth);
  const tProfileRef = useRef(tProfile);

  const isHydrated = useRef(Boolean(initialUser));

  useState(() => {
    useAuthStore.setState({ user: initialUser, isLoading: false });
    useCartStore.setState({ items: initialCart });
    useFavoritesStore.setState({ ids: initialFavorites });
  });

  useEffect(() => {
    routerRef.current = router;
    tAuthRef.current = tAuth;
    tProfileRef.current = tProfile;
  }, [router, tAuth, tProfile]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    let mounted = true;

    const syncUser = async () => {
      try {
        const user = await getCurrentUserAction();

        if (!mounted) {
          return;
        }

        if (user) {
          login(user);
          if (!isHydrated.current) {
            isHydrated.current = true;
            void hydrateUserData();
          }
        } else {
          logout();
          isHydrated.current = false;
          useCartStore.setState({ items: [] });
          useFavoritesStore.setState({ ids: [] });
        }
      } catch (err) {
        console.error("Auth sync error:", err);
        if (mounted) {
          logout();
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN") {
        const isNewLogin = Boolean(sessionStorage.getItem("pendingLogin"));
        if (isNewLogin) {
          sessionStorage.removeItem("pendingLogin");
          const name = session?.user?.user_metadata?.full_name || "User";
          toast.success(tAuthRef.current("successMessage", { name }));
          routerRef.current.refresh();
        }
        void syncUser();
      } else if (event === "SIGNED_OUT") {
        void syncUser();
      } else if (event === "USER_UPDATED") {
        void syncUser();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
};
