import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/navigation";

import { isAuthRequiredPath, parseLocalizedPathname } from "@/common/auth/routes";
import { createSupabaseMiddlewareClient } from "@/common/utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const { locale, path } = parseLocalizedPathname(pathname);

  if (!isAuthRequiredPath(path)) {
    return intlMiddleware(request);
  }

  const response = intlMiddleware(request);
  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (request.headers.has("next-action")) {
      return response;
    }
    const loginUrl = new URL(`/${locale}`, request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(uk|en)/:path*", "/((?!_next|_vercel|api|.*\\..*).*)"],
};
