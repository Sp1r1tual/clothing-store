import { redirect } from "next/navigation";

import { prisma } from "@/libs/prisma";
import type { IUser } from "@/types";

import { AuthError } from "@/common/auth/errors";
import { mapSupabaseUserToIUser } from "@/common/auth/map-user";
import { getSupabaseServer } from "@/common/utils/supabase/server";

const profileSelect = {
  name: true,
  email: true,
  avatarUrl: true,
  phone: true,
  role: true,
  addresses: {
    where: { isDefault: true },
    select: {
      carrier: true,
      city: true,
      warehouse: true,
    },
  },
} as const;

type ProfileRecord = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  addresses: Array<{
    carrier: string;
    city: string;
    warehouse: string;
  }>;
};

async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  return prisma.profile.findUnique({
    where: { id: userId },
    select: profileSelect,
  });
}

async function resolveSession() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const profile = await fetchProfile(user.id);
  return { user, profile };
}

export async function getAuthUser() {
  const session = await resolveSession();
  return session?.user ?? null;
}

export async function getCurrentUser(): Promise<IUser | null> {
  const session = await resolveSession();
  if (!session) {
    return null;
  }

  return mapSupabaseUserToIUser(session.user, session.profile);
}

export async function requireAuth(locale: string) {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/${locale}`);
  }

  return user;
}

export async function requireAdmin(locale: string): Promise<IUser> {
  const session = await resolveSession();
  if (!session) {
    redirect(`/${locale}`);
  }

  const { user, profile } = session;

  if (!profile || profile.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  return mapSupabaseUserToIUser(user, profile);
}

export async function assertAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new AuthError("Unauthorized", "UNAUTHORIZED");
  }

  return user;
}

export async function assertAdmin(): Promise<IUser> {
  const session = await resolveSession();
  if (!session) {
    throw new AuthError("Unauthorized", "UNAUTHORIZED");
  }

  const { user, profile } = session;

  if (!profile || profile.role !== "ADMIN") {
    throw new AuthError("Forbidden", "FORBIDDEN");
  }

  return mapSupabaseUserToIUser(user, profile);
}
