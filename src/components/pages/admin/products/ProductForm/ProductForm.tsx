"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { type Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createProduct } from "@/actions/product.actions";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImagesSection } from "./ImagesSection";
import { VariantsSection } from "./VariantsSection";
import { BasicInfoSection } from "./sections/BasicInfoSection/BasicInfoSection";
import { DetailsSection } from "./sections/DetailsSection/DetailsSection";
import { PriceCategorySection } from "./sections/PriceCategorySection/PriceCategorySection";
import { SeoSection } from "./sections/SeoSection/SeoSection";

import { toSlug } from "@/common/utils/slug";
import {
  type ProductFormData,
  createProductSchema,
} from "@/common/validation/product/product.schema";

import styles from "./ProductForm.module.css";

type Category = { id: string; name: string; parentId: string | null };

interface ProductFormProps {
  categories: Category[];
}

export const ProductForm = ({ categories }: ProductFormProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.products.form");

  const schema = useMemo(
    () =>
      createProductSchema({
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
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema) as Resolver<ProductFormData>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      composition: "",
      careInstructions: "",
      measurements: "",
      status: "DRAFT",
      categoryId: "",
      seoTitle: "",
      seoDescription: "",
      isFeatured: false,
      images: [],
      variants: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data, locale);
      toast.success(t("messages.success"));
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("messages.error"));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    setValue("slug", toSlug(value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <BasicInfoSection register={register} errors={errors} onNameChange={handleNameChange} />

      <PriceCategorySection register={register} errors={errors} categories={categories} />

      <DetailsSection register={register} errors={errors} />

      <ImagesSection
        imageFields={imageFields}
        appendImage={appendImage}
        removeImage={removeImage}
        register={register}
        errors={errors}
        setValue={setValue}
      />

      <VariantsSection
        variantFields={variantFields}
        appendVariant={appendVariant}
        removeVariant={removeVariant}
        register={register}
        errors={errors}
      />

      <SeoSection register={register} errors={errors} />

      <div className={styles.submitRow}>
        <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
          {t("buttons.cancel")}
        </button>
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? t("buttons.saving") : t("buttons.save")}
        </button>
      </div>
    </form>
  );
};
