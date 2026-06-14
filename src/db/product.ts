import { prisma } from "@/libs/prisma";

import type { ProductFormData } from "@/common/validation/product/product.schema";

export async function findProducts() {
  const products = await prisma.product.findMany({
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

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
  }));
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

export async function findProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id, deletedAt: null },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      variants: {
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
  };
}

export async function updateProductInDb(id: string, data: ProductFormData) {
  const { images, variants, discountPrice, ...productData } = data;

  const discount =
    discountPrice !== null && discountPrice !== undefined && !isNaN(Number(discountPrice))
      ? Number(discountPrice)
      : null;

  return prisma.$transaction(async (tx) => {
    // 1. Update basic fields
    await tx.product.update({
      where: { id },
      data: {
        ...productData,
        discountPrice: discount,
        publishedAt: productData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // 2. Sync images: Delete and recreate
    await tx.productImage.deleteMany({
      where: { productId: id },
    });

    await tx.productImage.createMany({
      data: images.map((img, index) => ({
        productId: id,
        url: img.url,
        altText: img.altText || null,
        isPrimary: img.isPrimary,
        order: index,
      })),
    });

    // 3. Sync variants: Match by size/color to keep foreign key links
    const existingVariants = await tx.productVariant.findMany({
      where: { productId: id },
    });

    const incomingVariants = variants.map((v) => ({
      size: v.size,
      color: v.color || null,
      stock: v.stock,
      sku: v.sku || null,
    }));

    const variantsToCreate: typeof incomingVariants = [];
    const variantsToUpdate: { id: string; stock: number; sku: string | null }[] = [];
    const matchedVariantIds = new Set<string>();

    for (const incoming of incomingVariants) {
      const match = existingVariants.find(
        (ev) =>
          ev.size.toLowerCase() === incoming.size.toLowerCase() &&
          (ev.color || "").toLowerCase() === (incoming.color || "").toLowerCase(),
      );

      if (match) {
        matchedVariantIds.add(match.id);
        variantsToUpdate.push({
          id: match.id,
          stock: incoming.stock,
          sku: incoming.sku,
        });
      } else {
        variantsToCreate.push(incoming);
      }
    }

    const deleteIds = existingVariants
      .filter((ev) => !matchedVariantIds.has(ev.id))
      .map((ev) => ev.id);

    if (deleteIds.length > 0) {
      await tx.productVariant.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    if (variantsToCreate.length > 0) {
      await tx.productVariant.createMany({
        data: variantsToCreate.map((v) => ({
          productId: id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku,
        })),
      });
    }

    for (const update of variantsToUpdate) {
      await tx.productVariant.update({
        where: { id: update.id },
        data: {
          stock: update.stock,
          sku: update.sku,
        },
      });
    }

    return { id };
  });
}
