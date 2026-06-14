import { ReactNode } from "react";

import { AdminSidebar } from "./AdminSidebar/AdminSidebar";

import styles from "./AdminLayout.module.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
