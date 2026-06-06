import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { routing } from "./i18n/navigation";

import { env } from "@/common/validation/env/env";

const intlMiddleware = createMiddleware(routing);
const PROTECTED_ROUTES = ["/profile"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = intlMiddleware(request);

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.match(new RegExp(`^/(uk|en)${route}`)),
  );

  if (!isProtected) return response;

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[proxy]", pathname, "| user:", user?.email ?? "NO USER");

  if (!user) {
    const locale = pathname.split("/")[1] ?? "uk";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/(uk|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
