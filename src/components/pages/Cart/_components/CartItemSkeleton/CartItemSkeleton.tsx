import Skeleton from "react-loading-skeleton";

import styles from "./CartItemSkeleton.module.css";

export const CartItemSkeleton = () => {
  return (
    <div className={styles.item}>
      <Skeleton width={100} height={130} borderRadius={10} />

      <div className={styles.details}>
        <div className={styles.header}>
          <Skeleton width="60%" height={18} borderRadius={4} />
          <Skeleton width={28} height={28} circle />
        </div>

        <Skeleton width={72} height={22} borderRadius={20} />

        <div className={styles.footer}>
          <Skeleton width={100} height={32} borderRadius={8} />
          <Skeleton width={90} height={20} borderRadius={4} />
        </div>
      </div>
    </div>
  );
};
