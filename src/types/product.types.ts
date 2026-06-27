export interface ProductFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}
