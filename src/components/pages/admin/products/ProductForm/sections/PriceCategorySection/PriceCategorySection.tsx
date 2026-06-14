"use client";

import { useLocale, useTranslations } from "next-intl";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AdminCheckbox } from "@/components/ui/admin/AdminCheckbox/AdminCheckbox";
import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";
import { AdminSelect } from "@/components/ui/admin/AdminSelect/AdminSelect";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./PriceCategorySection.module.css";

type Category = { id: string; name: string; parentId: string | null };

interface PriceCategorySectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  categories: Category[];
}

export const PriceCategorySection = ({
  register,
  errors,
  categories,
}: PriceCategorySectionProps) => {
  const t = useTranslations("Admin.products.form");
  const locale = useLocale();

  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("sections.priceCategory")}</h2>

      <div className={styles.grid3}>
        <AdminInput
          type="number"
          step="0.01"
          min="0"
          label={t("labels.price")}
          placeholder={t("placeholders.price")}
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />

        <AdminInput
          type="number"
          step="0.01"
          min="0"
          label={t("labels.discountPrice")}
          placeholder={t("placeholders.discountPrice")}
          error={errors.discountPrice?.message}
          {...register("discountPrice", { valueAsNumber: true })}
        />

        <AdminSelect
          label={t("labels.category")}
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          <option value="">{t("placeholders.selectCategory")}</option>
          {parentCategories.map((cat) => (
            <optgroup key={cat.id} label={cat.name}>
              {childCategories
                .filter((c) => c.parentId === cat.id)
                .map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              <option value={cat.id}>
                {cat.name} ({locale === "uk" ? "загальна" : "general"})
              </option>
            </optgroup>
          ))}
        </AdminSelect>
      </div>

      <div className={styles.grid2}>
        <AdminSelect label={t("labels.status")} {...register("status")}>
          <option value="DRAFT">{t("status.DRAFT")}</option>
          <option value="PUBLISHED">{t("status.PUBLISHED")}</option>
          <option value="ARCHIVED">{t("status.ARCHIVED")}</option>
        </AdminSelect>

        <AdminCheckbox label={t("labels.isFeatured")} {...register("isFeatured")} />
      </div>
    </section>
  );
};
