import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { findCategoriesForSelect, findCategoryById } from "@/db/category";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { CategoryForm } from "@/components/pages/admin/categories/CategoryForm/CategoryForm";

import styles from "./page.module.css";

interface EditCategoryPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.categories.edit" });
  return {
    title: t("metaTitle"),
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { locale, id } = await params;
  const [category, categories] = await Promise.all([
    findCategoryById(id),
    findCategoriesForSelect(),
  ]);

  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "Admin.categories.edit" });

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title={t("title")}
        subtitle={locale === "uk" ? category.nameUk : category.nameEn}
      />

      <CategoryForm
        categories={categories}
        editId={id}
        defaultValues={{
          nameUk: category.nameUk,
          nameEn: category.nameEn,
          slug: category.slug,
          parentId: category.parentId ?? null,
          order: category.order,
          seoTitleUk: category.seoTitleUk ?? "",
          seoTitleEn: category.seoTitleEn ?? "",
          seoDescriptionUk: category.seoDescriptionUk ?? "",
          seoDescriptionEn: category.seoDescriptionEn ?? "",
        }}
      />
    </div>
  );
}
