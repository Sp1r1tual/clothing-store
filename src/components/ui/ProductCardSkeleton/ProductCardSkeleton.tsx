import Skeleton from "react-loading-skeleton";

import styles from "./ProductCardSkeleton.module.css";

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton = ({ count = 8 }: ProductCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton className={styles.image} />
          <div className={styles.info}>
            <Skeleton width="75%" height={18} />
            <Skeleton width="45%" height={16} />
          </div>
        </div>
      ))}
    </>
  );
};
