import { prisma } from "@/libs/prisma";

import { CartItemWithProduct } from "@/types/cart.types";

export * from "@/types/cart.types";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getCart(userId: string): Promise<CartItemWithProduct[]> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
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

  return cart.items;
}

export async function addToCart(
  userId: string,
  productId: string,
  variantId?: string | null,
  quantity = 1,
) {
  const cart = await getOrCreateCart(userId);

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

export async function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
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

export async function removeCartItem(userId: string, cartItemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new Error("Unauthorized to remove this cart item");
  }

  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(userId: string) {
  return prisma.cartItem.deleteMany({
    where: { cart: { userId } },
  });
}
