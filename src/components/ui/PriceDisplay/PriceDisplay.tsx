import { useLocale } from "next-intl";

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

  const formatPrice = (value: number) => {
    const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", {
      maximumFractionDigits: 0,
    }).format(value);
    return locale === "uk" ? `${formatted} грн` : `${formatted} UAH`;
  };

  const hasDiscount =
    discountPrice !== null && discountPrice !== undefined && discountPrice < price;

  return (
    <div className={`${styles.container} ${styles[size]} ${className}`}>
      {hasDiscount ? (
        <>
          <span className={styles.discountPrice}>{formatPrice(discountPrice)}</span>
          <span className={styles.originalPrice}>{formatPrice(price)}</span>
        </>
      ) : (
        <span className={styles.regularPrice}>{formatPrice(price)}</span>
      )}
    </div>
  );
};
