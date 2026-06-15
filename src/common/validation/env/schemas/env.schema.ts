import { z } from "zod";

const isServer = typeof window === "undefined";

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  DATABASE_URL: isServer ? z.string().min(1) : z.string().optional(),
  DIRECT_URL: isServer ? z.string().min(1) : z.string().optional(),
});
