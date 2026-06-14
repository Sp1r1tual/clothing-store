import { prisma } from "@/libs/prisma";

import type { ProductFormData } from "@/common/validation/product/product.schema";

export async function findProducts() {
  return prisma.product.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      nameUk: true,
      nameEn: true,
      slug: true,
      price: true,
      discountPrice: true,
      status: true,
      isFeatured: true,
      createdAt: true,
      category: { select: { nameUk: true, nameEn: true } },
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findCategories() {
  return prisma.category.findMany({
    select: { id: true, nameUk: true, nameEn: true, parentId: true },
    orderBy: { nameUk: "asc" },
  });
}

export async function insertProduct(data: ProductFormData) {
  const { images, variants, discountPrice, ...productData } = data;

  const discount =
    discountPrice !== null && discountPrice !== undefined && !isNaN(Number(discountPrice))
      ? Number(discountPrice)
      : null;

  return prisma.product.create({
    data: {
      ...productData,
      discountPrice: discount,
      publishedAt: productData.status === "PUBLISHED" ? new Date() : null,
      images: {
        create: images.map((img, index) => ({
          url: img.url,
          altText: img.altText || null,
          isPrimary: img.isPrimary,
          order: index,
        })),
      },
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          color: v.color || null,
          stock: v.stock,
          sku: v.sku || null,
        })),
      },
    },
    select: { id: true, slug: true },
  });
}

export async function softDeleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
