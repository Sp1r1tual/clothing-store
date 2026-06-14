import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "react-toastify";

import googleLogo from "@/assets/others/google-logo.webp";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

import { getSupabaseBrowser } from "@/common/utils/supabase/client";

import styles from "./GoogleAuthModal.module.css";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

function resolveRedirectPath(redirectPath?: string) {
  if (redirectPath) {
    return redirectPath;
  }

  if (typeof window === "undefined") {
    return "/profile";
  }

  return new URLSearchParams(window.location.search).get("next") || "/profile";
}

export const GoogleAuthModal = ({ isOpen, onClose, redirectPath }: GoogleAuthModalProps) => {
  const t = useTranslations("AuthModal");
  const locale = useLocale();

  const handleGoogleSignIn = async () => {
    try {
      sessionStorage.setItem("pendingLogin", "1");

      const next = resolveRedirectPath(redirectPath);
      const callbackUrl = new URL(`${window.location.origin}/${locale}/auth/callback`);
      callbackUrl.searchParams.set("next", next);

      const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) throw error;
    } catch (error) {
      sessionStorage.removeItem("pendingLogin");
      const message = error instanceof Error ? error.message : "Failed to sign in with Google";
      toast.error(message);
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <Lock className={styles.lockIcon} size={24} />
          </div>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.description}>{t("description")}</p>
        </div>

        <div className={styles.divider} />

        <Button
          variant="google"
          fullWidth
          icon={<Image src={googleLogo} alt="Google" width={20} height={20} />}
          onClick={handleGoogleSignIn}
          aria-label="Sign in with Google"
        >
          {t("googleButton")}
        </Button>
      </div>
    </Modal>
  );
};
