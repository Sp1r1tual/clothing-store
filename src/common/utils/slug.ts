/**
 * Converts a string to a URL-friendly slug.
 * e.g. "Hello World" → "hello-world"
 */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .trim();
}
