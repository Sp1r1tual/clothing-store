import type { IUser } from "@/types";
import type { User } from "@supabase/supabase-js";

type ProfileData = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: IUser["role"];
} | null;

export function mapSupabaseUserToIUser(user: User, profile: ProfileData): IUser {
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    name:
      profile?.name || metadata.full_name || metadata.name || user.email?.split("@")[0] || "User",
    email: profile?.email || user.email || "",
    avatar: profile?.avatarUrl || metadata.avatar_url || undefined,
    phone: profile?.phone || user.phone || metadata.phone || undefined,
    role: profile?.role ?? "CUSTOMER",
  };
}
