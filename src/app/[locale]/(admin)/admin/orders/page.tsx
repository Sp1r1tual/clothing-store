import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getAllOrdersAdmin } from "@/db/order";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { AdminOrdersTable } from "@/components/pages/admin/orders/OrdersTable/OrdersTable";

import styles from "./page.module.css";

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.orders" });
  return { title: t("metaTitle") };
}

export default async function AdminOrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.orders" });
  const orders = await getAllOrdersAdmin();

  return (
    <div className={styles.page}>
      <AdminPageHeader title={t("title")} subtitle={t("subtitle", { count: orders.length })} />
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
