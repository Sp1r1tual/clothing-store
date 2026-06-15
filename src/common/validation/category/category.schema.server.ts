import { getTranslations } from "next-intl/server";

import { createCategorySchema } from "./category.schema";

export async function getCategorySchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Admin.categories.form" });

  return createCategorySchema({
    nameRequired: t("validation.nameRequired"),
    nameMax: t("validation.nameMax"),
    slugRequired: t("validation.slugRequired"),
    slugRegex: t("validation.slugRegex"),
  });
}
