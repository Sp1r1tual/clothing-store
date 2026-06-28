import { MetadataRoute } from "next";

import { prisma } from "@/libs/prisma";

import { BASE_URL } from "@/common/constants/env";

const LOCALES = ["uk", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/catalog", "/search", "/new-arrivals", "/sale", "/privacy", "/terms"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1.0 : 0.7,
    })),
  );

  // Category pages
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap(
    (cat: { slug: string; updatedAt: Date }) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      })),
  );

  // Product pages
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const productEntries: MetadataRoute.Sitemap = products.flatMap(
    (product: { slug: string; updatedAt: Date }) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      })),
  );

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
