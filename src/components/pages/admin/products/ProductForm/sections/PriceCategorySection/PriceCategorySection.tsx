"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { AdminCheckbox } from "@/components/ui/admin/AdminCheckbox/AdminCheckbox";
import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";
import { AdminSelect } from "@/components/ui/admin/AdminSelect/AdminSelect";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./PriceCategorySection.module.css";

type Category = { id: string; nameUk: string; nameEn: string; parentId: string | null };

interface PriceCategorySectionProps {
  categories: Category[];
}

export const PriceCategorySection = ({ categories }: PriceCategorySectionProps) => {
  const t = useTranslations("Admin.products.form");
  const locale = useLocale();
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

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
          {(() => {
            type CategoryNode = Category & { children: CategoryNode[] };

            const categoryMap = new Map<string, CategoryNode>();
            categories.forEach((cat) => {
              categoryMap.set(cat.id, { ...cat, children: [] });
            });

            const roots: CategoryNode[] = [];
            categoryMap.forEach((node) => {
              if (node.parentId && categoryMap.has(node.parentId)) {
                categoryMap.get(node.parentId)!.children.push(node);
              } else {
                roots.push(node);
              }
            });

            const sortNodes = (nodes: CategoryNode[]) => {
              nodes.sort((a, b) => {
                const nameA = locale === "uk" ? a.nameUk : a.nameEn;
                const nameB = locale === "uk" ? b.nameUk : b.nameEn;
                return nameA.localeCompare(nameB);
              });
              nodes.forEach((node) => sortNodes(node.children));
            };
            sortNodes(roots);

            const renderOptions = (nodes: CategoryNode[], depth = 0): React.ReactNode[] => {
              return nodes.flatMap((node) => {
                const indent = "\u00A0\u00A0".repeat(depth);
                const prefix = depth > 0 ? "↳ " : "";
                const label = locale === "uk" ? node.nameUk : node.nameEn;

                const currentOption = (
                  <option key={node.id} value={node.id}>
                    {indent}
                    {prefix}
                    {label}
                  </option>
                );

                if (node.children.length > 0) {
                  return [currentOption, ...renderOptions(node.children, depth + 1)];
                }

                return [currentOption];
              });
            };

            return renderOptions(roots);
          })()}
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
