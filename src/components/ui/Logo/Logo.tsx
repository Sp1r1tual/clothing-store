import { Link } from "@/i18n/navigation";

import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      className={`${styles.logoLink} ${className || ""}`}
      aria-label="X-Weevo — на головну"
    >
      <span className={styles.logoBlack}>X-</span>
      <span className={styles.logoOrange}>WEEVO</span>
    </Link>
  );
};
