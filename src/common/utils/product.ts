export const calculateDiscountPercentage = (
  price: number,
  discountPrice: number | null | undefined,
): number => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};
