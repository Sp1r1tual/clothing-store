import { z } from "zod";

export const updateOrderContactSchema = z.object({
  contactName: z.string().min(1).max(255),
  contactEmail: z.email().max(255),
  contactPhone: z.string().min(1).max(50),
  shippingAddress: z.string().min(1).max(1000),
});

export type UpdateOrderContactSchemaType = z.infer<typeof updateOrderContactSchema>;
