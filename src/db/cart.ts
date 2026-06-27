import { prisma } from "@/libs/prisma";

import { CartItemWithProduct } from "@/types/cart.types";

export * from "@/types/cart.types";

async function getOrCreateCart(profileId: string) {
  return prisma.cart.upsert({
    where: { profileId },
    update: {},
    create: { profileId },
  });
}

export async function getCart(profileId: string): Promise<CartItemWithProduct[]> {
  const cart = await prisma.cart.findUnique({
    where: { profileId },
    select: {
      items: {
        select: {
          id: true,
          quantity: true,
          productId: true,
          variantId: true,
          product: {
            select: {
              id: true,
              nameUk: true,
              nameEn: true,
              slug: true,
              price: true,
              discountPrice: true,
              images: {
                where: { isPrimary: true },
                select: { url: true, altText: true },
                take: 1,
              },
            },
          },
          variant: {
            select: {
              id: true,
              size: true,
              colorUk: true,
              colorEn: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return [];

  return cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
    },
  }));
}

export async function addToCart(
  profileId: string,
  productId: string,
  variantId?: string | null,
  quantity = 1,
) {
  const cart = await getOrCreateCart(profileId);

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId ?? null },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId: variantId ?? null,
      quantity,
    },
  });
}

export async function updateCartItemQuantity(
  profileId: string,
  cartItemId: string,
  quantity: number,
) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.profileId !== profileId) {
    throw new Error("Unauthorized to update this cart item");
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(profileId: string, cartItemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.profileId !== profileId) {
    throw new Error("Unauthorized to remove this cart item");
  }

  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(profileId: string) {
  return prisma.cartItem.deleteMany({
    where: { cart: { profileId } },
  });
}
