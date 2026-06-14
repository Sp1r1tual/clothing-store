"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

import { deleteCategory } from "@/actions/category.actions";
import { Link, useRouter } from "@/i18n/navigation";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";

import styles from "./CategoriesTable.module.css";

type Category = {
  id: string;
  nameUk: string;
  nameEn: string;
  slug: string;
  order: number;
  parentId: string | null;
  parent: { nameUk: string; nameEn: string } | null;
  _count: { products: number; children: number };
};

interface CategoriesTableProps {
  categories: Category[];
}

export const CategoriesTable = ({ categories }: CategoriesTableProps) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.categories.table");

  const handleDelete = async (
    id: string,
    name: string,
    childCount: number,
    productCount: number,
  ) => {
    if (childCount > 0) {
      toast.error(t("deleteHasChildren"));
      return;
    }
    if (productCount > 0) {
      toast.error(t("deleteHasProducts"));
      return;
    }
    if (!confirm(t("deleteConfirm", { name }))) return;

    setDeleting(id);
    try {
      await deleteCategory(id);
      router.refresh();
      toast.success(t("deleteSuccess"));
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setDeleting(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <FolderOpen size={40} strokeWidth={1.2} className={styles.emptyIcon} />
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>{t("th.name")}</th>
            <th className={styles.th}>{t("th.slug")}</th>
            <th className={styles.th}>{t("th.parent")}</th>
            <th className={styles.th}>{t("th.order")}</th>
            <th className={styles.th}>{t("th.products")}</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const hasChildren = cat._count.children > 0;
            const hasProducts = cat._count.products > 0;
            const canDelete = !hasChildren && !hasProducts;

            let deleteTitle = t("actions.delete");
            if (hasChildren) deleteTitle = t("deleteHasChildren");
            else if (hasProducts) deleteTitle = t("deleteHasProducts");

            const isBuiltIn = ["men", "women", "other"].includes(cat.slug);

            return (
              <tr key={cat.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.categoryName}>
                    {locale === "uk" ? cat.nameUk : cat.nameEn}
                  </span>
                </td>
                <td className={styles.td}>
                  <code className={styles.slug}>{cat.slug}</code>
                </td>
                <td className={styles.td}>
                  {cat.parent ? (
                    <span className={styles.parentBadge}>
                      {locale === "uk" ? cat.parent.nameUk : cat.parent.nameEn}
                    </span>
                  ) : (
                    <span className={styles.rootBadge}>{t("root")}</span>
                  )}
                </td>
                <td className={styles.td}>{cat.order}</td>
                <td className={styles.td}>
                  <span className={styles.countBadge}>{cat._count.products}</span>
                </td>
                <td className={styles.td}>
                  {!isBuiltIn && (
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className={styles.actionBtn}
                        title={t("actions.edit")}
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnDanger} ${!canDelete ? styles.actionBtnDisabled : ""}`}
                        title={deleteTitle}
                        onClick={() => {
                          const name = locale === "uk" ? cat.nameUk : cat.nameEn;
                          handleDelete(cat.id, name, cat._count.children, cat._count.products);
                        }}
                        disabled={deleting === cat.id}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
