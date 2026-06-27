import { prisma } from "@/libs/prisma";

import {
  AdminOrderData,
  CreateOrderInput,
  OrderData,
  UpdateOrderContactData,
} from "@/types/order.types";

export * from "@/types/order.types";

const orderItemSelect = {
  id: true,
  productId: true,
  variantId: true,
  productNameUk: true,
  productNameEn: true,
  productSize: true,
  productColor: true,
  price: true,
  quantity: true,
  product: {
    select: {
      slug: true,
      images: {
        where: { isPrimary: true },
        select: { url: true, altText: true },
        take: 1,
      },
    },
  },
} as const;

const baseOrderSelect = {
  id: true,
  status: true,
  totalAmount: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  carrier: true,
  shippingAddress: true,
  trackingNumber: true,
  note: true,
  discountAmount: true,
  createdAt: true,
  updatedAt: true,
  items: { select: orderItemSelect },
} as const;

const adminOrderSelect = {
  ...baseOrderSelect,
  profileId: true,
  profile: {
    select: {
      name: true,
      email: true,
      phone: true,
    },
  },
} as const;

function mapOrder(order: {
  id: string;
  status: string;
  totalAmount: unknown;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  carrier: string;
  shippingAddress: string;
  trackingNumber: string | null;
  note: string | null;
  discountAmount: unknown;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string | null;
    variantId: string | null;
    productNameUk: string;
    productNameEn: string;
    productSize: string | null;
    productColor: string | null;
    price: unknown;
    quantity: number;
    product: { slug: string; images: { url: string; altText: string | null }[] } | null;
  }>;
}): OrderData {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    discountAmount: order.discountAmount ? Number(order.discountAmount) : null,
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

export async function getOrdersByProfileId(profileId: string): Promise<OrderData[]> {
  const orders = await prisma.order.findMany({
    where: { profileId },
    select: baseOrderSelect,
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapOrder);
}

export async function getOrderById(orderId: string, profileId: string): Promise<OrderData | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, profileId },
    select: baseOrderSelect,
  });

  if (!order) return null;
  return mapOrder(order);
}

export async function updateOrderContact(
  orderId: string,
  profileId: string,
  data: UpdateOrderContactData,
): Promise<OrderData> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, profileId },
    select: { status: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "PENDING" && order.status !== "PROCESSING") {
    throw new Error("Cannot edit order in current status");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      shippingAddress: data.shippingAddress,
    },
    select: baseOrderSelect,
  });

  return mapOrder(updated);
}

export async function cancelOrder(orderId: string, profileId: string): Promise<OrderData> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, profileId },
    select: { status: true, items: { select: { variantId: true, quantity: true } } },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "PENDING" && order.status !== "PROCESSING") {
    throw new Error("Cannot cancel order in current status");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const cancelled = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      select: baseOrderSelect,
    });

    for (const item of order.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return cancelled;
  });

  return mapOrder(updated);
}

export async function getAllOrdersAdmin(): Promise<AdminOrderData[]> {
  const orders = await prisma.order.findMany({
    select: adminOrderSelect,
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    ...mapOrder(o),
    profileId: o.profileId,
    profile: o.profile,
  }));
}

export async function getOrderByIdAdmin(orderId: string): Promise<AdminOrderData | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    select: adminOrderSelect,
  });

  if (!order) return null;

  return {
    ...mapOrder(order),
    profileId: order.profileId,
    profile: order.profile,
  };
}
export async function updateOrderStatusAdmin(
  orderId: string,
  status: string,
  trackingNumber?: string | null,
): Promise<AdminOrderData> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, items: { select: { variantId: true, quantity: true } } },
  });

  if (!order) throw new Error("Order not found");

  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: status as import("@prisma/client").OrderStatus,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
      select: adminOrderSelect,
    });

    if (order.status !== "CANCELLED" && status === "CANCELLED") {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    } else if (order.status === "CANCELLED" && status !== "CANCELLED") {
      // If it was cancelled (stock returned) and now it's un-cancelled, deduct stock again
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    return updatedOrder;
  });

  return {
    ...mapOrder(updated),
    profileId: updated.profileId,
    profile: updated.profile,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<OrderData> {
  const productIds = input.items
    .map((item) => item.productId)
    .filter((id): id is string => id !== null);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "PUBLISHED", deletedAt: null },
    select: { id: true, price: true, discountPrice: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let calculatedTotalAmount = 0;

  const validItems = input.items.map((item) => {
    if (!item.productId) {
      throw new Error("Product ID is required for all items");
    }

    const dbProduct = productMap.get(item.productId);
    if (!dbProduct) {
      throw new Error(`Product with id ${item.productId} not found`);
    }

    const actualPrice =
      dbProduct.discountPrice !== null ? Number(dbProduct.discountPrice) : Number(dbProduct.price);
    calculatedTotalAmount += actualPrice * item.quantity;

    return {
      productId: item.productId,
      variantId: item.variantId,
      productNameUk: item.productNameUk,
      productNameEn: item.productNameEn,
      productSize: item.productSize,
      productColor: item.productColor,
      price: actualPrice,
      quantity: item.quantity,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    for (const item of validItems) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true },
        });

        if (!variant) throw new Error(`Variant not found for item ${item.productNameEn}`);
        if (variant.stock < item.quantity) {
          throw new Error(`Not enough stock for ${item.productNameEn} (Size: ${item.productSize})`);
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    const created = await tx.order.create({
      data: {
        profileId: input.profileId,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        carrier: input.carrier,
        shippingAddress: input.shippingAddress,
        totalAmount: calculatedTotalAmount,
        items: {
          create: validItems,
        },
      },
      select: baseOrderSelect,
    });

    return created;
  });

  return mapOrder(order);
}
