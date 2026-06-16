"use client";

import { useTranslations } from "next-intl";
import {
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./VariantsSection.module.css";

interface VariantsSectionProps {
  variantFields: FieldArrayWithId<ProductFormData, "variants", "id">[];
  appendVariant: UseFieldArrayAppend<ProductFormData, "variants">;
  removeVariant: UseFieldArrayRemove;
}

export const VariantsSection = ({
  variantFields,
  appendVariant,
  removeVariant,
}: VariantsSectionProps) => {
  const t = useTranslations("Admin.products.form");
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t("sections.variants")}</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => appendVariant({ size: "", colorUk: "", colorEn: "", sku: "" })}
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
                label={t("labels.variantColorUk")}
                placeholder={t("placeholders.variantColorUk")}
                error={errors.variants?.[index]?.colorUk?.message}
                {...register(`variants.${index}.colorUk`)}
              />
              <AdminInput
                label={t("labels.variantColorEn")}
                placeholder={t("placeholders.variantColorEn")}
                error={errors.variants?.[index]?.colorEn?.message}
                {...register(`variants.${index}.colorEn`)}
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
