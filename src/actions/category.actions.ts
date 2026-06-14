"use server";

import { getTranslations } from "next-intl/server";

import {
  deleteCategory as deleteCategoryDb,
  insertCategory,
  updateCategory as updateCategoryDb,
} from "@/db/category";

import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";
import {
  type CategoryFormData,
  createCategorySchema,
} from "@/common/validation/category/category.schema";

async function getCategorySchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Admin.categories.form" });

  return createCategorySchema({
    nameRequired: t("validation.nameRequired"),
    nameMax: t("validation.nameMax"),
    slugRequired: t("validation.slugRequired"),
    slugRegex: t("validation.slugRegex"),
  });
}

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

  const schema = await getCategorySchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const category = await updateCategoryDb(id, result.data);

  revalidateLocalizedPath("/admin/categories");
  return category;
}

export async function deleteCategory(id: string) {
  await assertAdmin();

  await deleteCategoryDb(id);
  revalidateLocalizedPath("/admin/categories");
}
