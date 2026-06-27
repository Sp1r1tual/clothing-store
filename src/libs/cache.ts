import { LRUCache } from "lru-cache";

const ONE_MINUTE = 1000 * 60;
const FIVE_MINUTES = ONE_MINUTE * 5;

/**
 * Cache for category data — categories change rarely (admin operations).
 * TTL: 5 minutes. Max: 200 entries.
 */
export const categoryCache = new LRUCache<string, object>({
  max: 200,
  ttl: FIVE_MINUTES,
});

/**
 * Cache for individual product pages — products change rarely.
 * TTL: 5 minutes. Max: 500 entries.
 */
export const productCache = new LRUCache<string, object>({
  max: 500,
  ttl: FIVE_MINUTES,
});

/**
 * Invalidate all entries in the category cache.
 * Call this after any category create/update/delete.
 */
export function invalidateCategoryCache() {
  categoryCache.clear();
}

/**
 * Invalidate a specific product by slug from the product cache.
 * Call this after a product update or soft-delete.
 */
export function invalidateProductCache(slug: string) {
  productCache.delete(`product:slug:${slug}`);
}
