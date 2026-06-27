import type { ShippingCarrier } from "@prisma/client";

export type AddressData = {
  carrier: ShippingCarrier;
  city: string;
  street: string | null;
  warehouse: string;
};
