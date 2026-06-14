"use server";

import { getTranslations } from "next-intl/server";

import { updateProfile } from "@/db/profile";

import { assertAuth } from "@/common/auth/server";
import {
  type ProfileFormData,
  createProfileSchema,
} from "@/common/validation/profile/schemas/profile.schema";

async function getProfileSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Profile" });

  return createProfileSchema({
    nameMin: t("validation.nameMin"),
    nameMax: t("validation.nameMax"),
    nameRegex: t("validation.nameRegex"),
    phoneMax: t("validation.phoneMax"),
    phoneRegex: t("validation.phoneRegex"),
  });
}

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
