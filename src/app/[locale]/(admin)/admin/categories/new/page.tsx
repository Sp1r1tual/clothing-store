import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { findCategoriesForSelect } from "@/db/category";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { CategoryForm } from "@/components/pages/admin/categories/CategoryForm/CategoryForm";

import styles from "./page.module.css";

interface NewCategoryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewCategoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.categories.new" });
  return {
    title: t("metaTitle"),
  };
}

export default async function NewCategoryPage({ params }: NewCategoryPageProps) {
  const { locale } = await params;
  const categories = await findCategoriesForSelect();
  const t = await getTranslations({ locale, namespace: "Admin.categories.new" });

  return (
    <div className={styles.page}>
      <AdminPageHeader title={t("title")} subtitle={t("subtitle")} />

      <CategoryForm categories={categories} />
    </div>
  );
}
