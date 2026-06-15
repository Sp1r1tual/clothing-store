"use server";

import { updateProfile } from "@/db/profile";

import { assertAuth } from "@/common/auth/server";
import { type ProfileFormData } from "@/common/validation/profile/schemas/profile.schema";
import { getProfileSchema } from "@/common/validation/profile/schemas/profile.schema.server";

export async function updateProfileAction(data: ProfileFormData, locale: string) {
  const user = await assertAuth();
  const schema = await getProfileSchema(locale);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { name, phone } = result.data;

  return updateProfile(user.id, {
    name,
    phone: phone || null,
  });
}
