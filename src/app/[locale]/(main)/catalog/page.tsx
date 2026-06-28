import { getTranslations } from "next-intl/server";

import { findAllCategories } from "@/db/category";

import { CatalogDirectory } from "@/components/pages/CatalogDirectory/CatalogDirectory";

export const revalidate = 3600;

interface CatalogRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CatalogPage" });

  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CatalogRoute({ params }: CatalogRouteProps) {
  const { locale } = await params;

  const allCategories = await findAllCategories();

  const getRecursiveProductCount = (categoryId: string): number => {
    const cat = allCategories.find((c) => c.id === categoryId);
    if (!cat) return 0;
    const directCount = cat._count?.products || 0;
    const children = allCategories.filter((c) => c.parentId === categoryId);
    const childrenCount = children.reduce(
      (sum, child) => sum + getRecursiveProductCount(child.id),
      0,
    );
    return directCount + childrenCount;
  };

  const categoriesWithRecursiveCounts = allCategories.map((cat) => ({
    ...cat,
    _count: {
      products: getRecursiveProductCount(cat.id),
      children: cat._count?.children || 0,
    },
  }));

  const t = await getTranslations({ locale, namespace: "CatalogPage" });
  const tSection = await getTranslations({ locale, namespace: "SectionDots" });

  const title = t("title");

  const breadcrumbs = [{ label: tSection("hero"), href: "/" }, { label: title }];

  return (
    <CatalogDirectory
      title={title}
      breadcrumbs={breadcrumbs}
      categories={categoriesWithRecursiveCounts}
      locale={locale}
    />
  );
}
