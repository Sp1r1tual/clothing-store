export type FavoriteProduct = {
  id: string;
  favoriteId: string;
  product: {
    id: string;
    nameUk: string;
    nameEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string; stock: number }[];
    category: { slug: string };
  };
};
