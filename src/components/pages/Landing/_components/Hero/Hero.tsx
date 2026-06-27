import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";

import { Features } from "../Features/Features";
import { HeroCarousel } from "./Carousel";

import styles from "./Hero.module.css";

export const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.subtitle}>{t("subtitle")}</span>

        <h1 className={styles.title}>{t("title")}</h1>

        <p className={styles.description}>{t("description")}</p>

        <div className={styles.btnGroup}>
          <Link href="/catalog">
            <Button variant="primary">{t("ctaCatalog")}</Button>
          </Link>

          <Button variant="secondary" icon={<Play size={9} fill="currentColor" />} iconCircle>
            {t("ctaVideo")}
          </Button>
        </div>

        <Features variant="compact" />
      </div>

      <HeroCarousel />
    </section>
  );
};
