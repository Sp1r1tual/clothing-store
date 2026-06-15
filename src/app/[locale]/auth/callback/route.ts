import { type NextRequest, NextResponse } from "next/server";

import { upsertUserProfile } from "@/db/profile";

import { sanitizeNextPath } from "@/common/auth/routes";
import { limiter } from "@/common/utils/rate-limit";
import { createSupabaseRouteHandlerClient } from "@/common/utils/supabase/route-handler";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { locale } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = sanitizeNextPath(searchParams.get("next"));

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  try {
    await limiter.check(10, `auth_${ip}`);
  } catch {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = `/${locale}${next}`;
  redirectTo.searchParams.delete("code");
  redirectTo.searchParams.delete("next");

  if (error) {
    redirectTo.pathname = `/${locale}/auth/auth-code-error`;
    return NextResponse.redirect(redirectTo);
  }

  if (!code) {
    return NextResponse.redirect(redirectTo);
  }

  const response = NextResponse.redirect(redirectTo);
  const supabase = createSupabaseRouteHandlerClient(request, response);
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data?.user) {
    redirectTo.pathname = `/${locale}/auth/auth-code-error`;
    return NextResponse.redirect(redirectTo);
  }

  const { user } = data;
  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0] || "User";

  try {
    await upsertUserProfile(user.id, {
      name,
      email: user.email,
      avatarUrl: metadata.avatar_url || "",
      phone: metadata.phone || user.phone || "",
    });
  } catch (dbError) {
    console.error("Failed to sync profile:", dbError);
    redirectTo.pathname = `/${locale}/auth/auth-code-error`;
    return NextResponse.redirect(redirectTo);
  }

  return response;
}
