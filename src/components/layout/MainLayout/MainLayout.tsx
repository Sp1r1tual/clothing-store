import { ReactNode } from "react";

import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};
