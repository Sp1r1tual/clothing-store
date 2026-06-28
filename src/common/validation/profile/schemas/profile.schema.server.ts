import { getTranslations } from "next-intl/server";

import { getProfileFormSchema } from "./profile.schema";

export async function getProfileSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Profile" });

  return getProfileFormSchema(t);
}
