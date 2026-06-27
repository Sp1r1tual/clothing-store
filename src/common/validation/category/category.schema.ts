import { z } from "zod";

export interface CategorySchemaMessages {
  nameRequired: string;
  nameMax: string;
  slugRequired: string;
  slugRegex: string;
}

export const createCategorySchema = (msg: CategorySchemaMessages) =>
  z.object({
    nameUk: z.string().min(1, msg.nameRequired).max(255, msg.nameMax),
    nameEn: z.string().min(1, msg.nameRequired).max(255, msg.nameMax),
    slug: z
      .string()
      .min(1, msg.slugRequired)
      .regex(/^[a-z0-9-]+$/, msg.slugRegex),
    parentId: z.string().optional().nullable(),
    order: z.coerce.number().int().min(0).default(0),
    seoTitleUk: z.string().optional(),
    seoTitleEn: z.string().optional(),
    seoDescriptionUk: z.string().optional(),
    seoDescriptionEn: z.string().optional(),
  });

export type CategoryFormData = z.infer<ReturnType<typeof createCategorySchema>>;
