"use server";

import type { IUser } from "@/types";

import { getCurrentUser } from "@/common/auth/server";

export async function getCurrentUserAction(): Promise<IUser | null> {
  return getCurrentUser();
}
