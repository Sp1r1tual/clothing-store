import { useLocale } from "next-intl";

import { formatPrice } from "@/common/utils/format";

import styles from "./PriceDisplay.module.css";

interface PriceDisplayProps {
  price: number;
  discountPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceDisplay = ({
  price,
  discountPrice,
  size = "md",
  className = "",
}: PriceDisplayProps) => {
  const locale = useLocale();

  const hasDiscount =
    discountPrice !== null && discountPrice !== undefined && discountPrice < price;

  return (
    <div className={`${styles.container} ${styles[size]} ${className}`}>
      {hasDiscount ? (
        <>
          <span className={styles.discountPrice}>
            {formatPrice(discountPrice as number, locale)}
          </span>
          <span className={styles.originalPrice}>{formatPrice(price, locale)}</span>
        </>
      ) : (
        <span className={styles.regularPrice}>{formatPrice(price, locale)}</span>
      )}
    </div>
  );
};
