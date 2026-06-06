import { z } from "zod";

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
  });

export const profileSchema = createProfileSchema({
  nameMin: "Name must contain at least 2 characters",
  nameMax: "Name cannot exceed 32 characters",
  nameRegex: "Name can only contain letters, spaces, hyphens, and apostrophes",
  phoneMax: "Phone number cannot exceed 20 characters",
  phoneRegex: "Invalid phone number format (e.g. +380...)",
});

export type ProfileFormData = z.infer<typeof profileSchema>;
