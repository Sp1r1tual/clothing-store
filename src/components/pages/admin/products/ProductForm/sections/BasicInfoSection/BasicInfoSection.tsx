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
          label={t("labels.name")}
          placeholder={t("placeholders.name")}
          error={errors.name?.message}
          {...register("name")}
          onChange={onNameChange}
        />
        <AdminInput
          label={t("labels.slug")}
          placeholder={t("placeholders.slug")}
          error={errors.slug?.message}
          {...register("slug")}
        />
      </div>

      <AdminTextarea
        label={t("labels.description")}
        placeholder={t("placeholders.description")}
        error={errors.description?.message}
        rows={4}
        {...register("description")}
      />
    </section>
  );
};
