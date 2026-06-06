"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { supabase } from "@/libs/supabase";

import { useAuthStore } from "@/store/useAuthStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const tAuth = useTranslations("AuthModal");
  const tProfile = useTranslations("Profile");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) logout();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { id, email } = session.user;

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, email, avatar_url, phone")
          .eq("id", id)
          .single();

        const meta = session.user.user_metadata;

        login({
          id,
          name: profile?.name || meta.full_name || meta.name || email?.split("@")[0] || "User",
          email: profile?.email || email || "",
          avatar: profile?.avatar_url || meta.avatar_url || "",
          phone: profile?.phone || meta.phone || session.user.phone || "",
        });

        if (sessionStorage.getItem("pendingLogin")) {
          sessionStorage.removeItem("pendingLogin");
          toast.success(
            tAuth("successMessage", {
              name: profile?.name || meta.full_name || meta.name || email?.split("@")[0] || "User",
            }),
          );
        }
      } else {
        logout();

        if (event === "SIGNED_OUT") {
          toast.success(tProfile("logoutSuccess"));
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, tAuth, tProfile]);

  return <>{children}</>;
};
