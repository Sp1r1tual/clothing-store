"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";

import styles from "./CatalogDirectory.module.css";

interface CategoryItem {
  id: string;
  nameUk: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
  _count?: { products: number; children: number };
}

interface CatalogDirectoryProps {
  categories: CategoryItem[];
  locale: string;
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export const CatalogDirectory = ({
  categories,
  locale,
  title,
  breadcrumbs,
}: CatalogDirectoryProps) => {
  const t = useTranslations("CatalogPage");
  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />

        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{t("description")}</p>
        </div>

        <div className={styles.directoryGrid}>
          {rootCategories.map((root) => {
            const rootName = locale === "en" ? root.nameEn : root.nameUk;
            const children = categories.filter(
              (c) => c.parentId === root.id && c._count?.products !== 0,
            );

            const bgImage = `/categories/${root.slug}.webp`;

            return (
              <ScrollReveal key={root.id} className={styles.categorySection}>
                <div className={styles.unifiedCard} style={{ backgroundImage: `url(${bgImage})` }}>
                  <div className={styles.cardOverlay} />

                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{rootName}</h2>
                    <Link href={`/${root.slug}`} className={styles.viewAllBtn}>
                      {t("viewCollection")} →
                    </Link>
                  </div>

                  {children.length > 0 && (
                    <div className={styles.subcategoriesList}>
                      {children.map((sub) => {
                        const subName = locale === "en" ? sub.nameEn : sub.nameUk;
                        return (
                          <Link key={sub.id} href={`/${sub.slug}`} className={styles.subLink}>
                            <span className={styles.subTitle}>{subName}</span>
                            {sub._count?.products !== undefined && (
                              <span className={styles.subCount}>{sub._count.products}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};
