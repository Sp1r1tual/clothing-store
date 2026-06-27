export function getSeoAlternates(locale: string, path: string = "") {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      uk: `${BASE_URL}/uk${path}`,
      en: `${BASE_URL}/en${path}`,
    },
  };
}
