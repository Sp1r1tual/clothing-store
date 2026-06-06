"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { useAuthStore } from "@/store/useAuthStore";

import { getSupabaseBrowser } from "@/common/utils/supabase/client";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { login, logout } = useAuthStore();
  const tAuth = useTranslations("AuthModal");
  const tProfile = useTranslations("Profile");

  const routerRef = useRef(router);
  const tAuthRef = useRef(tAuth);
  const tProfileRef = useRef(tProfile);

  useEffect(() => {
    routerRef.current = router;
    tAuthRef.current = tAuth;
    tProfileRef.current = tProfile;
  }, [router, tAuth, tProfile]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    let mounted = true;

    const loadUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          if (mounted) logout();
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (mounted) {
          login({
            id: user.id,
            name:
              profile?.name ||
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "User",
            email: profile?.email || user.email || "",
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || undefined,
            phone: profile?.phone || user.phone || user.user_metadata?.phone || undefined,
            role: profile?.role ?? "Customer",
          });
        }
      } catch (err) {
        console.error("Auth load error:", err);
        if (mounted) logout();
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN") {
        if (sessionStorage.getItem("pendingLogin")) {
          sessionStorage.removeItem("pendingLogin");
          const name = session?.user?.user_metadata?.full_name || "User";
          toast.success(tAuthRef.current("successMessage", { name }));
        }
        loadUser();
        routerRef.current.refresh();
      } else if (event === "SIGNED_OUT") {
        logout();
        toast.success(tProfileRef.current("logoutSuccess"));
        routerRef.current.refresh();
      } else if (event === "USER_UPDATED") {
        loadUser();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
};
