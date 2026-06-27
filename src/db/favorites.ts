import { prisma } from "@/libs/prisma";

import { FavoriteProduct } from "@/types/favorites.types";

export * from "@/types/favorites.types";

export async function getFavorites(profileId: string): Promise<FavoriteProduct[]> {
  const favorites = await prisma.favorite.findMany({
    where: { profileId },
    select: {
      id: true,
      product: {
        select: {
          id: true,
          nameUk: true,
          nameEn: true,
          slug: true,
          price: true,
          discountPrice: true,
          isFeatured: true,
          images: {
            select: { url: true, altText: true },
            orderBy: { order: "asc" },
            take: 2,
          },
          variants: {
            select: { size: true, stock: true },
          },
          category: {
            select: { slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((fav) => ({
    id: fav.product.id,
    favoriteId: fav.id,
    product: {
      ...fav.product,
      price: Number(fav.product.price),
      discountPrice: fav.product.discountPrice ? Number(fav.product.discountPrice) : null,
    },
  }));
}

export async function getFavoriteIds(profileId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { profileId },
    select: { productId: true },
  });
  return favorites.map((f) => f.productId);
}

export async function addFavorite(profileId: string, productId: string) {
  return prisma.favorite.upsert({
    where: { profileId_productId: { profileId, productId } },
    create: { profileId, productId },
    update: {},
  });
}

export async function removeFavorite(profileId: string, productId: string) {
  return prisma.favorite.deleteMany({
    where: { profileId, productId },
  });
}

export async function isFavorited(profileId: string, productId: string): Promise<boolean> {
  const fav = await prisma.favorite.findUnique({
    where: { profileId_productId: { profileId, productId } },
  });
  return fav !== null;
}
