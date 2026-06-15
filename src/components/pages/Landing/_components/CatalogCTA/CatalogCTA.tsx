import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/Button/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";

import styles from "./CatalogCTA.module.css";

export const CatalogCTA = () => {
  const t = useTranslations("CatalogCTA");

  return (
    <ScrollReveal id="catalog-cta" className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.description}>{t("description")}</p>
        <div className={styles.buttonWrapper}>
          <Link href="/new-arrivals">
            <Button variant="primary" size="lg">
              {t("button")}
            </Button>
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
};
