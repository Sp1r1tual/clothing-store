"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useEffect } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { Select } from "@/components/ui/Select/Select";

import { ActiveFilters } from "./_components/ActiveFilters/ActiveFilters";
import { FilterSidebar } from "./_components/FilterSidebar/FilterSidebar";
import { ProductCard } from "./_components/ProductCard/ProductCard";
import { ProductGrid } from "./_components/ProductGrid/ProductGrid";
import { SubcategoryBar } from "./_components/SubcategoryBar/SubcategoryBar";

import styles from "./CatalogPage.module.css";

interface CatalogPageProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  subcategories?: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    _count?: { products: number };
  }[];
  products: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string; stock: number }[];
    category: { slug: string };
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  availableSizes: string[];
  priceRange?: { min: number; max: number };
  locale: string;
}

export const CatalogPage = ({
  title,
  description,
  breadcrumbs,
  subcategories = [],
  products,
  totalCount,
  totalPages,
  currentPage,
  availableSizes,
  priceRange,
  locale,
}: CatalogPageProps) => {
  const t = useTranslations("Catalog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loader = useTopLoader();

  useEffect(() => {
    loader.done();
  }, [searchParams, loader]);

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "newest") params.delete("sort");
    else params.set("sort", value);

    params.delete("page");
    loader.start();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    { value: "newest", label: t("sorting.newest") },
    { value: "popular", label: t("sorting.popular") },
    { value: "price-asc", label: t("sorting.price-asc") },
    { value: "price-desc", label: t("sorting.price-desc") },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />

        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <div className={styles.headerActions}>
            <span className={styles.productCount}>
              {products.length > 0
                ? t("showing", {
                    start: (currentPage - 1) * 12 + 1,
                    end: Math.min(currentPage * 12, totalCount),
                    total: totalCount,
                  })
                : ""}
            </span>
            <div className={styles.desktopSort}>
              <Select options={sortOptions} value={currentSort} onChange={handleSortChange} />
            </div>
          </div>
        </div>

        {subcategories.length > 0 && (
          <SubcategoryBar subcategories={subcategories} locale={locale} />
        )}

        <div className={styles.main}>
          <FilterSidebar availableSizes={availableSizes} priceRange={priceRange} />

          <div className={styles.content}>
            <ActiveFilters />

            {products.length === 0 ? (
              <EmptyState
                title={t("empty.title")}
                description={t("empty.description")}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("subcategory");
                      params.delete("size");
                      params.delete("minPrice");
                      params.delete("maxPrice");
                      loader.start();
                      router.push(`${pathname}?${params.toString()}`);
                    }}
                  >
                    {t("empty.clearFilters")}
                  </Button>
                }
              />
            ) : (
              <>
                <ProductGrid>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
                </ProductGrid>

                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
