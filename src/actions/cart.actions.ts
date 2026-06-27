"use server";

import { addToCart, clearCart, getCart, removeCartItem, updateCartItemQuantity } from "@/db/cart";
import { z } from "zod";

import { actionRateLimit } from "@/common/auth/rate-limit";
import { assertAuth } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";

export async function getCartAction() {
  const user = await assertAuth();
  return getCart(user.id);
}

export async function addToCartAction(productId: string, variantId?: string | null, quantity = 1) {
  const user = await assertAuth();

  await actionRateLimit.check(100, `addToCart:${user.id}`);

  if (!z.uuid().safeParse(productId).success) {
    throw new Error("Invalid product ID");
  }
  if (variantId && !z.string().uuid().safeParse(variantId).success) {
    throw new Error("Invalid variant ID");
  }
  if (quantity < 1 || quantity > 99) {
    throw new Error("Invalid quantity");
  }

  const result = await addToCart(user.id, productId, variantId, quantity);
  revalidateLocalizedPath("/cart");
  return result;
}

export async function updateCartItemAction(cartItemId: string, quantity: number) {
  const user = await assertAuth();

  await actionRateLimit.check(100, `updateCartItem:${user.id}`);

  if (!z.string().uuid().safeParse(cartItemId).success) {
    throw new Error("Invalid cart item ID");
  }

  const result = await updateCartItemQuantity(user.id, cartItemId, quantity);
  return result;
}

export async function removeCartItemAction(cartItemId: string) {
  const user = await assertAuth();

  await actionRateLimit.check(100, `removeCartItem:${user.id}`);

  if (!z.string().uuid().safeParse(cartItemId).success) {
    throw new Error("Invalid cart item ID");
  }

  await removeCartItem(user.id, cartItemId);
}

export async function clearCartAction() {
  const user = await assertAuth();

  await actionRateLimit.check(20, `clearCart:${user.id}`);

  await clearCart(user.id);
  revalidateLocalizedPath("/cart");
}
