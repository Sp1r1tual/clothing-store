import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/profile",
          "/*/cart",
          "/*/admin",
          "/*/auth",
          "/*/favorites",
          "/*/checkout",
          "/*/order",
          "/profile",
          "/cart",
          "/admin",
          "/auth",
          "/favorites",
          "/checkout",
          "/order",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
