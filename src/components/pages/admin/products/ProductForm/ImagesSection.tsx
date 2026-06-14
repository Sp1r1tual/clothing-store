"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import {
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-toastify";

import { uploadProductImage } from "@/actions/upload.actions";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

import { AdminCheckbox } from "@/components/ui/admin/AdminCheckbox/AdminCheckbox";
import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./ImagesSection.module.css";

interface ImagesSectionProps {
  imageFields: FieldArrayWithId<ProductFormData, "images", "id">[];
  appendImage: UseFieldArrayAppend<ProductFormData, "images">;
  removeImage: UseFieldArrayRemove;
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export const ImagesSection = ({
  imageFields,
  appendImage,
  removeImage,
  register,
  errors,
  setValue,
}: ImagesSectionProps) => {
  const t = useTranslations("Admin.products.form");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append("file", file);

      const url = await uploadProductImage(formData);
      setValue(`images.${index}.url`, url, { shouldValidate: true });
      toast.success(t("messages.imageUploadSuccess", { fallback: "Image uploaded successfully" }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingIndex(null);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = "";
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t("sections.images")}</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() =>
            appendImage({
              url: "",
              altText: "",
              isPrimary: imageFields.length === 0,
              order: imageFields.length,
            })
          }
        >
          <Plus size={15} /> {t("buttons.addImage")}
        </button>
      </div>

      {imageFields.length === 0 && <p className={styles.emptyHint}>{t("hints.emptyImages")}</p>}

      <div className={styles.imageList}>
        {imageFields.map((field, index) => (
          <div key={field.id} className={styles.imageRow}>
            <div className={styles.imageRowMain}>
              <div className={styles.imageInputGroup}>
                <label className={styles.fieldLabel}>{t("labels.imageUrl")}</label>
                <div className={styles.urlUploadWrapper}>
                  <div className={styles.urlInput}>
                    <AdminInput
                      placeholder={t("placeholders.imageUrl")}
                      error={errors.images?.[index]?.url?.message}
                      {...register(`images.${index}.url`)}
                    />
                  </div>
                  <div className={styles.uploadButtonWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hiddenFileInput}
                      onChange={(e) => handleFileUpload(index, e)}
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      id={`image-upload-${index}`}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      className={`${styles.uploadBtn} ${uploadingIndex === index ? styles.uploading : ""}`}
                    >
                      {uploadingIndex === index ? (
                        <Loader2 size={18} className={styles.spinner} />
                      ) : (
                        <Upload size={18} />
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <AdminInput
                label={t("labels.imageAlt")}
                placeholder={t("placeholders.imageAlt")}
                {...register(`images.${index}.altText`)}
              />
            </div>

            <div className={styles.imageRowFooter}>
              <AdminCheckbox
                label={t("labels.isPrimaryImage")}
                {...register(`images.${index}.isPrimary`)}
              />
              <button type="button" className={styles.removeBtn} onClick={() => removeImage(index)}>
                <Trash2 size={14} /> {t("buttons.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
