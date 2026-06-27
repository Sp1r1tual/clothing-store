"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Headset, Home, ShoppingBag } from "lucide-react";

import { CONTACTS } from "@/common/constants/contacts";

import styles from "./NotFound.module.css";

export const NotFound = () => {
  const t = useTranslations("NotFound");

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className={styles.errorCode}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
        >
          404
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

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/" className={`${styles.button} ${styles.buttonPrimary}`}>
            <Home size={18} />
            {t("home")}
          </Link>
          <Link href="/catalog" className={`${styles.button} ${styles.buttonSecondary}`}>
            <ShoppingBag size={18} />
            {t("catalog")}
          </Link>
          <a
            href={`mailto:${CONTACTS.EMAIL}`}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            <Headset size={18} />
            {t("support")}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
