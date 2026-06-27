import { z } from "zod";

export const CARRIERS = ["NOVA_POSHTA", "UKRPOSHTA", "MEEST"] as const;
export type CarrierType = (typeof CARRIERS)[number];

export interface ProfileSchemaMessages {
  nameMin: string;
  nameMax: string;
  nameRegex: string;
  phoneMax: string;
  phoneRegex: string;
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
      .max(20, msg.phoneMax)
      .regex(/^\+?(?:\d[\s\-()]*){9,15}$/, msg.phoneRegex)
      .optional()
      .or(z.literal("")),

    carrier: z.enum(CARRIERS).optional().nullable().or(z.literal("")),
    city: z.string().max(100).optional().nullable().or(z.literal("")),
    warehouse: z.string().max(100).optional().nullable().or(z.literal("")),
  });

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;
