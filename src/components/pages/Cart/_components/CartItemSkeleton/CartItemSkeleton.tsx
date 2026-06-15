import Skeleton from "react-loading-skeleton";

import styles from "./CartItemSkeleton.module.css";

export const CartItemSkeleton = () => {
  return (
    <div className={styles.item}>
      <Skeleton width={100} height={130} borderRadius={10} />

      <div className={styles.details}>
        <div className={styles.header}>
          <Skeleton width="60%" height={18} />
          <Skeleton width={28} height={28} circle />
        </div>

        <Skeleton width={80} height={22} borderRadius={20} />

        <div className={styles.footer}>
          <Skeleton width={100} height={34} borderRadius={8} />
          <Skeleton width={80} height={20} />
        </div>
      </div>
    </div>
  );
};
