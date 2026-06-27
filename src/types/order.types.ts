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
    quantity: number;
  }>;
};

type OrderItemData = {
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

export type UpdateOrderContactData = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: string;
};

export type AdminOrderData = OrderData & {
  profileId: string;
  profile: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};
