"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { AdminOrderData } from "@/db/order";
import { Link } from "@/i18n/navigation";
import { Eye } from "lucide-react";

import styles from "./OrdersTable.module.css";

type Props = {
  orders: AdminOrderData[];
};

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_STYLE: Record<string, string> = {
  PENDING: "statusPending",
  PROCESSING: "statusProcessing",
  SHIPPED: "statusShipped",
  DELIVERED: "statusDelivered",
  CANCELLED: "statusCancelled",
  REFUNDED: "statusRefunded",
};

export const AdminOrdersTable = ({ orders }: Props) => {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered =
    statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${statusFilter === "ALL" ? styles.filterBtnActive : ""}`}
          onClick={() => setStatusFilter("ALL")}
        >
          {t("filterAll")}
          <span className={styles.filterCount}>{orders.length}</span>
        </button>
        {ORDER_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              <span
                className={`${styles.statusDot} ${styles[STATUS_STYLE[s] ?? "statusPending"]}`}
              />
              {t(`statuses.${s}` as Parameters<typeof t>[0])}
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.tableWrapper}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("empty")}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>{t("table.th.order")}</th>
                <th className={styles.th}>{t("table.th.customer")}</th>
                <th className={styles.th}>{t("table.th.total")}</th>
                <th className={styles.th}>{t("table.th.status")}</th>
                <th className={styles.th}>{t("table.th.date")}</th>
                <th className={styles.th}>{t("table.th.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const styleKey = STATUS_STYLE[order.status] ?? "statusPending";
                return (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.customerCell}>
                        <span className={styles.customerName}>{order.contactName}</span>
                        <span className={styles.customerEmail}>{order.contactEmail}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.total}>
                        {order.totalAmount.toLocaleString(locale === "uk" ? "uk-UA" : "en-US")} ₴
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${styles[styleKey]}`}>
                        {t(`statuses.${order.status}` as Parameters<typeof t>[0])}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.date}>
                        {new Date(order.createdAt).toLocaleDateString(
                          locale === "uk" ? "uk-UA" : "en-US",
                        )}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className={styles.actionBtn}
                          title="View order"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
