import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/Button/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";
import { SkeletonImage } from "@/components/ui/SkeletonImage/SkeletonImage";

import { CATEGORY_IMAGES } from "@/common/constants/images/category-images";

import { CategoryId } from "@/types/ui.types";

import styles from "./PopularCategories.module.css";

const CATEGORIES = [
  {
    id: "shoes",
    href: "/unisex-shoes",
    image: CATEGORY_IMAGES.UNISEX_SHOES,
  },
  {
    id: "outerwear",
    href: "/unisex-outerwear",
    image: CATEGORY_IMAGES.UNISEX_OUTERWEAR,
  },
  {
    id: "pants",
    href: "/unisex-pants",
    image: CATEGORY_IMAGES.UNISEX_PANTS,
  },
  {
    id: "accessories",
    href: "/accessories",
    image: CATEGORY_IMAGES.ACCESSORIES,
  },
];

export const PopularCategories = () => {
  const t = useTranslations("PopularCategories");

  return (
    <ScrollReveal id="categories" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("title")}</h2>
          <Link href="/catalog">
            <Button variant="secondary" size="sm">
              {t("viewAll")}&nbsp;→
            </Button>
          </Link>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={styles.card}
              id={`category-card-${cat.id}`}
            >
              <SkeletonImage
                src={cat.image}
                alt={t(cat.id as CategoryId)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={styles.cardImage}
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div className={styles.overlay} />
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{t(cat.id as CategoryId)}</p>
                <span className={styles.cardLink}>{t("viewCategory")}&nbsp;→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};
