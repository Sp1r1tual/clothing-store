import { notFound } from "next/navigation";

import { findProductBySlug } from "@/db/product";

import { ProductDetail } from "@/components/pages/ProductDetail/ProductDetail";

interface ProductRouteProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductRouteProps) {
  const { locale, slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    return {};
  }

  const title =
    locale === "en" ? product.seoTitleEn || product.nameEn : product.seoTitleUk || product.nameUk;
  const description = locale === "en" ? product.seoDescriptionEn : product.seoDescriptionUk;
  const primaryImage = product.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { locale, slug } = await params;

  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const name =
    locale === "en" ? product.seoTitleEn || product.nameEn : product.seoTitleUk || product.nameUk;
  const description = locale === "en" ? product.seoDescriptionEn : product.seoDescriptionUk;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    image: product.images.map((img) => img.url),
    url: `${baseUrl}/${locale}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.discountPrice ?? product.price,
      availability:
        product.variants.length > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${baseUrl}/${locale}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} locale={locale} />
    </>
  );
}
