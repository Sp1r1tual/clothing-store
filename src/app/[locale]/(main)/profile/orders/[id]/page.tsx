import { notFound } from "next/navigation";

import { getOrderAction } from "@/actions/order.actions";

import { OrderDetailPage } from "@/components/pages/OrderDetail/OrderDetailPage";

import { requireAuth } from "@/common/auth/server";

interface OrderDetailRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function OrderDetailRoute({ params }: OrderDetailRouteProps) {
  const { locale, id } = await params;
  await requireAuth(locale);

  const order = await getOrderAction(id).catch(() => null);

  if (!order) {
    notFound();
  }

  return <OrderDetailPage order={order} />;
}
