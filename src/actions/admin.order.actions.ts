"use server";

import { getAllOrdersAdmin, getOrderByIdAdmin, updateOrderStatusAdmin } from "@/db/order";
import { z } from "zod";

import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";

export async function getAdminOrdersAction() {
  await assertAdmin();
  return getAllOrdersAdmin();
}

export async function getAdminOrderAction(orderId: string) {
  await assertAdmin();

  if (!z.string().uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  return getOrderByIdAdmin(orderId);
}

export async function updateAdminOrderStatusAction(
  orderId: string,
  status: string,
  trackingNumber?: string | null,
) {
  await assertAdmin();

  if (!z.string().uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const result = await updateOrderStatusAdmin(orderId, status, trackingNumber);

  revalidateLocalizedPath(`/admin/orders/${orderId}`);
  revalidateLocalizedPath("/admin/orders");
  revalidateLocalizedPath(`/profile/orders/${orderId}`);
  revalidateLocalizedPath("/profile");

  return result;
}
