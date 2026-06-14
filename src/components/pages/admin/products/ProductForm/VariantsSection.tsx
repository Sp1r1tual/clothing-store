"use client";

import { useTranslations } from "next-intl";
import {
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormRegister,
} from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./VariantsSection.module.css";

interface VariantsSectionProps {
  variantFields: FieldArrayWithId<ProductFormData, "variants", "id">[];
  appendVariant: UseFieldArrayAppend<ProductFormData, "variants">;
  removeVariant: UseFieldArrayRemove;
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const VariantsSection = ({
  variantFields,
  appendVariant,
  removeVariant,
  register,
  errors,
}: VariantsSectionProps) => {
  const t = useTranslations("Admin.products.form");

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t("sections.variants")}</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => appendVariant({ size: "", color: "", stock: 0, sku: "" })}
        >
          <Plus size={15} /> {t("buttons.addVariant")}
        </button>
      </div>

      {variantFields.length === 0 && <p className={styles.emptyHint}>{t("hints.emptyVariants")}</p>}

      <div className={styles.variantList}>
        {variantFields.map((field, index) => (
          <div key={field.id} className={styles.variantRow}>
            <div className={styles.variantGrid}>
              <AdminInput
                label={t("labels.variantSize")}
                placeholder={t("placeholders.variantSize")}
                error={errors.variants?.[index]?.size?.message}
                {...register(`variants.${index}.size`)}
              />
              <AdminInput
                label={t("labels.variantColor")}
                placeholder={t("placeholders.variantColor")}
                error={errors.variants?.[index]?.color?.message}
                {...register(`variants.${index}.color`)}
              />
              <AdminInput
                type="number"
                min="0"
                label={t("labels.variantStock")}
                placeholder={t("placeholders.variantStock")}
                error={errors.variants?.[index]?.stock?.message}
                {...register(`variants.${index}.stock`, { valueAsNumber: true })}
              />
              <AdminInput
                label={t("labels.variantSku")}
                placeholder={t("placeholders.variantSku")}
                error={errors.variants?.[index]?.sku?.message}
                {...register(`variants.${index}.sku`)}
              />
            </div>
            <button type="button" className={styles.removeBtn} onClick={() => removeVariant(index)}>
              <Trash2 size={14} /> {t("buttons.delete")}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
