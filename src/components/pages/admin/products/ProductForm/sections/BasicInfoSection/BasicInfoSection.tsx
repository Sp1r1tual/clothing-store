"use client";

import { useTranslations } from "next-intl";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";
import { AdminTextarea } from "@/components/ui/admin/AdminTextarea/AdminTextarea";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./BasicInfoSection.module.css";

interface BasicInfoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoSection = ({ register, errors, onNameChange }: BasicInfoSectionProps) => {
  const t = useTranslations("Admin.products.form");

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("sections.basic")}</h2>

      <div className={styles.grid2}>
        <AdminInput
          label={`${t("labels.name")} (Укр)`}
          placeholder={t("placeholders.name")}
          error={errors.nameUk?.message}
          {...register("nameUk")}
          onChange={onNameChange}
        />
        <AdminInput
          label={`${t("labels.name")} (Eng)`}
          placeholder={t("placeholders.name")}
          error={errors.nameEn?.message}
          {...register("nameEn")}
        />
        <AdminInput
          label={t("labels.slug")}
          placeholder={t("placeholders.slug")}
          error={errors.slug?.message}
          {...register("slug")}
        />
      </div>

      <div className={styles.grid2}>
        <AdminTextarea
          label={`${t("labels.description")} (Укр)`}
          placeholder={t("placeholders.description")}
          error={errors.descriptionUk?.message}
          rows={4}
          {...register("descriptionUk")}
        />
        <AdminTextarea
          label={`${t("labels.description")} (Eng)`}
          placeholder={t("placeholders.description")}
          error={errors.descriptionEn?.message}
          rows={4}
          {...register("descriptionEn")}
        />
      </div>
    </section>
  );
};
