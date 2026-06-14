"use client";

import { useTranslations } from "next-intl";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AdminTextarea } from "@/components/ui/admin/AdminTextarea/AdminTextarea";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./DetailsSection.module.css";

interface DetailsSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const DetailsSection = ({ register, errors }: DetailsSectionProps) => {
  const t = useTranslations("Admin.products.form");

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("sections.details")}</h2>

      <div className={styles.grid2}>
        <AdminTextarea
          label={t("labels.composition")}
          placeholder={t("placeholders.composition")}
          error={errors.composition?.message}
          rows={3}
          {...register("composition")}
        />
        <AdminTextarea
          label={t("labels.careInstructions")}
          placeholder={t("placeholders.careInstructions")}
          error={errors.careInstructions?.message}
          rows={3}
          {...register("careInstructions")}
        />
      </div>

      <AdminTextarea
        label={t("labels.measurements")}
        placeholder={t("placeholders.measurements")}
        error={errors.measurements?.message}
        rows={3}
        {...register("measurements")}
      />
    </section>
  );
};
