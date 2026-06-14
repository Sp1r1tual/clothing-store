import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { findCategories } from "@/db/product";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { ProductForm } from "@/components/pages/admin/products/ProductForm/ProductForm";

import styles from "./page.module.css";

interface NewProductPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.products.new" });
  return {
    title: t("metaTitle"),
  };
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale } = await params;
  const categories = await findCategories();
  const t = await getTranslations({ locale, namespace: "Admin.products.new" });

  return (
    <div className={styles.page}>
      <AdminPageHeader title={t("title")} subtitle={t("subtitle")} />

      <ProductForm categories={categories} />
    </div>
  );
}
