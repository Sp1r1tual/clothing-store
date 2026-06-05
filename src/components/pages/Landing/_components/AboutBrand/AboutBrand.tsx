import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";

import { ABOUT_ITEMS } from "@/common/constants/about";

import styles from "./AboutBrand.module.css";

export const AboutBrand = () => {
  const t = useTranslations("AboutBrand");

  return (
    <ScrollReveal id="about" className={styles.container}>
      <div className={styles.header}>
        <span className={styles.subtitle}>{t("subtitle")}</span>
        <h2 className={styles.title}>{t("title")}</h2>
      </div>

      <div className={styles.grid}>
        {ABOUT_ITEMS.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.iconWrapper}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{t(item.titleKey)}</h3>
            <p className={styles.cardDescription}>{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
};
