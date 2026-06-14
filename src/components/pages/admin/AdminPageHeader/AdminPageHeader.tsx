import { ReactNode } from "react";

import styles from "./AdminPageHeader.module.css";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const AdminPageHeader = ({ title, subtitle, action }: AdminPageHeaderProps) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.actionSlot}>{action}</div>}
    </div>
  );
};
