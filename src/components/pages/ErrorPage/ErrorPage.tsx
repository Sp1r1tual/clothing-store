"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCcw, ShoppingBag } from "lucide-react";

import { CONTACTS } from "@/common/constants/contacts";

import styles from "./ErrorPage.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations("ErrorPage");

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={styles.iconWrapper}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.5 }}
        >
          <div className={styles.iconPulse} />
          <AlertTriangle size={44} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          className={styles.errorCode}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
        >
          500
        </motion.h1>

        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t("title")}
        </motion.h2>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {t("description")}
        </motion.p>

        {error.digest && (
          <motion.p
            className={styles.errorDetails}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {t("digest")}: {error.digest}
          </motion.p>
        )}

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <button className={`${styles.button} ${styles.buttonRetry}`} onClick={reset}>
            <RefreshCcw size={18} />
            {t("retry")}
          </button>
          <Link href="/" className={`${styles.button} ${styles.buttonPrimary}`}>
            <Home size={18} />
            {t("home")}
          </Link>
          <Link href="/catalog" className={`${styles.button} ${styles.buttonSecondary}`}>
            <ShoppingBag size={18} />
            {t("catalog")}
          </Link>
        </motion.div>

        <motion.p
          style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {t("contact")}{" "}
          <a
            href={`mailto:${CONTACTS.EMAIL}`}
            style={{ color: "var(--accent-color)", textDecoration: "underline" }}
          >
            {CONTACTS.EMAIL}
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};
