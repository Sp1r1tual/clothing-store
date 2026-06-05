"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

import { SearchFormData, getSearchSchema } from "./schemas/search.schema";

import styles from "./SearchInput.module.css";

export const SearchInput = () => {
  const router = useRouter();
  const tSearch = useTranslations("Search");
  const tNavbar = useTranslations("Navbar");

  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(getSearchSchema(tSearch)),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    router.push(`/search?q=${encodeURIComponent(data.query)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.searchWrapper}>
      <input
        {...register("query")}
        className={styles.searchInput}
        type="text"
        placeholder={tNavbar("searchPlaceholder")}
        aria-label="Search"
      />
      <button type="submit" className={styles.searchButton} aria-label="Submit search">
        <Search className={styles.searchIcon} size={18} />
      </button>
    </form>
  );
};
