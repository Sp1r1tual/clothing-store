"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { getCartAction } from "@/actions/cart.actions";
import { getFavoriteIdsAction } from "@/actions/favorites.actions";
import { useRouter } from "@/i18n/navigation";
import type { IUser } from "@/types";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

import { getCurrentUserAction } from "@/common/auth/actions";
import { getSupabaseBrowser } from "@/common/utils/supabase/client";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: IUser | null;
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

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const router = useRouter();
  const { login, logout } = useAuthStore();
  const tAuth = useTranslations("AuthModal");
  const tProfile = useTranslations("Profile");

  const routerRef = useRef(router);
  const tAuthRef = useRef(tAuth);
  const tProfileRef = useRef(tProfile);
  const isInitialized = useRef<boolean | null>(null);
  if (isInitialized.current == null) {
    useAuthStore.setState({ user: initialUser, isLoading: false });
    isInitialized.current = true;
  }

  useEffect(() => {
    routerRef.current = router;
    tAuthRef.current = tAuth;
    tProfileRef.current = tProfile;
  }, [router, tAuth, tProfile]);

  const initialUserRef = useRef(initialUser);

  useEffect(() => {
    if (initialUserRef.current) {
      void hydrateUserData();
    }
  }, []);

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
          void hydrateUserData();
        } else {
          logout();
          // clear stores on logout
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
        if (sessionStorage.getItem("pendingLogin")) {
          sessionStorage.removeItem("pendingLogin");
          const name = session?.user?.user_metadata?.full_name || "User";
          toast.success(tAuthRef.current("successMessage", { name }));
        }
        void syncUser();
        routerRef.current.refresh();
      } else if (event === "SIGNED_OUT") {
        logout();
        useCartStore.setState({ items: [] });
        useFavoritesStore.setState({ ids: [] });
        toast.success(tProfileRef.current("logoutSuccess"));
        routerRef.current.refresh();
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
