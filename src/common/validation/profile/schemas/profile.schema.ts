import { z } from "zod";

export const CARRIERS = ["NOVA_POSHTA", "UKRPOSHTA", "MEEST"] as const;
export type CarrierType = (typeof CARRIERS)[number];

export interface ProfileSchemaMessages {
  nameMin: string;
  nameMax: string;
  nameRegex: string;
  phoneRequired: string;
  phoneMax: string;
  phoneRegex: string;
  carrierRequired: string;
  cityRequired: string;
  warehouseRequired: string;
}

export const createProfileSchema = (msg: ProfileSchemaMessages) =>
  z.object({
    name: z
      .string()
      .min(2, msg.nameMin)
      .max(32, msg.nameMax)
      .regex(/^[\p{L}\s'-]+$/u, msg.nameRegex),

    phone: z
      .string()
      .min(1, msg.phoneRequired)
      .max(20, msg.phoneMax)
      .regex(/^\+?(?:\d[\s\-()]*){9,15}$/, msg.phoneRegex),

    carrier: z.enum(CARRIERS, {
      message: msg.carrierRequired,
    }),
    city: z.string().min(1, msg.cityRequired).max(100),
    warehouse: z.string().min(1, msg.warehouseRequired).max(100),
  });

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export const getProfileFormSchema = (t: (key: string) => string) =>
  createProfileSchema({
    nameMin: t("validation.nameMin"),
    nameMax: t("validation.nameMax"),
    nameRegex: t("validation.nameRegex"),
    phoneRequired: t("validation.phoneRequired"),
    phoneMax: t("validation.phoneMax"),
    phoneRegex: t("validation.phoneRegex"),
    carrierRequired: t("validation.carrierRequired"),
    cityRequired: t("validation.cityRequired"),
    warehouseRequired: t("validation.warehouseRequired"),
  });
