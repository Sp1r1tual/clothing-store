"use server";

import {
  addFavorite,
  getFavoriteIds,
  getFavorites,
  isFavorited,
  removeFavorite,
} from "@/db/favorites";
import { z } from "zod";

import { assertAuth } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";

export async function getFavoritesAction() {
  const user = await assertAuth();
  return getFavorites(user.id);
}

export async function getFavoriteIdsAction(): Promise<string[]> {
  const user = await assertAuth();
  return getFavoriteIds(user.id);
}

export async function toggleFavoriteAction(productId: string): Promise<{ isFavorited: boolean }> {
  const user = await assertAuth();

  if (!z.uuid().safeParse(productId).success) {
    throw new Error("Invalid product ID");
  }

  const favorited = await isFavorited(user.id, productId);

  if (favorited) {
    await removeFavorite(user.id, productId);
  } else {
    await addFavorite(user.id, productId);
  }

  revalidateLocalizedPath("/favorites");

  return { isFavorited: !favorited };
}
