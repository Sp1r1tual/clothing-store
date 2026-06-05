"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

import { SearchFormData, searchSchema } from "./schemas/search.schema";

import styles from "./SearchInput.module.css";

export const SearchInput = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
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
        placeholder="Пошук"
        aria-label="Search"
      />
      <button type="submit" className={styles.searchButton} aria-label="Submit search">
        <Search className={styles.searchIcon} size={18} />
      </button>
    </form>
  );
};
