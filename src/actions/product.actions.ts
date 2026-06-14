"use server";

import { getTranslations } from "next-intl/server";

import { insertProduct, softDeleteProduct } from "@/db/product";

import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";
import {
  type ProductFormData,
  createProductSchema,
} from "@/common/validation/product/product.schema";

async function getProductSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Admin.products.form" });

  return createProductSchema({
    imageUrlRequired: t("validation.imageUrlRequired"),
    variantSizeRequired: t("validation.variantSizeRequired"),
    variantStockMin: t("validation.variantStockMin"),
    productNameRequired: t("validation.productNameRequired"),
    productNameMax: t("validation.productNameMax"),
    productSlugRequired: t("validation.productSlugRequired"),
    productSlugRegex: t("validation.productSlugRegex"),
    productPriceRequired: t("validation.productPriceRequired"),
    productPricePositive: t("validation.productPricePositive"),
    productDiscountPricePositive: t("validation.productDiscountPricePositive"),
    productCategoryRequired: t("validation.productCategoryRequired"),
  });
}

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

export async function deleteProduct(id: string) {
  await assertAdmin();

  await softDeleteProduct(id);
  revalidateLocalizedPath("/admin/products");
}
