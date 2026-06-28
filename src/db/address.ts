import { prisma } from "@/libs/prisma";

import { AddressData } from "@/types/address.types";

export * from "@/types/address.types";

export async function getDefaultAddress(userId: string): Promise<AddressData | null> {
  const addr = await prisma.address.findFirst({
    where: { userId, isDefault: true },
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
  userId: string,
  data: AddressData,
): Promise<AddressData> {
  const existing = await prisma.address.findFirst({
    where: { userId, isDefault: true },
  });

  if (existing) {
    return prisma.address.update({
      where: { id: existing.id },
      data,
      select: { carrier: true, city: true, street: true, warehouse: true },
    }) as Promise<AddressData>;
  }

  return prisma.address.create({
    data: { ...data, userId, isDefault: true },
    select: { carrier: true, city: true, street: true, warehouse: true },
  }) as Promise<AddressData>;
}

export async function deleteDefaultAddress(userId: string): Promise<void> {
  await prisma.address.deleteMany({
    where: { userId, isDefault: true },
  });
}
