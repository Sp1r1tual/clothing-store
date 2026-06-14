import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { findAllCategories } from "@/db/category";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { CategoriesTable } from "@/components/pages/admin/categories/CategoriesTable/CategoriesTable";

import styles from "./page.module.css";

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.categories" });
  return {
    title: t("metaTitle"),
  };
}

export default async function AdminCategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  const categories = await findAllCategories();
  const t = await getTranslations({ locale, namespace: "Admin.categories" });

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title={t("title")}
        subtitle={t("subtitle", { count: categories.length })}
        action={
          <Link href="/admin/categories/new" className={styles.addButton}>
            <Plus size={16} />
            {t("addButton")}
          </Link>
        }
      />

      <CategoriesTable categories={categories} />
    </div>
  );
}
