import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { findCategories, findProductById } from "@/db/product";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { ProductForm } from "@/components/pages/admin/products/ProductForm/ProductForm";

import styles from "./page.module.css";

interface EditProductPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.products.edit" });
  return {
    title: t("metaTitle"),
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { locale, id } = await params;
  const product = await findProductById(id);

  if (!product) {
    notFound();
  }

  const categories = await findCategories();
  const t = await getTranslations({ locale, namespace: "Admin.products.edit" });

  const mappedProduct = {
    nameUk: product.nameUk || "",
    nameEn: product.nameEn || "",
    slug: product.slug || "",
    descriptionUk: product.descriptionUk || "",
    descriptionEn: product.descriptionEn || "",
    compositionUk: product.compositionUk || "",
    compositionEn: product.compositionEn || "",
    careInstructionsUk: product.careInstructionsUk || "",
    careInstructionsEn: product.careInstructionsEn || "",
    measurementsUk: product.measurementsUk || "",
    measurementsEn: product.measurementsEn || "",
    price: product.price,
    discountPrice: product.discountPrice,
    status: product.status,
    categoryId: product.categoryId,
    seoTitleUk: product.seoTitleUk || "",
    seoTitleEn: product.seoTitleEn || "",
    seoDescriptionUk: product.seoDescriptionUk || "",
    seoDescriptionEn: product.seoDescriptionEn || "",
    isFeatured: product.isFeatured,
    images: product.images.map((img) => ({
      url: img.url,
      altText: img.altText || "",
      isPrimary: img.isPrimary,
      order: img.order,
    })),
    variants: product.variants.map((v) => ({
      size: v.size,
      colorUk: v.colorUk || "",
      colorEn: v.colorEn || "",
      sku: v.sku || "",
    })),
  };

  return (
    <div className={styles.page}>
      <AdminPageHeader title={t("title")} subtitle={t("subtitle")} />

      <ProductForm categories={categories} initialData={mappedProduct} productId={product.id} />
    </div>
  );
}
