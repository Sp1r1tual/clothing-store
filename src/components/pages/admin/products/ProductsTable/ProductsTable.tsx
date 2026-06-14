"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

import { deleteProduct } from "@/actions/product.actions";
import { useRouter } from "@/i18n/navigation";
import { Pencil, Trash2 } from "lucide-react";

import styles from "./ProductsTable.module.css";

type Product = {
  id: string;
  nameUk: string;
  nameEn: string;
  slug: string;
  // price may come as Decimal-like or string from Prisma – normalize before rendering
  price: number | string | { toString(): string };
  discountPrice: number | string | { toString(): string } | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  createdAt: Date;
  category: { nameUk: string; nameEn: string };
  images: { url: string }[];
};

interface ProductsTableProps {
  products: Product[];
}

const STATUS_LABELS: Record<
  string,
  { labelKey: "status.DRAFT" | "status.PUBLISHED" | "status.ARCHIVED"; className: string }
> = {
  DRAFT: { labelKey: "status.DRAFT", className: "statusDraft" },
  PUBLISHED: { labelKey: "status.PUBLISHED", className: "statusPublished" },
  ARCHIVED: { labelKey: "status.ARCHIVED", className: "statusArchived" },
};

export const ProductsTable = ({ products }: ProductsTableProps) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Admin.products.table");
  const locale = useLocale();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("deleteConfirm", { name }))) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      router.refresh();
      toast.success(t("deleteSuccess"));
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setDeleting(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>{t("th.product")}</th>
            <th className={styles.th}>{t("th.category")}</th>
            <th className={styles.th}>{t("th.price")}</th>
            <th className={styles.th}>{t("th.status")}</th>
            <th className={styles.th}>{t("th.date")}</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = STATUS_LABELS[product.status] ?? STATUS_LABELS.DRAFT;
            const imgUrl = product.images[0]?.url;
            return (
              <tr key={product.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.productCell}>
                    <div className={styles.productThumb}>
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={locale === "uk" ? product.nameUk : product.nameEn}
                          width={64}
                          height={64}
                          className={styles.thumbImg}
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder} />
                      )}
                    </div>
                    <div>
                      <p className={styles.productName}>
                        {locale === "uk" ? product.nameUk : product.nameEn}
                      </p>
                      <p className={styles.productSlug}>{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>
                  {locale === "uk" ? product.category.nameUk : product.category.nameEn}
                </td>
                <td className={styles.td}>
                  <span className={styles.price}>
                    {(() => {
                      const p =
                        typeof product.price === "number" ? product.price : Number(product.price);
                      return isNaN(p)
                        ? "-"
                        : Math.round(p).toLocaleString(locale === "uk" ? "uk-UA" : "en-US");
                    })()}{" "}
                    ₴
                  </span>
                  {product.discountPrice != null && (
                    <span className={styles.discountPrice}>
                      {(() => {
                        const d =
                          typeof product.discountPrice === "number"
                            ? product.discountPrice
                            : Number(product.discountPrice);
                        return isNaN(d)
                          ? "-"
                          : Math.round(d).toLocaleString(locale === "uk" ? "uk-UA" : "en-US");
                      })()}{" "}
                      ₴
                    </span>
                  )}
                </td>
                <td className={styles.td}>
                  <span className={`${styles.statusBadge} ${styles[status.className]}`}>
                    {t(status.labelKey)}
                  </span>
                </td>
                <td className={styles.td}>
                  {new Date(product.createdAt).toLocaleDateString(
                    locale === "uk" ? "uk-UA" : "en-US",
                  )}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title={t("actions.edit")} disabled>
                      <Pencil size={15} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      title={t("actions.delete")}
                      onClick={() =>
                        handleDelete(product.id, locale === "uk" ? product.nameUk : product.nameEn)
                      }
                      disabled={deleting === product.id}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
