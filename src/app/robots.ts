import { MetadataRoute } from "next";

import { BASE_URL } from "@/common/constants/env";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
