import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getOrderByIdAdmin } from "@/db/order";

import { AdminPageHeader } from "@/components/pages/admin/AdminPageHeader/AdminPageHeader";
import { AdminOrderDetail } from "@/components/pages/admin/orders/OrderDetail/AdminOrderDetail";

import styles from "./page.module.css";

interface OrderDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.orders" });
  return { title: t("detailMetaTitle", { id: id.slice(0, 8).toUpperCase() }) };
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.orders" });

  const order = await getOrderByIdAdmin(id);
  if (!order) notFound();

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title={t("orderNumber", { id: id.slice(0, 8).toUpperCase() })}
        subtitle={order.contactName}
      />
      <AdminOrderDetail order={order} />
    </div>
  );
}
