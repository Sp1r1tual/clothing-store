"use server";

import { prisma } from "@/libs/prisma";

import {
  type ProfileFormData,
  profileSchema,
} from "@/common/validation/profile/schemas/profile.schema";

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

export async function updateProfileAction(userId: string, data: ProfileFormData) {
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { name, phone } = result.data;

  return prisma.profile.update({
    where: { id: userId },
    data: {
      name,
      phone: phone || null,
    },
    select: {
      name: true,
      phone: true,
    },
  });
}

export async function syncUserProfileAction(
  userId: string,
  data: { name: string; email?: string | null; avatarUrl?: string | null; phone?: string | null },
) {
  const { upsertUserProfile } = await import("@/db/profile.db");
  return upsertUserProfile(userId, data);
}
