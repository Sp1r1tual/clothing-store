import { prisma } from "@/libs/prisma";

export type CartItemWithProduct = {
  id: string;
  quantity: number;
  productId: string;
  variantId: string | null;
  product: {
    id: string;
    nameUk: string;
    nameEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: { url: string; altText: string | null }[];
  };
  variant: {
    id: string;
    size: string;
    colorUk: string | null;
    colorEn: string | null;
  } | null;
};

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

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(cartItemId: string) {
  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(profileId: string) {
  return prisma.cartItem.deleteMany({
    where: { cart: { profileId } },
  });
}

export async function getCartItemCount(profileId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { profileId },
    select: { items: { select: { quantity: true } } },
  });
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
