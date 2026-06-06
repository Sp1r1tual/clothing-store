"use client";

import { useTranslations } from "next-intl";

import styles from "./OrdersList.module.css";

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
}

interface OrdersListProps {
  orders: Order[];
}

export const OrdersList = ({ orders }: OrdersListProps) => {
  const t = useTranslations("Profile");

  return (
    <div className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>{t("recentOrders")}</h2>
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>{order.id}</span>
                <span className={styles.orderDate}>{order.date}</span>
              </div>
              <div className={styles.orderMeta}>
                <span className={styles.orderTotal}>{order.total}</span>
                <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {order.status === "delivered" ? "Доставлено" : "В дорозі"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noOrders}>{t("noOrders")}</p>
        )}
      </div>
    </div>
  );
};
