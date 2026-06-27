export type CartItemWithProduct = {
  id: string;
  quantity: number;
  productId: string;
  variantId: string | null;
  product: {
    id: string;
    nameUk: string;
    nameEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: { url: string; altText: string | null }[];
  };
  variant: {
    id: string;
    size: string;
    colorUk: string | null;
    colorEn: string | null;
  } | null;
};
