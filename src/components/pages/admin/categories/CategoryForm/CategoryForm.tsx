"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createCategory, updateCategory } from "@/actions/category.actions";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";
import { AdminSelect } from "@/components/ui/admin/AdminSelect/AdminSelect";
import { AdminTextarea } from "@/components/ui/admin/AdminTextarea/AdminTextarea";

import { toSlug } from "@/common/utils/slug";
import {
  type CategoryFormData,
  createCategorySchema,
} from "@/common/validation/category/category.schema";

import styles from "./CategoryForm.module.css";

type ParentCategory = { id: string; nameUk: string; nameEn: string; parentId: string | null };

interface CategoryFormProps {
  categories: ParentCategory[];
  /** When provided, the form is in edit mode */
  editId?: string;
  defaultValues?: Partial<CategoryFormData>;
}

export const CategoryForm = ({ categories, editId, defaultValues }: CategoryFormProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.categories.form");

  const schema = useMemo(
    () =>
      createCategorySchema({
        nameRequired: t("validation.nameRequired"),
        nameMax: t("validation.nameMax"),
        slugRequired: t("validation.slugRequired"),
        slugRegex: t("validation.slugRegex"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema) as Resolver<CategoryFormData>,
    defaultValues: {
      nameUk: "",
      nameEn: "",
      slug: "",
      parentId: null,
      order: 0,
      seoTitleUk: "",
      seoTitleEn: "",
      seoDescriptionUk: "",
      seoDescriptionEn: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editId) {
        await updateCategory(editId, data, locale);
        toast.success(t("messages.updateSuccess"));
      } else {
        await createCategory(data, locale);
        toast.success(t("messages.createSuccess"));
      }
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("messages.error"));
    }
  };

  const handleNameUkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("nameUk", value);
    if (!editId) {
      setValue("slug", toSlug(value));
    }
  };

  // Filter out current category from parent options (avoid self-reference)
  const parentOptions = categories.filter((c) => c.id !== editId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Basic info */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("sections.basic")}</h2>
        <div className={styles.grid2}>
          <AdminInput
            id="cat-name-uk"
            label={`${t("labels.name")} (Укр)`}
            placeholder={t("placeholders.name")}
            error={errors.nameUk?.message}
            {...register("nameUk")}
            onChange={handleNameUkChange}
          />
          <AdminInput
            id="cat-name-en"
            label={`${t("labels.name")} (Eng)`}
            placeholder={t("placeholders.name")}
            error={errors.nameEn?.message}
            {...register("nameEn")}
          />
          <AdminInput
            id="cat-slug"
            label={t("labels.slug")}
            placeholder={t("placeholders.slug")}
            error={errors.slug?.message}
            {...register("slug")}
          />
        </div>

        <div className={styles.grid2}>
          <AdminSelect
            id="cat-parent"
            label={t("labels.parent")}
            error={errors.parentId?.message}
            {...register("parentId")}
          >
            <option value="">{t("placeholders.noParent")}</option>
            {parentOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {locale === "uk" ? cat.nameUk : cat.nameEn}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            id="cat-order"
            label={t("labels.order")}
            type="number"
            min={0}
            placeholder="0"
            error={errors.order?.message}
            {...register("order")}
          />
        </div>
      </section>

      {/* SEO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("sections.seo")}</h2>
        <div className={styles.grid2}>
          <AdminInput
            id="cat-seo-title-uk"
            label={`${t("labels.seoTitle")} (Укр)`}
            placeholder={t("placeholders.seoTitle")}
            error={errors.seoTitleUk?.message}
            {...register("seoTitleUk")}
          />
          <AdminInput
            id="cat-seo-title-en"
            label={`${t("labels.seoTitle")} (Eng)`}
            placeholder={t("placeholders.seoTitle")}
            error={errors.seoTitleEn?.message}
            {...register("seoTitleEn")}
          />
          <AdminTextarea
            id="cat-seo-description-uk"
            label={`${t("labels.seoDescription")} (Укр)`}
            placeholder={t("placeholders.seoDescription")}
            rows={3}
            error={errors.seoDescriptionUk?.message}
            {...register("seoDescriptionUk")}
          />
          <AdminTextarea
            id="cat-seo-description-en"
            label={`${t("labels.seoDescription")} (Eng)`}
            placeholder={t("placeholders.seoDescription")}
            rows={3}
            error={errors.seoDescriptionEn?.message}
            {...register("seoDescriptionEn")}
          />
        </div>
      </section>

      {/* Actions */}
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
