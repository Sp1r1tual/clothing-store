import { routing } from "@/i18n/navigation";

const AUTH_REQUIRED_ROUTES = ["/profile", "/admin"] as const;

export function parseLocalizedPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = routing.locales.includes(maybeLocale as (typeof routing.locales)[number]);

  const locale = hasLocale ? maybeLocale : routing.defaultLocale;
  const path = hasLocale ? `/${segments.slice(1).join("/")}` || "/" : pathname;

  return { locale, path };
}

export function isAuthRequiredPath(path: string): boolean {
  return AUTH_REQUIRED_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}

export function sanitizeNextPath(next: string | null, fallback = "/profile"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }

  return next;
}
