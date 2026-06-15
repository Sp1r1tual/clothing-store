import Skeleton from "react-loading-skeleton";

import styles from "./CartSummarySkeleton.module.css";

export const CartSummarySkeleton = () => {
  return (
    <div className={styles.summary}>
      <Skeleton width={120} height={24} style={{ marginBottom: "1.25rem" }} />

      <div className={styles.rows}>
        <div className={styles.row}>
          <Skeleton width={70} height={16} />
          <Skeleton width={90} height={16} />
        </div>
        <div className={styles.row}>
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <Skeleton width={50} height={20} />
        <Skeleton width={100} height={20} />
      </div>

      <Skeleton height={48} borderRadius={10} style={{ marginTop: "1.5rem" }} />
    </div>
  );
};
