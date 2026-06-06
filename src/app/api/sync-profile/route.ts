import { type NextRequest, NextResponse } from "next/server";

import { upsertUserProfile } from "@/db/profile.db";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/common/validation/env/env";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const meta = user.user_metadata;
  const name = meta.full_name || meta.name || user.email?.split("@")[0] || "User";
  const avatarUrl = meta.avatar_url || "";
  const phone = meta.phone || user.phone || "";

  try {
    await upsertUserProfile(user.id, {
      name,
      email: user.email,
      avatarUrl,
      phone,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to sync profile:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
