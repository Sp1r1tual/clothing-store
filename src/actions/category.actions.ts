"use server";

import {
  deleteCategory as deleteCategoryDb,
  insertCategory,
  updateCategory as updateCategoryDb,
} from "@/db/category";
import { z } from "zod";

import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";
import { type CategoryFormData } from "@/common/validation/category/category.schema";
import { getCategorySchema } from "@/common/validation/category/category.schema.server";

export async function createCategory(data: CategoryFormData, locale: string) {
  await assertAdmin();

  const schema = await getCategorySchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const category = await insertCategory(result.data);

  revalidateLocalizedPath("/admin/categories");
  return category;
}

export async function updateCategory(id: string, data: CategoryFormData, locale: string) {
  await assertAdmin();

  if (!z.uuid().safeParse(id).success) {
    throw new Error("Invalid category ID");
  }

  const schema = await getCategorySchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  try {
    const category = await updateCategoryDb(id, result.data);
    revalidateLocalizedPath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw new Error("Failed to update category due to an internal error");
  }
}

export async function deleteCategory(id: string) {
  await assertAdmin();

  if (!z.uuid().safeParse(id).success) {
    throw new Error("Invalid category ID");
  }

  try {
    await deleteCategoryDb(id);
    revalidateLocalizedPath("/admin/categories");
  } catch (error) {
    console.error("Failed to delete category:", error);
    if (error instanceof Error) {
      if (error.message === "CANNOT_DELETE_BASE_CATEGORY") {
        throw new Error(
          "Cannot delete built-in categories (men, women, unisex, accessories, men-shoes, women-shoes, unisex-shoes, men-outerwear, women-outerwear, unisex-outerwear, men-pants, women-pants, unisex-pants).",
        );
      }
      if (error.message === "HAS_CHILDREN") {
        throw new Error("Cannot delete a category that has subcategories.");
      }
      if (error.message === "HAS_PRODUCTS") {
        throw new Error("Cannot delete a category that has products.");
      }
    }
    throw new Error("Failed to delete category due to an internal error");
  }
}
