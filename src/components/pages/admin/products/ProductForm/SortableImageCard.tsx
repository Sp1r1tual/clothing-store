"use client";

import Image from "next/image";
import { memo } from "react";
import { type UseFormRegister } from "react-hook-form";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImageIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { AdminInput } from "@/components/ui/admin/AdminInput/AdminInput";

import { type ProductFormData } from "@/common/validation/product/product.schema";

import styles from "./SortableImageCard.module.css";

interface SortableImageCardProps {
  id: string;
  index: number;
  preview?: string;
  isPending?: boolean;
  isPrimary: boolean;
  errorAlt?: string;
  errorUrl?: string;
  t: (key: string) => string;
  register: UseFormRegister<ProductFormData>;
  onRemove: (index: number, id: string) => void;
}

export const SortableImageCard = memo(function SortableImageCard({
  id,
  index,
  preview,
  isPending,
  isPrimary,
  errorAlt,
  errorUrl,
  t,
  register,
  onRemove,
}: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.imageCard}>
      {}
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>

      {}
      {isPrimary && <span className={styles.primaryBadge}>{t("labels.cover")}</span>}

      {}
      <Button
        type="button"
        variant="danger"
        size="xs"
        isSquare
        absolute
        style={{ zIndex: 5 }}
        onClick={() => onRemove(index, id)}
        title={t("buttons.delete")}
      >
        <Trash2 size={14} />
      </Button>

      {}
      <div className={styles.thumbnail}>
        {preview ? (
          <Image
            src={preview}
            alt=""
            className={styles.thumbnailImg}
            draggable={false}
            fill
            unoptimized
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <ImageIcon size={24} className={styles.placeholderIcon} />
          </div>
        )}
      </div>

      {}
      <div className={styles.cardFields}>
        <div className={styles.altGroup}>
          <AdminInput
            label={t("labels.imageAlt")}
            placeholder={t("placeholders.imageAlt")}
            maxLength={125}
            error={errorAlt}
            {...register(`images.${index}.altText`)}
          />
        </div>
        {!preview && (
          <AdminInput
            label={t("labels.imageUrl")}
            placeholder={t("placeholders.imageUrl")}
            error={errorUrl}
            {...register(`images.${index}.url`)}
          />
        )}
        {isPending && <div className={styles.pendingBadge}>{t("hints.pendingUpload")}</div>}
      </div>

      {}
      <input type="hidden" {...register(`images.${index}.isPrimary`)} />
      <input type="hidden" {...register(`images.${index}.order`)} />
    </div>
  );
});
