import Skeleton from "react-loading-skeleton";

import styles from "./ProfilePageSkeleton.module.css";

export const ProfilePageSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton width={90} height={36} borderRadius={8} />

      <div className={styles.profileHeader}>
        <div className={styles.viewProfile}>
          <Skeleton circle width={90} height={90} />

          <div className={styles.profileMeta}>
            <Skeleton width={200} height={28} borderRadius={6} style={{ marginBottom: 8 }} />

            <Skeleton width={260} height={18} borderRadius={4} style={{ marginBottom: 8 }} />

            <Skeleton width={160} height={16} borderRadius={4} style={{ marginBottom: 12 }} />

            <Skeleton width={300} height={16} borderRadius={4} />
          </div>

          <div className={styles.headerActions}>
            <Skeleton width={120} height={40} borderRadius={8} />
            <Skeleton width={100} height={40} borderRadius={8} />
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <Skeleton width={180} height={22} borderRadius={4} style={{ marginBottom: 24 }} />
        <div className={styles.ordersList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <Skeleton width={110} height={18} borderRadius={4} />
                <Skeleton width={90} height={14} borderRadius={3} />
                <Skeleton width={60} height={13} borderRadius={3} />
              </div>

              <div className={styles.orderMeta}>
                <Skeleton width={80} height={20} borderRadius={4} />
                <Skeleton width={90} height={28} borderRadius={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
