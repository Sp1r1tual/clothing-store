import { prisma } from "@/libs/prisma";

export async function updateProfile(
  userId: string,
  data: {
    name: string;
    phone: string | null;
  },
) {
  return prisma.profile.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: {
      name: true,
      phone: true,
    },
  });
}

export async function upsertUserProfile(
  userId: string,
  data: {
    name: string;
    email?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
  },
) {
  return prisma.profile.upsert({
    where: { id: userId },
    create: {
      id: userId,
      name: data.name,
      email: data.email || null,
      avatarUrl: data.avatarUrl || null,
      phone: data.phone || null,
    },
    update: {
      email: data.email || null,
      avatarUrl: data.avatarUrl || null,
    },
    select: { id: true },
  });
}
