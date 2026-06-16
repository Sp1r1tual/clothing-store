import { prisma } from "@/libs/prisma";

export type FavoriteProduct = {
  id: string;
  favoriteId: string;
  product: {
    id: string;
    nameUk: string;
    nameEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string }[];
    category: { slug: string };
  };
};

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
            select: { size: true },
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

export async function getFavoriteCount(profileId: string): Promise<number> {
  return prisma.favorite.count({ where: { profileId } });
}
