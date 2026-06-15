import { notFound } from "next/navigation";

import { findProductBySlug } from "@/db/product";

import { ProductDetail } from "@/components/pages/ProductDetail/ProductDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    return {};
  }

  const title =
    locale === "en" ? product.seoTitleEn || product.nameEn : product.seoTitleUk || product.nameUk;
  const description = locale === "en" ? product.seoDescriptionEn : product.seoDescriptionUk;

  return {
    title: `${title} | X-Weevo`,
    description,
  };
}

export default async function ProductRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} locale={locale} />;
}
