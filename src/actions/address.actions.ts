"use server";

import { getDefaultAddress, upsertDefaultAddress } from "@/db/address";
import type { ShippingCarrier } from "@prisma/client";

import { assertAuth } from "@/common/auth/server";
import {
  type AddressFormData,
  addressSchema,
} from "@/common/validation/profile/schemas/address.schema";

export async function getAddressAction() {
  const user = await assertAuth();
  return getDefaultAddress(user.id);
}

export async function saveAddressAction(data: AddressFormData) {
  const user = await assertAuth();

  const result = addressSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { carrier, city, warehouse } = result.data;

  return upsertDefaultAddress(user.id, {
    carrier: carrier as ShippingCarrier,
    city,
    warehouse,
    street: null,
  });
}
