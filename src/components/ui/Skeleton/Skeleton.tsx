import ReactSkeleton from "react-loading-skeleton";

import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: "text" | "rect" | "circle" | "card";
}

export const Skeleton = ({
  width,
  height,
  borderRadius,
  className = "",
  variant = "rect",
}: SkeletonProps) => {
  const classes = [styles[variant], className].filter(Boolean).join(" ");

  return (
    <ReactSkeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      circle={variant === "circle"}
      className={classes}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className={styles.productCard}>
      <Skeleton variant="rect" className={styles.productImage} />
      <div className={styles.productInfo}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="40%" height={14} />
        <Skeleton width="50%" height={18} />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
