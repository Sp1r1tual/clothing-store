import { z } from "zod";

export const CARRIERS = ["NOVA_POSHTA", "UKRPOSHTA", "MEEST"] as const;
export type CarrierType = (typeof CARRIERS)[number];

export const addressSchema = z.object({
  carrier: z.enum(["NOVA_POSHTA", "UKRPOSHTA", "MEEST"]),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters")
    .regex(
      /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/,
      "City name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  warehouse: z
    .string()
    .trim()
    .min(1, "Branch/Warehouse number is required")
    .max(50, "Branch/Warehouse cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9а-яА-ЯёЁіІїЇєЄґҐ\s\-/№#]+$/, "Invalid format for branch/warehouse"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export interface AddressModalSchemaMessages {
  phoneRequired: string;
  phoneMax: string;
  phoneRegex: string;
}

export const createAddressModalSchema = (hasPhone: boolean, msg: AddressModalSchemaMessages) => {
  if (hasPhone) return addressSchema;

  return addressSchema.extend({
    phone: z
      .string()
      .min(1, msg.phoneRequired)
      .max(20, msg.phoneMax)
      .regex(/^\+?(?:\d[\s\-()]*){9,15}$/, msg.phoneRegex),
  });
};

export const getAddressModalSchema = (hasPhone: boolean, t: (key: string) => string) => {
  return createAddressModalSchema(hasPhone, {
    phoneRequired: t("validation.phoneRequired"),
    phoneMax: t("validation.phoneMax"),
    phoneRegex: t("validation.phoneRegex"),
  });
};
