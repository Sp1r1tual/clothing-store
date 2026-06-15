"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Heart, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/Badge/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay/PriceDisplay";

import { ProductCard } from "../Catalog/_components/ProductCard/ProductCard";
import { ImageGallery } from "./_components/ImageGallery/ImageGallery";
import { SizeSelector } from "./_components/SizeSelector/SizeSelector";

import styles from "./ProductDetail.module.css";

interface ProductDetailProps {
  product: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    compositionUk: string | null;
    compositionEn: string | null;
    careInstructionsUk: string | null;
    careInstructionsEn: string | null;
    measurementsUk: string | null;
    measurementsEn: string | null;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string; stock: number }[];
    category: {
      slug: string;
      nameUk: string;
      nameEn: string;
      parent: { slug: string; nameUk: string; nameEn: string } | null;
    } | null;
    relatedProducts: {
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
  };
  locale: string;
}

export const ProductDetail = ({ product, locale }: ProductDetailProps) => {
  const t = useTranslations("ProductDetail");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const name = locale === "en" ? product.nameEn : product.nameUk;
  const description = locale === "en" ? product.descriptionEn : product.descriptionUk;
  const composition = locale === "en" ? product.compositionEn : product.compositionUk;
  const care = locale === "en" ? product.careInstructionsEn : product.careInstructionsUk;
  const measurements = locale === "en" ? product.measurementsEn : product.measurementsUk;

  const totalStock = product.variants.reduce(
    (acc: number, v: { stock: number }) => acc + v.stock,
    0,
  );
  const isOutOfStock = totalStock === 0;

  let discountPercentage = 0;
  if (product.discountPrice && product.discountPrice < product.price) {
    discountPercentage = Math.round(
      ((product.price - product.discountPrice) / product.price) * 100,
    );
  }

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: locale === "en" ? "Home" : "Головна", href: "/" },
  ];

  if (product.category) {
    if (product.category.parent) {
      breadcrumbs.push({
        label: locale === "en" ? product.category.parent.nameEn : product.category.parent.nameUk,
        href: `/${product.category.parent.slug}`,
      });
    }
    breadcrumbs.push({
      label: locale === "en" ? product.category.nameEn : product.category.nameUk,
      href: `/${product.category.parent?.slug || product.category.slug}?subcategory=${product.category.slug}`,
    });
  }

  breadcrumbs.push({ label: name });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />

        <div className={styles.mainContent}>
          <div className={styles.gallerySection}>
            <ImageGallery images={product.images} />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>{name}</h1>
              <div className={styles.priceRow}>
                <PriceDisplay
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="lg"
                />
                {!isOutOfStock && discountPercentage > 0 && (
                  <Badge variant="sale" label={`-${discountPercentage}%`} />
                )}
                {isOutOfStock && <Badge variant="outOfStock" label={t("out-of-stock")} />}
              </div>
            </div>

            <div className={styles.optionsSection}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{t("size")}</span>
                {!selectedSize && !isOutOfStock && (
                  <span className={styles.optionError}>{t("select-size")}</span>
                )}
              </div>
              <SizeSelector
                variants={product.variants}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>

            <div className={styles.actions}>
              <Button
                fullWidth
                size="lg"
                disabled={isOutOfStock || !selectedSize}
                icon={<ShoppingBag size={20} />}
                onClick={() => console.log("Add to cart", product.id, selectedSize)}
              >
                {t("add-to-cart")}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<Heart size={20} />}
                onClick={() => console.log("Add to favorites", product.id)}
              >
                {t("add-to-favorites")}
              </Button>
            </div>

            <div className={styles.detailsSection}>
              {description && (
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>{t("details")}</h3>
                  <p className={styles.detailContent}>{description}</p>
                </div>
              )}

              {composition && (
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>{t("composition")}</h3>
                  <p className={styles.detailContent}>{composition}</p>
                </div>
              )}

              {care && (
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>{t("care")}</h3>
                  <p className={styles.detailContent}>{care}</p>
                </div>
              )}

              {measurements && (
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>{t("measurements")}</h3>
                  <p className={styles.detailContent}>{measurements}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>{t("related")}</h2>
            <div className={styles.relatedGrid}>
              {product.relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
