import { type NextRequest, NextResponse } from "next/server";

import { upsertUserProfile } from "@/db/profile.db";

import { createSupabaseServerClient } from "@/common/utils/supabase/supabase.utils";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createSupabaseServerClient(request, response);

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

    const json = NextResponse.json({ ok: true });
    response.cookies.getAll().forEach((c) => json.cookies.set(c));
    return json;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to sync profile:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
