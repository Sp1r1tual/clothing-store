import { prisma } from "@/libs/prisma";
import type { ShippingCarrier } from "@prisma/client";

export type AddressData = {
  carrier: ShippingCarrier;
  city: string;
  street: string | null;
  warehouse: string;
};

export async function getDefaultAddress(profileId: string): Promise<AddressData | null> {
  const addr = await prisma.address.findFirst({
    where: { profileId, isDefault: true },
    select: {
      carrier: true,
      city: true,
      street: true,
      warehouse: true,
    },
  });
  return addr as AddressData | null;
}

export async function upsertDefaultAddress(
  profileId: string,
  data: AddressData,
): Promise<AddressData> {
  const existing = await prisma.address.findFirst({
    where: { profileId, isDefault: true },
  });

  if (existing) {
    return prisma.address.update({
      where: { id: existing.id },
      data,
      select: { carrier: true, city: true, street: true, warehouse: true },
    }) as Promise<AddressData>;
  }

  return prisma.address.create({
    data: { ...data, profileId, isDefault: true },
    select: { carrier: true, city: true, street: true, warehouse: true },
  }) as Promise<AddressData>;
}

export async function deleteDefaultAddress(profileId: string): Promise<void> {
  await prisma.address.deleteMany({
    where: { profileId, isDefault: true },
  });
}
