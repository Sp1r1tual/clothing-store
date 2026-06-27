"use server";

import { updateOrderStatusAdmin } from "@/db/order";
import { z } from "zod";

import { actionRateLimit } from "@/common/auth/rate-limit";
import { assertAdmin } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";

export async function updateAdminOrderStatusAction(
  orderId: string,
  status: string,
  trackingNumber?: string | null,
) {
  const admin = await assertAdmin();

  await actionRateLimit.check(120, `adminOrderAction:${admin.id}`);

  if (!z.string().uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  if (trackingNumber && !z.string().max(255).safeParse(trackingNumber).success) {
    throw new Error("Invalid tracking number");
  }

  const result = await updateOrderStatusAdmin(orderId, status, trackingNumber);

  revalidateLocalizedPath(`/admin/orders/${orderId}`);
  revalidateLocalizedPath("/admin/orders");
  revalidateLocalizedPath(`/profile/orders/${orderId}`);
  revalidateLocalizedPath("/profile");

  return result;
}
