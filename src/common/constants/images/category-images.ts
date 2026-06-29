export const CATEGORY_IMAGES = {
  ACCESSORIES:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/categories-images/accessories.webp",
  UNISEX_SHOES:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/categories-images/shoes.webp",
  UNISEX_OUTERWEAR:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/categories-images/outerwear.webp",
  UNISEX_PANTS:
    "https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/categories-images/pants.webp",
} as const;

export type CategoryImageKey = keyof typeof CATEGORY_IMAGES;
