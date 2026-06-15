"use client";

import { useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

import { usePathname, useRouter } from "@/i18n/navigation";

import { Chip } from "@/components/ui/Chip/Chip";

import styles from "./SubcategoryBar.module.css";

interface Subcategory {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  _count?: { products: number };
}

interface SubcategoryBarProps {
  subcategories: Subcategory[];
  locale: string;
}

export const SubcategoryBar = ({ subcategories, locale }: SubcategoryBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loader = useTopLoader();

  const currentSubcategory = searchParams.get("subcategory");

  const handleSubcategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSubcategory === slug) {
      params.delete("subcategory");
    } else {
      params.set("subcategory", slug);
    }

    params.delete("page");

    loader.start();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (subcategories.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.scrollArea}>
        {subcategories.map((sub) => {
          const name = locale === "en" ? sub.nameEn : sub.nameUk;
          const isActive = currentSubcategory === sub.slug;

          return (
            <Chip
              key={sub.id}
              label={name}
              count={sub._count?.products}
              isActive={isActive}
              onClick={() => handleSubcategoryClick(sub.slug)}
              variant="outline"
              className={styles.chip}
            />
          );
        })}
      </div>
    </div>
  );
};
