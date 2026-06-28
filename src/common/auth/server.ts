import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import type { IUser } from "@/types";

import { AuthError } from "@/common/auth/errors";

const userSelect = {
  name: true,
  email: true,
  image: true,
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

type UserRecord = {
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  addresses: Array<{
    carrier: string;
    city: string;
    warehouse: string;
  }>;
};

async function fetchUser(userId: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
}

async function resolveSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await fetchUser(session.user.id);
  return user ? { sessionUser: session.user, user } : null;
}

async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getCurrentUser(): Promise<IUser | null> {
  const resolved = await resolveSession();
  if (!resolved) return null;

  return mapToIUser(resolved.sessionUser, resolved.user);
}

export async function requireAuth(locale: string) {
  const userId = await getAuthUserId();
  if (!userId) {
    redirect(`/${locale}`);
  }
  return { id: userId };
}

export async function requireAdmin(locale: string): Promise<IUser> {
  const resolved = await resolveSession();
  if (!resolved) {
    redirect(`/${locale}`);
  }

  const { sessionUser, user } = resolved;

  if (user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  return mapToIUser(sessionUser, user);
}

export async function assertAuth() {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new AuthError("Unauthorized", "UNAUTHORIZED");
  }
  return { id: userId };
}

export async function assertAdmin(): Promise<IUser> {
  const resolved = await resolveSession();
  if (!resolved) {
    throw new AuthError("Unauthorized", "UNAUTHORIZED");
  }

  const { sessionUser, user } = resolved;

  if (user.role !== "ADMIN") {
    throw new AuthError("Forbidden", "FORBIDDEN");
  }

  return mapToIUser(sessionUser, user);
}

function mapToIUser(
  sessionUser: { id?: string; name?: string | null; email?: string | null; image?: string | null },
  user: UserRecord,
): IUser {
  const defaultAddr = user.addresses?.[0] || null;
  return {
    id: sessionUser.id ?? "",
    name: user.name || sessionUser.name || sessionUser.email?.split("@")[0] || "User",
    email: user.email || sessionUser.email || "",
    avatar: user.image || sessionUser.image || undefined,
    phone: user.phone || undefined,
    role: user.role ?? "CUSTOMER",
    address: defaultAddr
      ? {
          carrier: defaultAddr.carrier,
          city: defaultAddr.city,
          warehouse: defaultAddr.warehouse,
        }
      : null,
  };
}
