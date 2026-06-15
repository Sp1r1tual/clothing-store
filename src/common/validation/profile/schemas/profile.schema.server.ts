import { getTranslations } from "next-intl/server";

import { createProfileSchema } from "./profile.schema";

export async function getProfileSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Profile" });

  return createProfileSchema({
    nameMin: t("validation.nameMin"),
    nameMax: t("validation.nameMax"),
    nameRegex: t("validation.nameRegex"),
    phoneMax: t("validation.phoneMax"),
    phoneRegex: t("validation.phoneRegex"),
  });
}
