import { revalidatePath } from "next/cache";

import { routing } from "@/i18n/navigation";

export function revalidateLocalizedPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${normalizedPath}`);
  }
}
