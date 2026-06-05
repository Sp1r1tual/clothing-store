import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, { message: "Пошуковий запит не може бути порожнім" })
    .max(100, { message: "Пошуковий запит занадто довгий" }),
});

export type SearchFormData = z.infer<typeof searchSchema>;
