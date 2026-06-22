import { prisma } from "@/libs/prisma";
import type { ShippingCarrier } from "@prisma/client";

export type CreateOrderInput = {
  profileId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  carrier: ShippingCarrier;
  shippingAddress: string;
  items: Array<{
    productId: string | null;
    variantId: string | null;
    productNameUk: string;
    productNameEn: string;
    productSize: string | null;
    productColor: string | null;
    price: number;
    quantity: number;
  }>;
};

export type OrderItemData = {
  id: string;
  productId: string | null;
  variantId: string | null;
  productNameUk: string;
  productNameEn: string;
  productSize: string | null;
  productColor: string | null;
  price: number;
  quantity: number;
  product: {
    slug: string;
    images: { url: string; altText: string | null }[];
  } | null;
};

export type OrderData = {
  id: string;
  status: string;
  totalAmount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  carrier: string;
  shippingAddress: string;
  trackingNumber: string | null;
  note: string | null;
  discountAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemData[];
};

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
    select: {
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
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapOrder);
}

export async function getOrderById(orderId: string, profileId: string): Promise<OrderData | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, profileId },
    select: {
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
    },
  });

  if (!order) return null;
  return mapOrder(order);
}

export type UpdateOrderContactData = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: string;
};

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
    select: {
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
    },
  });

  return mapOrder(updated);
}

export async function cancelOrder(orderId: string, profileId: string): Promise<OrderData> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, profileId },
    select: { status: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "PENDING" && order.status !== "PROCESSING") {
    throw new Error("Cannot cancel order in current status");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
    select: {
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
    },
  });

  return mapOrder(updated);
}

export type AdminOrderData = OrderData & {
  profileId: string;
  profile: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};

export async function getAllOrdersAdmin(): Promise<AdminOrderData[]> {
  const orders = await prisma.order.findMany({
    select: {
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
      profileId: true,
      profile: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      items: { select: orderItemSelect },
    },
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
    select: {
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
      profileId: true,
      profile: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      items: { select: orderItemSelect },
    },
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
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as import("@prisma/client").OrderStatus,
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
    },
    select: {
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
      profileId: true,
      profile: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      items: { select: orderItemSelect },
    },
  });

  return {
    ...mapOrder(updated),
    profileId: updated.profileId,
    profile: updated.profile,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<OrderData> {
  const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        profileId: input.profileId,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        carrier: input.carrier,
        shippingAddress: input.shippingAddress,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productNameUk: item.productNameUk,
            productNameEn: item.productNameEn,
            productSize: item.productSize,
            productColor: item.productColor,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      select: {
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
      },
    });

    return created;
  });

  return mapOrder(order);
}
