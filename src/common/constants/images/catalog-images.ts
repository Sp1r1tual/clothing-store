export const CATALOG_IMAGES = {
  MEN: "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/men.webp",
  WOMEN:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/women.webp",
  UNISEX:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/unisex.webp",
  ACCESSORIES:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/accessories.webp",
  NEW_ARRIVALS:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/new-arrivals.webp",
  SALE: "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/catalog-images/sale.webp",
} as const;

export type CatalogImageKey = keyof typeof CATALOG_IMAGES;
