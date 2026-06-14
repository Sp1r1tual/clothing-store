"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { AdminTextarea } from "@/components/ui/admin/AdminTextarea/AdminTextarea";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./DetailsSection.module.css";

export const DetailsSection = () => {
  const t = useTranslations("Admin.products.form");
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("sections.details")}</h2>

      <div className={styles.grid2}>
        <AdminTextarea
          label={`${t("labels.composition")} (Укр)`}
          placeholder={t("placeholders.composition")}
          error={errors.compositionUk?.message}
          rows={3}
          {...register("compositionUk")}
        />
        <AdminTextarea
          label={`${t("labels.composition")} (Eng)`}
          placeholder={t("placeholders.composition")}
          error={errors.compositionEn?.message}
          rows={3}
          {...register("compositionEn")}
        />
      </div>

      <div className={styles.grid2}>
        <AdminTextarea
          label={`${t("labels.careInstructions")} (Укр)`}
          placeholder={t("placeholders.careInstructions")}
          error={errors.careInstructionsUk?.message}
          rows={3}
          {...register("careInstructionsUk")}
        />
        <AdminTextarea
          label={`${t("labels.careInstructions")} (Eng)`}
          placeholder={t("placeholders.careInstructions")}
          error={errors.careInstructionsEn?.message}
          rows={3}
          {...register("careInstructionsEn")}
        />
      </div>

      <div className={styles.grid2}>
        <AdminTextarea
          label={`${t("labels.measurements")} (Укр)`}
          placeholder={t("placeholders.measurements")}
          error={errors.measurementsUk?.message}
          rows={3}
          {...register("measurementsUk")}
        />
        <AdminTextarea
          label={`${t("labels.measurements")} (Eng)`}
          placeholder={t("placeholders.measurements")}
          error={errors.measurementsEn?.message}
          rows={3}
          {...register("measurementsEn")}
        />
      </div>
    </section>
  );
};
