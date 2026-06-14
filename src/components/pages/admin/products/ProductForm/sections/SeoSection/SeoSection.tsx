"use client";

import { useTranslations } from "next-intl";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./SeoSection.module.css";

interface SeoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const SeoSection = ({ register, errors }: SeoSectionProps) => {
  const t = useTranslations("Admin.products.form");

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("sections.seo")}</h2>

      <div className={styles.grid2}>
        <AdminInput
          label={`${t("labels.seoTitle")} (Укр)`}
          placeholder={t("placeholders.seoTitle")}
          error={errors.seoTitleUk?.message}
          {...register("seoTitleUk")}
        />
        <AdminInput
          label={`${t("labels.seoTitle")} (Eng)`}
          placeholder={t("placeholders.seoTitle")}
          error={errors.seoTitleEn?.message}
          {...register("seoTitleEn")}
        />
        <AdminInput
          label={`${t("labels.seoDescription")} (Укр)`}
          placeholder={t("placeholders.seoDescription")}
          error={errors.seoDescriptionUk?.message}
          {...register("seoDescriptionUk")}
        />
        <AdminInput
          label={`${t("labels.seoDescription")} (Eng)`}
          placeholder={t("placeholders.seoDescription")}
          error={errors.seoDescriptionEn?.message}
          {...register("seoDescriptionEn")}
        />
      </div>
    </section>
  );
};
