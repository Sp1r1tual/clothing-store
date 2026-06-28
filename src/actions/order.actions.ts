"use server";

import { clearCart, getCart } from "@/db/cart";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrderContact,
} from "@/db/order";
import { prisma } from "@/libs/prisma";
import type { ShippingCarrier } from "@prisma/client";
import { z } from "zod";

import { actionRateLimit } from "@/common/auth/rate-limit";
import { assertAuth } from "@/common/auth/server";
import { revalidateLocalizedPath } from "@/common/utils/revalidate";
import { updateOrderContactSchema } from "@/common/validation/order/order.schema";

export async function getOrdersAction() {
  const user = await assertAuth();
  return getOrdersByUserId(user.id);
}

export async function getOrderAction(orderId: string) {
  const user = await assertAuth();

  if (!z.string().uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  return getOrderById(orderId, user.id);
}

export async function updateOrderContactAction(
  orderId: string,
  data: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    shippingAddress: string;
  },
) {
  const user = await assertAuth();

  await actionRateLimit.check(30, `updateOrderContact:${user.id}`);

  if (!z.uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  const resultParse = updateOrderContactSchema.safeParse(data);
  if (!resultParse.success) {
    throw new Error("Invalid contact data");
  }

  const result = await updateOrderContact(orderId, user.id, resultParse.data);
  revalidateLocalizedPath(`/profile/orders/${orderId}`);
  revalidateLocalizedPath("/profile");
  return result;
}

export async function cancelOrderAction(orderId: string) {
  const user = await assertAuth();

  await actionRateLimit.check(10, `cancelOrder:${user.id}`);

  if (!z.string().uuid().safeParse(orderId).success) {
    throw new Error("Invalid order ID");
  }

  const result = await cancelOrder(orderId, user.id);
  revalidateLocalizedPath(`/profile/orders/${orderId}`);
  revalidateLocalizedPath("/profile");
  return result;
}

export async function createOrderAction(): Promise<string> {
  const user = await assertAuth();

  await actionRateLimit.check(5, `createOrder:${user.id}`);

  const [cartItems, profile] = await Promise.all([
    getCart(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        addresses: {
          where: { isDefault: true },
          select: { carrier: true, city: true, warehouse: true },
          take: 1,
        },
      },
    }),
  ]);

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  if (!profile?.phone) {
    throw new Error("Phone number is required to place an order");
  }

  const address = profile.addresses[0];
  if (!address) {
    throw new Error("Shipping address is required to place an order");
  }

  const shippingAddress = `${address.city}, ${address.warehouse}`;

  const order = await createOrder({
    userId: user.id,
    contactName: profile?.name ?? profile?.email ?? "Customer",
    contactEmail: profile?.email ?? "",
    contactPhone: profile?.phone ?? "",
    carrier: address.carrier as ShippingCarrier,
    shippingAddress,
    items: cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productNameUk: item.product.nameUk,
      productNameEn: item.product.nameEn,
      productSize: item.variant?.size ?? null,
      productColor: item.variant?.colorUk ?? null,
      quantity: item.quantity,
    })),
  });

  await clearCart(user.id);

  revalidateLocalizedPath("/cart");
  revalidateLocalizedPath("/profile");

  return order.id;
}
