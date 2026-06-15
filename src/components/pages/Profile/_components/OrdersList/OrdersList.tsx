"use client";

import { useLocale, useTranslations } from "next-intl";

import type { OrderData } from "@/db/order";
import { Link } from "@/i18n/navigation";

import { formatDate, formatPrice } from "@/common/utils/format";

import styles from "./OrdersList.module.css";

interface OrdersListProps {
  orders: OrderData[];
}

const STATUS_CLASS: Record<string, string> = {
  PENDING: styles.pending,
  PROCESSING: styles.processing,
  SHIPPED: styles.shipped,
  DELIVERED: styles.delivered,
  CANCELLED: styles.cancelled,
  REFUNDED: styles.refunded,
};

export const OrdersList = ({ orders }: OrdersListProps) => {
  const t = useTranslations("Profile");
  const locale = useLocale();

  return (
    <div className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>{t("recentOrders")}</h2>
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Link key={order.id} href={`/profile/orders/${order.id}`} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                <span className={styles.orderDate}>{formatDate(order.createdAt, locale)}</span>
                <span className={styles.orderItemsCount}>
                  {order.items.length}{" "}
                  {order.items.length === 1 ? t("orders.itemSingular") : t("orders.itemPlural")}
                </span>
              </div>
              <div className={styles.orderMeta}>
                <span className={styles.orderTotal}>{formatPrice(order.totalAmount, locale)}</span>
                <span className={`${styles.statusBadge} ${STATUS_CLASS[order.status] ?? ""}`}>
                  {t(`orders.statuses.${order.status}`)}
                </span>
                <span className={styles.arrowIcon}>→</span>
              </div>
            </Link>
          ))
        ) : (
          <p className={styles.noOrders}>{t("noOrders")}</p>
        )}
      </div>
    </div>
  );
};
