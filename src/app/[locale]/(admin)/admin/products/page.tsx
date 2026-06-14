import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { findProducts } from "@/db/product";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { ProductsTable } from "@/components/pages/admin/products/ProductsTable/ProductsTable";

import styles from "./page.module.css";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.products" });
  return {
    title: t("metaTitle"),
  };
}

export default async function AdminProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const products = await findProducts();
  const t = await getTranslations({ locale, namespace: "Admin.products" });

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title={t("title")}
        subtitle={t("subtitle", { count: products.length })}
        action={
          <Link href={`/admin/products/new`} className={styles.addButton}>
            <Plus size={16} />
            {t("addButton")}
          </Link>
        }
      />

      <ProductsTable products={products} />
    </div>
  );
}
