import { z } from "zod";

export const getSearchSchema = (t: (key: string) => string) =>
  z.object({
    query: z
      .string()
      .trim()
      .min(1, { message: t("validation.empty") })
      .max(100, { message: t("validation.tooLong") }),
  });

export type SearchFormData = {
  query: string;
};
