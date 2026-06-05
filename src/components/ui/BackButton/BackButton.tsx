"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

import { useScrollUp } from "@/hooks/useScrollUp";

import styles from "./BackButton.module.css";

interface BackButtonProps {
  label?: string;
  scrollUp?: boolean;
}

export const BackButton = ({ label, scrollUp = false }: BackButtonProps) => {
  const router = useRouter();
  const t = useTranslations("Common");

  useScrollUp(scrollUp);

  const handleBack = () => {
    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <button className={styles.button} onClick={handleBack}>
      <ArrowLeft size={18} />
      {label ?? t("back")}
    </button>
  );
};
