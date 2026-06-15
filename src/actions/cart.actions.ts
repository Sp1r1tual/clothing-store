"use server";

import { addToCart, clearCart, getCart, removeCartItem, updateCartItemQuantity } from "@/db/cart";
import { z } from "zod";

import { assertAuth } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";

export async function getCartAction() {
  const user = await assertAuth();
  return getCart(user.id);
}

export async function addToCartAction(productId: string, variantId?: string | null, quantity = 1) {
  const user = await assertAuth();

  if (!z.uuid().safeParse(productId).success) {
    throw new Error("Invalid product ID");
  }
  if (variantId && !z.uuid().safeParse(variantId).success) {
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
  await assertAuth();

  if (!z.uuid().safeParse(cartItemId).success) {
    throw new Error("Invalid cart item ID");
  }

  const result = await updateCartItemQuantity(cartItemId, quantity);
  revalidateLocalizedPath("/cart");
  return result;
}

export async function removeCartItemAction(cartItemId: string) {
  await assertAuth();

  if (!z.uuid().safeParse(cartItemId).success) {
    throw new Error("Invalid cart item ID");
  }

  await removeCartItem(cartItemId);
  revalidateLocalizedPath("/cart");
}

export async function clearCartAction() {
  const user = await assertAuth();
  await clearCart(user.id);
  revalidateLocalizedPath("/cart");
}
