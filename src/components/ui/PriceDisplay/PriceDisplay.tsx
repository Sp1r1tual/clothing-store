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
  const formatPrice = (value: number) => {
    const formatted = new Intl.NumberFormat("uk-UA", {
      maximumFractionDigits: 0,
    }).format(value);
    return `${formatted} грн`;
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
