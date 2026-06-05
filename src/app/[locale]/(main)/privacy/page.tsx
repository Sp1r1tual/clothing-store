"use client";

import { useTranslations } from "next-intl";

import styles from "@/components/pages/Privacy/privacy.module.css";
import { BackButton } from "@/components/ui/BackButton/BackButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />

        <h1 className={styles.title}>{t("title")}</h1>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section1Title")}</h2>
            <p className={styles.sectionContent}>{t("section1Content")}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section2Title")}</h2>
            <p className={styles.sectionContent}>{t("section2Content")}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section3Title")}</h2>
            <p className={styles.sectionContent}>{t("section3Content")}</p>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
}
