import { type NextRequest, NextResponse } from "next/server";

import { syncUserProfileAction } from "@/db/profile.db";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/common/validation/env/env";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { locale } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/profile";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = `/${locale}${next}`;
  redirectTo.searchParams.delete("code");

  if (error) {
    redirectTo.pathname = `/${locale}/auth/auth-code-error`;
    return NextResponse.redirect(redirectTo);
  }

  if (code) {
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set({ name, value, ...options }),
            );
          },
        },
      },
    );

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError && data?.user) {
      const { user } = data;
      const name =
        user.user_metadata.full_name ||
        user.user_metadata.name ||
        user.email?.split("@")[0] ||
        "User";
      const avatarUrl = user.user_metadata.avatar_url || "";
      const phone = user.user_metadata.phone || user.phone || "";

      try {
        await syncUserProfileAction(user.id, {
          name,
          email: user.email,
          avatarUrl,
          phone,
        });
      } catch (dbError) {
        console.error("Failed to sync profile during Google auth callback:", dbError);
        redirectTo.pathname = `/${locale}/auth/auth-code-error`;
        return NextResponse.redirect(redirectTo);
      }

      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    } else {
      redirectTo.pathname = `/${locale}/auth/auth-code-error`;
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(redirectTo);
}
