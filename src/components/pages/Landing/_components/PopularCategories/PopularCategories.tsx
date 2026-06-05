import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";

import styles from "./PopularCategories.module.css";

const CATEGORIES = [
  {
    id: "hoodies",
    href: "/catalog?category=hoodies",
    image: "/categories/hoodies.png",
  },
  {
    id: "tshirts",
    href: "/catalog?category=tshirts",
    image: "/categories/tshirts.png",
  },
  {
    id: "pants",
    href: "/catalog?category=pants",
    image: "/categories/pants.png",
  },
  {
    id: "jackets",
    href: "/catalog?category=jackets",
    image: "/categories/jackets.png",
  },
];

type CategoryId = "hoodies" | "tshirts" | "pants" | "jackets";

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
              <Image
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
