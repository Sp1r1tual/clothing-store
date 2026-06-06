import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/navigation";

import { createSupabaseServerClient } from "@/common/utils/supabase/supabase.utils";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ["/profile"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.match(new RegExp(`^/(uk|en)${route}`)),
  );

  if (isProtected) {
    const response = NextResponse.next();

    const supabase = createSupabaseServerClient(request, response);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const locale = pathname.split("/")[1] ?? "uk";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(uk|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
