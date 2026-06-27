"use client";

import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid/ProductGrid";

import styles from "./SearchPage.module.css";

interface SearchPageProps {
  query: string;
  products: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string }[];
    category: { slug: string };
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  locale: string;
}

export const SearchPage = ({
  query,
  products,
  totalCount,
  totalPages,
  currentPage,
  locale,
}: SearchPageProps) => {
  const t = useTranslations("SearchPage");

  const breadcrumbs = [
    { label: locale === "en" ? "Home" : "Головна", href: "/" },
    { label: t("title") },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />

        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.subtitle}>
              {query ? (
                <>
                  {t("resultsFor")}{" "}
                  <span className={styles.queryHighlight}>&ldquo;{query}&rdquo;</span>
                  {totalCount > 0 && (
                    <span className={styles.count}> — {t("found", { count: totalCount })}</span>
                  )}
                </>
              ) : (
                t("enterQuery")
              )}
            </p>
          </div>
        </div>

        <div className={styles.content}>
          {!query ? (
            <EmptyState title={t("emptyQuery.title")} description={t("emptyQuery.description")} />
          ) : products.length === 0 ? (
            <EmptyState
              title={t("noResults.title")}
              description={t("noResults.description", { query })}
            />
          ) : (
            <>
              <ProductGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    priority={index < 4}
                  />
                ))}
              </ProductGrid>

              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
