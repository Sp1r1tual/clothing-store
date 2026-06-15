"use server";

import { insertProduct, softDeleteProduct, updateProductInDb } from "@/db/product";
import { z } from "zod";

import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";
import { type ProductFormData } from "@/common/validation/product/product.schema";
import { getProductSchema } from "@/common/validation/product/product.schema.server";

export async function createProduct(data: ProductFormData, locale: string) {
  await assertAdmin();

  const schema = await getProductSchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const product = await insertProduct(result.data);

  revalidateLocalizedPath("/admin/products");
  return product;
}

export async function updateProduct(id: string, data: ProductFormData, locale: string) {
  await assertAdmin();

  if (!z.uuid().safeParse(id).success) {
    throw new Error("Invalid product ID");
  }

  const schema = await getProductSchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  try {
    const product = await updateProductInDb(id, result.data);
    revalidateLocalizedPath("/admin/products");
    revalidateLocalizedPath(`/admin/products/${id}`);
    return product;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product due to an internal error");
  }
}

export async function deleteProduct(id: string) {
  await assertAdmin();

  if (!z.uuid().safeParse(id).success) {
    throw new Error("Invalid product ID");
  }

  try {
    await softDeleteProduct(id);
    revalidateLocalizedPath("/admin/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product due to an internal error");
  }
}
