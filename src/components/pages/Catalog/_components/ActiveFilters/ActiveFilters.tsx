"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

import { usePathname, useRouter } from "@/i18n/navigation";

import { Chip } from "@/components/ui/Chip/Chip";

import styles from "./ActiveFilters.module.css";

export const ActiveFilters = () => {
  const t = useTranslations("Catalog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loader = useTopLoader();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sizes = searchParams.getAll("size");

  const hasFilters = minPrice || maxPrice || sizes.length > 0;

  if (!hasFilters) return null;

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      const currentValues = params.getAll(key);
      params.delete(key);
      currentValues.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      params.delete(key);
    }

    params.delete("page");
    loader.start();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("size");
    params.delete("page");
    loader.start();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.container}>
      {sizes.map((size) => (
        <Chip
          key={`size-${size}`}
          label={`${t("filters.sizes")}: ${size}`}
          removable
          onRemove={() => removeFilter("size", size)}
          size="sm"
        />
      ))}

      {(minPrice || maxPrice) && (
        <Chip
          label={`${t("filters.price")}: ${minPrice ? `${t("filters.min")} ${minPrice}` : ""} ${maxPrice ? `${t("filters.max")} ${maxPrice}` : ""}`}
          removable
          onRemove={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("minPrice");
            params.delete("maxPrice");
            params.delete("page");
            loader.start();
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
          size="sm"
        />
      )}

      <button className={styles.clearBtn} onClick={clearAll}>
        {t("filters.clear")}
      </button>
    </div>
  );
};
